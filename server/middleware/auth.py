"""JWT authentication dependency — equivalent of auth.ts + isAdmin.ts."""
import os
import jwt
from fastapi import Header, HTTPException, Depends

JWT_SECRET = os.getenv("JWT_SECRET", "")
ALGORITHM = "HS256"


def require_auth(authorization: str | None = Header(default=None)) -> dict:
    """FastAPI dependency: validate Bearer token, return {user_id, role}."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization[7:]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return {"user_id": int(payload["userId"]), "role": payload["role"]}
    except (jwt.PyJWTError, KeyError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def require_admin(auth: dict = Depends(require_auth)) -> dict:
    """FastAPI dependency: additionally require admin role."""
    if auth["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return auth
