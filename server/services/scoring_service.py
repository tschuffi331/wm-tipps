"""Scoring logic — equivalent of scoringService.ts."""
from db.database import get_db

_GROUP_STAGE = set("ABCDEFGHIJKL")


def calculate_points(
    home_tip: int, away_tip: int, home_result: int, away_result: int,
    is_ko: bool = False,
) -> int:
    """Return points for a tip. KO matches count double (exact=6, outcome=2)."""
    multiplier = 2 if is_ko else 1
    if home_tip == home_result and away_tip == away_result:
        return 3 * multiplier
    tip_sign = (home_tip > away_tip) - (home_tip < away_tip)
    res_sign = (home_result > away_result) - (home_result < away_result)
    return multiplier if tip_sign == res_sign else 0


def recalculate_match_tips(match_id: int) -> None:
    """Recompute and persist points for every tip on *match_id*."""
    conn = get_db()
    match = conn.execute(
        "SELECT home_goals, away_goals, group_name FROM matches WHERE id = ?", (match_id,)
    ).fetchone()

    if not match or match["home_goals"] is None or match["away_goals"] is None:
        return

    is_ko = match["group_name"] not in _GROUP_STAGE

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
            is_ko=is_ko,
        )
        conn.execute("UPDATE tips SET points_awarded = ? WHERE id = ?", (pts, tip["id"]))

    conn.commit()
