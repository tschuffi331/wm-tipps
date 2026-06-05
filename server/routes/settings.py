"""Public settings route — equivalent of routes/settings.ts.

GET /api/settings/phase  — no auth required
"""
from fastapi import APIRouter

from db.database import get_db

router = APIRouter()


@router.get("/phase")
def get_phase():
    row = get_db().execute(
        "SELECT value FROM settings WHERE key = 'wm_phase'"
    ).fetchone()
    return {"wmPhase": row["value"] if row else "Vorrunde"}
