"""Auth routes — equivalent of routes/auth.ts.

POST /api/auth/register  — multipart/form-data (username, password, avatar?)
POST /api/auth/login     — JSON {username, password}
GET  /api/auth/me        — JWT required
"""
import io
import os
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

import bcrypt as _bcrypt

from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, File
from jose import jwt
from PIL import Image
from pydantic import BaseModel

from db.database import get_db
from middleware.auth import require_auth, ALGORITHM
from services.avatar_service import get_dicebear_url
from utils.password_validator import get_password_rules, validate_password

router = APIRouter()


def _hash_password(plain: str) -> str:
    return _bcrypt.hashpw(plain.encode(), _bcrypt.gensalt(rounds=12)).decode()


def _verify_password(plain: str, hashed: str) -> bool:
    return _bcrypt.checkpw(plain.encode(), hashed.encode())

JWT_SECRET = os.getenv("JWT_SECRET", "")
UPLOADS_DIR = os.getenv("UPLOADS_DIR", "./uploads")
_ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp", "image/gif"}
_MAX_AVATAR_BYTES = 5 * 1024 * 1024  # 5 MB


def _parse_expiry_seconds(exp_str: str) -> int:
    """Convert '7d', '24h', '60m' to seconds."""
    unit = exp_str[-1]
    val = int(exp_str[:-1])
    return {"d": 86400, "h": 3600, "m": 60}.get(unit, 3600) * val


def _create_token(user_id: int, role: str) -> str:
    exp_str = os.getenv("JWT_EXPIRES_IN", "7d")
    expires = datetime.now(timezone.utc) + timedelta(
        seconds=_parse_expiry_seconds(exp_str)
    )
    return jwt.encode(
        {"userId": user_id, "role": role, "exp": expires},
        JWT_SECRET,
        algorithm=ALGORITHM,
    )


async def _save_avatar(file: UploadFile) -> str:
    """Resize uploaded image to 128×128 JPEG and return the /uploads/… URL."""
    if file.content_type not in _ALLOWED_MIME:
        raise HTTPException(400, "Only JPEG, PNG, WebP, and GIF images are allowed")

    data = await file.read()
    if len(data) > _MAX_AVATAR_BYTES:
        raise HTTPException(400, "Avatar must be ≤ 5 MB")

    Path(UPLOADS_DIR).mkdir(parents=True, exist_ok=True)
    stem = uuid.uuid4().hex
    out_path = Path(UPLOADS_DIR) / f"{stem}-r.jpg"

    img = Image.open(io.BytesIO(data)).convert("RGB")
    img = img.resize((128, 128), Image.LANCZOS)
    img.save(str(out_path), "JPEG", quality=85)

    return f"/uploads/{stem}-r.jpg"


# ── POST /register ────────────────────────────────────────────────────────────
@router.post("/register", status_code=201)
async def register(
    username: str = Form(...),
    password: str = Form(...),
    avatar: UploadFile | None = File(default=None),
):
    if len(username) < 3 or len(username) > 30:
        raise HTTPException(400, "Username must be 3–30 characters")

    rules = get_password_rules()
    err = validate_password(password, rules)
    if err:
        raise HTTPException(400, err)

    conn = get_db()
    if conn.execute("SELECT id FROM users WHERE username = ?", (username,)).fetchone():
        raise HTTPException(409, "Username already taken")

    pw_hash = _hash_password(password)

    avatar_url: str | None = None
    if avatar and avatar.filename:
        avatar_url = await _save_avatar(avatar)

    cur = conn.execute(
        "INSERT INTO users (username, password, avatar_url) VALUES (?, ?, ?)",
        (username, pw_hash, avatar_url),
    )
    conn.commit()
    user_id = cur.lastrowid

    return {
        "token": _create_token(user_id, "user"),
        "user": {
            "id": user_id,
            "username": username,
            "avatar_url": avatar_url or get_dicebear_url(username),
            "role": "user",
        },
    }


# ── POST /login ───────────────────────────────────────────────────────────────
class LoginBody(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(body: LoginBody):
    conn = get_db()
    user = conn.execute(
        "SELECT id, username, password, role, avatar_url FROM users WHERE username = ?",
        (body.username,),
    ).fetchone()

    if not user or not _verify_password(body.password, user["password"]):
        raise HTTPException(401, "Invalid username or password")

    return {
        "token": _create_token(user["id"], user["role"]),
        "user": {
            "id": user["id"],
            "username": user["username"],
            "avatar_url": user["avatar_url"] or get_dicebear_url(user["username"]),
            "role": user["role"],
        },
    }


# ── GET /me ───────────────────────────────────────────────────────────────────
@router.get("/me")
def me(auth: dict = Depends(require_auth)):
    conn = get_db()
    user = conn.execute(
        """
        SELECT u.id, u.username, u.avatar_url, u.role,
               COALESCE(SUM(t.points_awarded), 0) AS total_points
        FROM   users u
        LEFT JOIN tips t ON t.user_id = u.id
        WHERE  u.id = ?
        GROUP BY u.id
        """,
        (auth["user_id"],),
    ).fetchone()

    if not user:
        raise HTTPException(404, "User not found")

    return {
        "id": user["id"],
        "username": user["username"],
        "avatar_url": user["avatar_url"] or get_dicebear_url(user["username"]),
        "role": user["role"],
        "total_points": user["total_points"],
    }
