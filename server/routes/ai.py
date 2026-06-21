"""AI tip route — GET /api/ai/tip/:match_id

Calls Claude to generate a score prediction for an unstarted match.
Requires authentication; ANTHROPIC_API_KEY must be set on the server.
"""
import json
import os
from fastapi import APIRouter, Depends, HTTPException
from anthropic import Anthropic

from db.database import get_db
from middleware.auth import require_auth

router = APIRouter()


@router.get("/tip/{match_id}")
def ai_tip(match_id: int, auth: dict = Depends(require_auth)):
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(503, "KI-Tipp nicht verfügbar (ANTHROPIC_API_KEY nicht gesetzt)")

    conn = get_db()
    row = conn.execute(
        """
        SELECT m.group_name, m.matchday, m.venue, m.status,
               ht.name AS home_name, ht.flag_emoji AS home_flag, ht.confederation AS home_conf,
               at.name AS away_name, at.flag_emoji AS away_flag, at.confederation AS away_conf
        FROM matches m
        LEFT JOIN teams ht ON ht.id = m.home_team_id
        LEFT JOIN teams at ON at.id = m.away_team_id
        WHERE m.id = ?
        """,
        (match_id,),
    ).fetchone()

    if not row:
        raise HTTPException(404, "Spiel nicht gefunden")
    if row["status"] == "finished":
        raise HTTPException(400, "Spiel bereits beendet")

    group_info = (
        f"Gruppe {row['group_name']}, Spieltag {row['matchday']}"
        if len(row["group_name"]) == 1
        else row["group_name"]
    )

    prompt = (
        "Du bist ein Fußball-Experte und analysierst ein Spiel der FIFA Weltmeisterschaft 2026.\n\n"
        f"Spiel: {row['home_flag']} {row['home_name']} ({row['home_conf']}) "
        f"vs {row['away_flag']} {row['away_name']} ({row['away_conf']})\n"
        f"Phase: {group_info}\n"
        f"Spielort: {row['venue'] or 'unbekannt'}\n\n"
        "Gib einen konkreten Tipp für das Endergebnis der regulären Spielzeit ab.\n"
        "Antworte NUR mit einem gültigen JSON-Objekt, kein weiterer Text:\n"
        '{"home": <Tore Heimteam als Zahl>, "away": <Tore Auswärtsteam als Zahl>, '
        '"reasoning": "<Kurze Begründung auf Deutsch, max. 2 Sätze>"}'
    )

    try:
        client = Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-opus-4-8",
            max_tokens=300,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = message.content[0].text.strip()
        # Strip markdown code fences if present
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        result = json.loads(raw)
        home = int(result["home"])
        away = int(result["away"])
        reasoning = str(result.get("reasoning", ""))
    except (json.JSONDecodeError, KeyError, ValueError) as exc:
        raise HTTPException(502, f"KI-Antwort konnte nicht verarbeitet werden: {exc}")
    except Exception as exc:
        raise HTTPException(502, f"KI-Tipp konnte nicht generiert werden: {exc}")

    return {"home_goals": home, "away_goals": away, "reasoning": reasoning}
