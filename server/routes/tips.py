"""Tips routes — equivalent of routes/tips.ts.

GET  /api/tips                    — own tips (JWT)
POST /api/tips                    — submit tip (JWT)
PUT  /api/tips/:id                — update tip (JWT)
GET  /api/tips/match/:matchId     — tips for a match after kickoff (JWT)
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from db.database import get_db
from middleware.auth import require_auth

router = APIRouter()


class TipBody(BaseModel):
    matchId: int
    homeGoalsTip: int
    awayGoalsTip: int


class UpdateTipBody(BaseModel):
    homeGoalsTip: int
    awayGoalsTip: int


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _kickoff_dt(kickoff_utc: str) -> datetime:
    return datetime.fromisoformat(kickoff_utc.replace("Z", "+00:00"))


# ── GET /api/tips ─────────────────────────────────────────────────────────────
@router.get("/")
def list_my_tips(auth: dict = Depends(require_auth)):
    conn = get_db()
    tips = conn.execute(
        """
        SELECT t.id, t.match_id, t.home_goals_tip, t.away_goals_tip,
               t.points_awarded, t.submitted_at
        FROM   tips t
        WHERE  t.user_id = ?
        ORDER BY t.match_id ASC
        """,
        (auth["user_id"],),
    ).fetchall()
    return [dict(t) for t in tips]


# ── GET /api/tips/match/:matchId ──────────────────────────────────────────────
@router.get("/match/{match_id}")
def tips_for_match(match_id: int, auth: dict = Depends(require_auth)):
    conn = get_db()
    match = conn.execute(
        "SELECT kickoff_utc FROM matches WHERE id = ?", (match_id,)
    ).fetchone()
    if not match:
        raise HTTPException(404, "Match not found")

    is_admin = auth["role"] == "admin"
    kickoff_passed = _kickoff_dt(match["kickoff_utc"]) <= _now()
    if not is_admin and not kickoff_passed:
        raise HTTPException(403, "Tips are hidden until kickoff")

    tips = conn.execute(
        """
        SELECT t.id, t.home_goals_tip, t.away_goals_tip, t.points_awarded,
               u.id AS user_id, u.username, u.avatar_url
        FROM   tips t
        JOIN   users u ON u.id = t.user_id
        WHERE  t.match_id = ?
        ORDER BY t.points_awarded DESC NULLS LAST, u.username ASC
        """,
        (match_id,),
    ).fetchall()
    return [dict(t) for t in tips]


# ── POST /api/tips ────────────────────────────────────────────────────────────
@router.post("/", status_code=201)
def submit_tip(body: TipBody, auth: dict = Depends(require_auth)):
    if body.homeGoalsTip < 0 or body.awayGoalsTip < 0:
        raise HTTPException(400, "Goals must be non-negative integers")

    conn = get_db()
    match = conn.execute(
        "SELECT kickoff_utc, status FROM matches WHERE id = ?", (body.matchId,)
    ).fetchone()
    if not match:
        raise HTTPException(404, "Match not found")
    if _kickoff_dt(match["kickoff_utc"]) <= _now():
        raise HTTPException(409, "Tipping deadline has passed")

    try:
        cur = conn.execute(
            "INSERT INTO tips (user_id, match_id, home_goals_tip, away_goals_tip) VALUES (?, ?, ?, ?)",
            (auth["user_id"], body.matchId, body.homeGoalsTip, body.awayGoalsTip),
        )
        conn.commit()
        return {"id": cur.lastrowid, "matchId": body.matchId,
                "homeGoalsTip": body.homeGoalsTip, "awayGoalsTip": body.awayGoalsTip}
    except Exception as exc:
        if "UNIQUE" in str(exc):
            raise HTTPException(409, "You have already tipped this match. Use PUT to update.")
        raise


# ── PUT /api/tips/:id ─────────────────────────────────────────────────────────
@router.put("/{tip_id}")
def update_tip(tip_id: int, body: UpdateTipBody, auth: dict = Depends(require_auth)):
    if body.homeGoalsTip < 0 or body.awayGoalsTip < 0:
        raise HTTPException(400, "Goals must be non-negative integers")

    conn = get_db()
    tip = conn.execute(
        """
        SELECT t.id, m.kickoff_utc
        FROM   tips t
        JOIN   matches m ON m.id = t.match_id
        WHERE  t.id = ? AND t.user_id = ?
        """,
        (tip_id, auth["user_id"]),
    ).fetchone()

    if not tip:
        raise HTTPException(404, "Tip not found")
    if _kickoff_dt(tip["kickoff_utc"]) <= _now():
        raise HTTPException(409, "Tipping deadline has passed")

    conn.execute(
        "UPDATE tips SET home_goals_tip = ?, away_goals_tip = ?, submitted_at = datetime('now') WHERE id = ?",
        (body.homeGoalsTip, body.awayGoalsTip, tip["id"]),
    )
    conn.commit()
    return {"id": tip["id"], "homeGoalsTip": body.homeGoalsTip, "awayGoalsTip": body.awayGoalsTip}
