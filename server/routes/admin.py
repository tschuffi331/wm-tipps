"""Admin routes — equivalent of routes/admin.ts.

PUT /api/admin/matches/:id/result   — enter match result + recalculate tips
GET /api/admin/matches              — all matches for admin panel
GET /api/admin/fetch-results        — fetch live results from external source
GET /api/admin/settings             — password rules + wm_phase
PUT /api/admin/settings             — update settings
"""
import json
import urllib.request
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from db.database import get_db
from middleware.auth import require_admin
from services.scoring_service import recalculate_match_tips
from utils.password_validator import get_password_rules

router = APIRouter()

WM_PHASES = ["Vorrunde", "Sechzehntelfinale", "Achtelfinale", "Viertelfinale", "Halbfinale", "Finale"]

# Team name normalization: worldcup26.ir names → our DB names
_TEAM_NAME_MAP: dict[str, str] = {
    "Czech Republic": "Czechia",
    "United States": "USA",
    "Democratic Republic of the Congo": "DR Congo",
}


def _normalize_team(name: str) -> str:
    return _TEAM_NAME_MAP.get(name, name)


# ── GET /api/admin/users ──────────────────────────────────────────────────────
@router.get("/users")
def list_users(auth: dict = Depends(require_admin)):
    rows = get_db().execute(
        "SELECT id, username, role FROM users ORDER BY username COLLATE NOCASE"
    ).fetchall()
    return [{"id": r["id"], "username": r["username"], "is_admin": r["role"] == "admin"} for r in rows]


# ── PUT /api/admin/users/:username ────────────────────────────────────────────
class RenameBody(BaseModel):
    new_username: str


@router.put("/users/{username}")
def rename_user(username: str, body: RenameBody, auth: dict = Depends(require_admin)):
    new_name = body.new_username.strip()
    if not new_name:
        raise HTTPException(400, "new_username must not be empty")
    conn = get_db()
    row = conn.execute("SELECT id FROM users WHERE username = ? COLLATE NOCASE", (username,)).fetchone()
    if not row:
        raise HTTPException(404, f"User '{username}' not found")
    conflict = conn.execute(
        "SELECT id FROM users WHERE username = ? COLLATE NOCASE", (new_name,)
    ).fetchone()
    if conflict and conflict["id"] != row["id"]:
        raise HTTPException(409, f"Benutzername '{new_name}' ist bereits vergeben")
    conn.execute("UPDATE users SET username = ? WHERE id = ?", (new_name, row["id"]))
    conn.commit()
    return {"message": f"User '{username}' renamed to '{new_name}'"}

# Team name normalization: worldcup26.ir names → our DB names
_TEAM_NAME_MAP: dict[str, str] = {
    "Czech Republic": "Czechia",
    "United States": "USA",
    "Democratic Republic of the Congo": "DR Congo",
}


def _normalize_team(name: str) -> str:
    return _TEAM_NAME_MAP.get(name, name)


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


# ── GET /api/admin/fetch-results ─────────────────────────────────────────────
@router.get("/fetch-results")
def fetch_live_results(auth: dict = Depends(require_admin)):
    """Fetch finished match results from worldcup26.ir and compare with our DB."""
    try:
        req = urllib.request.Request(
            "https://worldcup26.ir/get/games",
            headers={"User-Agent": "wm-tipps-2026/1.0"},
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            payload = json.loads(resp.read())
            games: list[dict] = payload.get("games", payload) if isinstance(payload, dict) else payload
    except Exception as exc:
        raise HTTPException(502, f"Externe Datenquelle nicht erreichbar: {exc}")

    conn = get_db()
    rows = conn.execute(
        """
        SELECT m.id, m.match_number, m.home_goals, m.away_goals, m.status,
               ht.name AS home_name, at.name AS away_name
        FROM matches m
        LEFT JOIN teams ht ON ht.id = m.home_team_id
        LEFT JOIN teams at ON at.id = m.away_team_id
        WHERE m.home_team_id IS NOT NULL AND m.away_team_id IS NOT NULL
        """
    ).fetchall()

    match_lookup: dict[tuple[str, str], dict] = {
        (r["home_name"], r["away_name"]): dict(r) for r in rows
    }

    results = []
    for g in games:
        if g.get("finished") != "TRUE":
            continue
        home = _normalize_team(g.get("home_team_name_en", ""))
        away = _normalize_team(g.get("away_team_name_en", ""))
        try:
            home_goals = int(g["home_score"])
            away_goals = int(g["away_score"])
        except (ValueError, KeyError, TypeError):
            continue

        db_match = match_lookup.get((home, away))
        if db_match is None:
            continue

        already_saved = (
            db_match["status"] == "finished"
            and db_match["home_goals"] == home_goals
            and db_match["away_goals"] == away_goals
        )
        results.append({
            "match_id": db_match["id"],
            "match_number": db_match["match_number"],
            "home_team": home,
            "away_team": away,
            "home_goals": home_goals,
            "away_goals": away_goals,
            "already_saved": already_saved,
        })

    new_count = sum(1 for r in results if not r["already_saved"])
    return {"results": results, "total": len(results), "new_count": new_count}


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


# ── DELETE /api/admin/users/:username ────────────────────────────────────────
@router.delete("/users/{username}")
def delete_user(username: str, auth: dict = Depends(require_admin)):
    conn = get_db()
    row = conn.execute("SELECT id, role FROM users WHERE username = ? COLLATE NOCASE", (username,)).fetchone()
    if not row:
        raise HTTPException(404, f"User '{username}' not found")
    if row["role"] == "admin":
        raise HTTPException(403, "Admin-Benutzer können nicht gelöscht werden")
    uid = row["id"]
    conn.execute("DELETE FROM tips WHERE user_id = ?", (uid,))
    conn.execute("DELETE FROM users WHERE id = ?", (uid,))
    conn.commit()
    return {"message": f"User '{username}' and their tips deleted"}


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
