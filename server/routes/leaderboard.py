"""Leaderboard route — equivalent of routes/leaderboard.ts.

GET /api/leaderboard
"""
from fastapi import APIRouter

from db.database import get_db
from services.avatar_service import get_dicebear_url

router = APIRouter()


@router.get("/")
def leaderboard():
    conn = get_db()
    rows = conn.execute(
        """
        SELECT u.id, u.username, u.avatar_url,
               COALESCE(SUM(t.points_awarded), 0)                       AS total_points,
               COUNT(CASE WHEN t.points_awarded = 3 THEN 1 END)         AS exact_scores,
               COUNT(CASE WHEN t.points_awarded = 1 THEN 1 END)         AS correct_outcomes,
               COUNT(CASE WHEN t.points_awarded IS NOT NULL THEN 1 END)  AS tips_evaluated,
               COUNT(t.id)                                               AS tips_total
        FROM   users u
        LEFT JOIN tips t ON t.user_id = u.id
        GROUP  BY u.id
        ORDER  BY total_points DESC, exact_scores DESC, u.username ASC
        """
    ).fetchall()

    return [
        {
            "rank": idx + 1,
            "id": row["id"],
            "username": row["username"],
            "avatar_url": row["avatar_url"] or get_dicebear_url(row["username"]),
            "total_points": row["total_points"],
            "exact_scores": row["exact_scores"],
            "correct_outcomes": row["correct_outcomes"],
            "tips_evaluated": row["tips_evaluated"],
            "tips_total": row["tips_total"],
        }
        for idx, row in enumerate(rows)
    ]
