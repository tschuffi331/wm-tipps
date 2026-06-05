"""Scoring logic — equivalent of scoringService.ts."""
from db.database import get_db


def calculate_points(
    home_tip: int, away_tip: int, home_result: int, away_result: int
) -> int:
    """Return 3 (exact), 1 (correct outcome), or 0 (wrong)."""
    if home_tip == home_result and away_tip == away_result:
        return 3
    tip_sign = (home_tip > away_tip) - (home_tip < away_tip)      # sign()
    res_sign = (home_result > away_result) - (home_result < away_result)
    return 1 if tip_sign == res_sign else 0


def recalculate_match_tips(match_id: int) -> None:
    """Recompute and persist points for every tip on *match_id*."""
    conn = get_db()
    match = conn.execute(
        "SELECT home_goals, away_goals FROM matches WHERE id = ?", (match_id,)
    ).fetchone()

    if not match or match["home_goals"] is None or match["away_goals"] is None:
        return

    tips = conn.execute(
        "SELECT id, home_goals_tip, away_goals_tip FROM tips WHERE match_id = ?",
        (match_id,),
    ).fetchall()

    for tip in tips:
        pts = calculate_points(
            tip["home_goals_tip"],
            tip["away_goals_tip"],
            match["home_goals"],
            match["away_goals"],
        )
        conn.execute("UPDATE tips SET points_awarded = ? WHERE id = ?", (pts, tip["id"]))

    conn.commit()
