"""Users routes — equivalent of routes/users.ts.

PUT    /api/users/me           — update profile picture (multipart)
PUT    /api/users/me/password  — change password (JSON)
DELETE /api/users/me/avatar    — revert to DiceBear
"""
import io
import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from passlib.context import CryptContext
from PIL import Image
from pydantic import BaseModel

from db.database import get_db
from middleware.auth import require_auth
from services.avatar_service import get_dicebear_url
from utils.password_validator import get_password_rules, validate_password

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

UPLOADS_DIR = os.getenv("UPLOADS_DIR", "./uploads")
_ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp", "image/gif"}
_MAX_BYTES = 5 * 1024 * 1024


async def _save_avatar(file: UploadFile) -> str:
    if file.content_type not in _ALLOWED_MIME:
        raise HTTPException(400, "Only JPEG, PNG, WebP, and GIF images are allowed")
    data = await file.read()
    if len(data) > _MAX_BYTES:
        raise HTTPException(400, "Avatar must be ≤ 5 MB")

    Path(UPLOADS_DIR).mkdir(parents=True, exist_ok=True)
    stem = uuid.uuid4().hex
    out_path = Path(UPLOADS_DIR) / f"{stem}-r.jpg"
    img = Image.open(io.BytesIO(data)).convert("RGB")
    img = img.resize((128, 128), Image.LANCZOS)
    img.save(str(out_path), "JPEG", quality=85)
    return f"/uploads/{stem}-r.jpg"


def _delete_avatar_file(avatar_url: str | None) -> None:
    if avatar_url:
        old_path = Path(UPLOADS_DIR) / Path(avatar_url).name
        if old_path.exists():
            old_path.unlink()


# ── PUT /api/users/me ─────────────────────────────────────────────────────────
@router.put("/me")
async def update_avatar(
    avatar: UploadFile = File(...),
    auth: dict = Depends(require_auth),
):
    conn = get_db()
    existing = conn.execute(
        "SELECT avatar_url FROM users WHERE id = ?", (auth["user_id"],)
    ).fetchone()
    _delete_avatar_file(existing["avatar_url"] if existing else None)

    avatar_url = await _save_avatar(avatar)
    conn.execute("UPDATE users SET avatar_url = ? WHERE id = ?", (avatar_url, auth["user_id"]))
    conn.commit()
    return {"avatar_url": avatar_url}


# ── PUT /api/users/me/password ────────────────────────────────────────────────
class PasswordBody(BaseModel):
    currentPassword: str
    newPassword: str


@router.put("/me/password")
async def change_password(body: PasswordBody, auth: dict = Depends(require_auth)):
    conn = get_db()
    user = conn.execute(
        "SELECT id, password FROM users WHERE id = ?", (auth["user_id"],)
    ).fetchone()
    if not user:
        raise HTTPException(404, "User not found")
    if not pwd_context.verify(body.currentPassword, user["password"]):
        raise HTTPException(401, "Aktuelles Passwort ist falsch")

    err = validate_password(body.newPassword, get_password_rules())
    if err:
        raise HTTPException(400, err)

    conn.execute(
        "UPDATE users SET password = ? WHERE id = ?",
        (pwd_context.hash(body.newPassword), auth["user_id"]),
    )
    conn.commit()
    return {"message": "Passwort erfolgreich geändert"}


# ── DELETE /api/users/me/avatar ───────────────────────────────────────────────
@router.delete("/me/avatar")
def delete_avatar(auth: dict = Depends(require_auth)):
    conn = get_db()
    row = conn.execute(
        "SELECT avatar_url, username FROM users WHERE id = ?", (auth["user_id"],)
    ).fetchone()
    _delete_avatar_file(row["avatar_url"] if row else None)
    conn.execute("UPDATE users SET avatar_url = NULL WHERE id = ?", (auth["user_id"],))
    conn.commit()
    return {"avatar_url": get_dicebear_url(row["username"] if row else "")}
