"""Admin routes — equivalent of routes/admin.ts.

PUT /api/admin/matches/:id/result   — enter match result + recalculate tips
GET /api/admin/matches              — all matches for admin panel
GET /api/admin/settings             — password rules + wm_phase
PUT /api/admin/settings             — update settings
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from db.database import get_db
from middleware.auth import require_admin
from services.scoring_service import recalculate_match_tips
from utils.password_validator import get_password_rules

router = APIRouter()

WM_PHASES = ["Vorrunde", "Achtelfinale", "Viertelfinale", "Halbfinale", "Finale"]


def _get_wm_phase() -> str:
    row = get_db().execute("SELECT value FROM settings WHERE key = 'wm_phase'").fetchone()
    return row["value"] if row else "Vorrunde"


# ── PUT /api/admin/matches/:id/result ─────────────────────────────────────────
class ResultBody(BaseModel):
    homeGoals: int
    awayGoals: int


@router.put("/matches/{match_id}/result")
def set_result(match_id: int, body: ResultBody, auth: dict = Depends(require_admin)):
    if body.homeGoals < 0 or body.awayGoals < 0:
        raise HTTPException(400, "Goals must be non-negative integers")

    conn = get_db()
    match = conn.execute("SELECT id FROM matches WHERE id = ?", (match_id,)).fetchone()
    if not match:
        raise HTTPException(404, "Match not found")

    conn.execute(
        "UPDATE matches SET home_goals = ?, away_goals = ?, status = 'finished' WHERE id = ?",
        (body.homeGoals, body.awayGoals, match_id),
    )
    conn.commit()

    recalculate_match_tips(match_id)

    return {
        "message": "Result saved and points recalculated",
        "matchId": match_id,
        "homeGoals": body.homeGoals,
        "awayGoals": body.awayGoals,
    }


# ── GET /api/admin/matches ────────────────────────────────────────────────────
@router.get("/matches")
def admin_matches(auth: dict = Depends(require_admin)):
    rows = get_db().execute(
        """
        SELECT m.id, m.match_number, m.group_name, m.matchday, m.kickoff_utc, m.venue,
               m.home_goals, m.away_goals, m.status,
               m.home_placeholder, m.away_placeholder,
               m.home_team_id, m.away_team_id,
               ht.name AS home_team_name, ht.short_name AS home_short, ht.flag_emoji AS home_flag,
               at.name AS away_team_name, at.short_name AS away_short, at.flag_emoji AS away_flag
        FROM   matches m
        LEFT JOIN teams ht ON ht.id = m.home_team_id
        LEFT JOIN teams at ON at.id = m.away_team_id
        ORDER BY m.kickoff_utc ASC
        """
    ).fetchall()

    def _fmt(r) -> dict:
        home_team = (
            {"id": r["home_team_id"], "name": r["home_team_name"],
             "short_name": r["home_short"], "flag_emoji": r["home_flag"]}
            if r["home_team_id"] is not None
            else {"id": None, "name": r["home_placeholder"] or "TBD",
                  "short_name": "TBD", "flag_emoji": None}
        )
        away_team = (
            {"id": r["away_team_id"], "name": r["away_team_name"],
             "short_name": r["away_short"], "flag_emoji": r["away_flag"]}
            if r["away_team_id"] is not None
            else {"id": None, "name": r["away_placeholder"] or "TBD",
                  "short_name": "TBD", "flag_emoji": None}
        )
        return {
            "id": r["id"], "match_number": r["match_number"],
            "group_name": r["group_name"], "matchday": r["matchday"],
            "kickoff_utc": r["kickoff_utc"], "venue": r["venue"],
            "home_goals": r["home_goals"], "away_goals": r["away_goals"],
            "status": r["status"],
            "home_placeholder": r["home_placeholder"],
            "away_placeholder": r["away_placeholder"],
            "home_team": home_team, "away_team": away_team,
        }

    return [_fmt(r) for r in rows]


# ── GET /api/admin/settings ───────────────────────────────────────────────────
@router.get("/settings")
def get_settings(auth: dict = Depends(require_admin)):
    rules = get_password_rules()
    return {
        "minLength": rules.min_length,
        "requireDigit": rules.require_digit,
        "requireSpecial": rules.require_special,
        "wmPhase": _get_wm_phase(),
    }


# ── PUT /api/admin/settings ───────────────────────────────────────────────────
class SettingsBody(BaseModel):
    minLength: int | None = None
    requireDigit: bool | None = None
    requireSpecial: bool | None = None
    wmPhase: str | None = None


@router.put("/settings")
def update_settings(body: SettingsBody, auth: dict = Depends(require_admin)):
    conn = get_db()

    if body.minLength is not None:
        if not (1 <= body.minLength <= 64):
            raise HTTPException(400, "minLength must be an integer between 1 and 64")
        conn.execute(
            "UPDATE settings SET value = ? WHERE key = 'pw_min_length'",
            (str(body.minLength),),
        )
    if body.requireDigit is not None:
        conn.execute(
            "UPDATE settings SET value = ? WHERE key = 'pw_require_digit'",
            ("1" if body.requireDigit else "0",),
        )
    if body.requireSpecial is not None:
        conn.execute(
            "UPDATE settings SET value = ? WHERE key = 'pw_require_special'",
            ("1" if body.requireSpecial else "0",),
        )
    if body.wmPhase is not None:
        if body.wmPhase not in WM_PHASES:
            raise HTTPException(400, f"wmPhase must be one of: {', '.join(WM_PHASES)}")
        conn.execute(
            "UPDATE settings SET value = ? WHERE key = 'wm_phase'",
            (body.wmPhase,),
        )

    conn.commit()

    rules = get_password_rules()
    return {
        "minLength": rules.min_length,
        "requireDigit": rules.require_digit,
        "requireSpecial": rules.require_special,
        "wmPhase": _get_wm_phase(),
    }
