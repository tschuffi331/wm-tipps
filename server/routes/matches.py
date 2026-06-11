"""Matches routes — equivalent of routes/matches.ts.

GET /api/matches           ?group=A &matchday=1 &status=scheduled &phase=Achtelfinale
GET /api/matches/:id
"""
import re
from fastapi import APIRouter, HTTPException, Query

from db.database import get_db

router = APIRouter()

_GROUP_STAGE = list("ABCDEFGHIJKL")


def _short_placeholder(text: str | None) -> str:
    """Generate a compact short_name from a KO placeholder string."""
    if not text:
        return "TBD"
    m = re.match(r"^(\d)\. Gruppe ([A-L])$", text)
    if m:
        return f"{m.group(1)}.{m.group(2)}"   # "1. Gruppe A" → "1.A"
    m = re.search(r"Sieger Spiel (\d+)", text)
    if m:
        return f"S.{m.group(1)}"              # "Sieger Spiel 73" → "S.73"
    m = re.search(r"Verlierer Spiel (\d+)", text)
    if m:
        return f"V.{m.group(1)}"              # "Verlierer Spiel 85" → "V.85"
    m = re.search(r"Bester 3\. \(([A-Z0-9/]+)\)", text)
    if m:
        return "B3."                           # "Bester 3. (A/B/C)" or "(1)" → "B3."
    return text[:5]


def _format_match(row) -> dict:
    """Convert a SQLite Row to a clean API dict."""
    home_team = (
        {
            "id": row["home_team_id"],
            "name": row["home_team_name"],
            "short_name": row["home_short"],
            "flag_emoji": row["home_flag"],
        }
        if row["home_team_id"] is not None
        else {
            "id": None,
            "name": row["home_placeholder"] or "TBD",
            "short_name": _short_placeholder(row["home_placeholder"]),
            "flag_emoji": None,
        }
    )
    away_team = (
        {
            "id": row["away_team_id"],
            "name": row["away_team_name"],
            "short_name": row["away_short"],
            "flag_emoji": row["away_flag"],
        }
        if row["away_team_id"] is not None
        else {
            "id": None,
            "name": row["away_placeholder"] or "TBD",
            "short_name": _short_placeholder(row["away_placeholder"]),
            "flag_emoji": None,
        }
    )
    return {
        "id": row["id"],
        "match_number": row["match_number"],
        "group_name": row["group_name"],
        "matchday": row["matchday"],
        "kickoff_utc": row["kickoff_utc"],
        "venue": row["venue"],
        "status": row["status"],
        "home_goals": row["home_goals"],
        "away_goals": row["away_goals"],
        "home_placeholder": row["home_placeholder"],
        "away_placeholder": row["away_placeholder"],
        "home_team": home_team,
        "away_team": away_team,
    }


_BASE_SQL = """
    SELECT m.id, m.match_number, m.group_name, m.matchday,
           m.kickoff_utc, m.venue, m.home_goals, m.away_goals, m.status,
           m.home_placeholder, m.away_placeholder,
           ht.id   AS home_team_id,   ht.name  AS home_team_name,
           ht.short_name AS home_short, ht.flag_emoji AS home_flag,
           at.id   AS away_team_id,   at.name  AS away_team_name,
           at.short_name AS away_short, at.flag_emoji AS away_flag
    FROM   matches m
    LEFT JOIN teams ht ON ht.id = m.home_team_id
    LEFT JOIN teams at ON at.id = m.away_team_id
    WHERE  1=1
"""


# ── GET /api/matches ──────────────────────────────────────────────────────────
@router.get("/")
def list_matches(
    group: str | None = Query(default=None),
    matchday: int | None = Query(default=None),
    status: str | None = Query(default=None),
    phase: str | None = Query(default=None),
):
    sql = _BASE_SQL
    params: list = []

    if phase:
        if phase == "Vorrunde":
            placeholders = ",".join("?" * len(_GROUP_STAGE))
            sql += f" AND m.group_name IN ({placeholders})"
            params.extend(_GROUP_STAGE)
        else:
            sql += " AND m.group_name = ?"
            params.append(phase)

    if group:
        sql += " AND m.group_name = ?"
        params.append(group.upper())
    if matchday is not None:
        sql += " AND m.matchday = ?"
        params.append(matchday)
    if status:
        sql += " AND m.status = ?"
        params.append(status)

    sql += " ORDER BY m.kickoff_utc ASC, m.match_number ASC"

    rows = get_db().execute(sql, params).fetchall()
    return [_format_match(r) for r in rows]


# ── GET /api/matches/:id ──────────────────────────────────────────────────────
@router.get("/{match_id}")
def get_match(match_id: int):
    row = get_db().execute(
        _BASE_SQL + " AND m.id = ?", (match_id,)
    ).fetchone()
    if not row:
        raise HTTPException(404, "Match not found")
    return _format_match(row)
