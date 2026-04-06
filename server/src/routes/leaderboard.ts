import { Router, Request, Response } from 'express';
import db from '../db/database';
import { getDiceBearUrl } from '../services/avatarService';

const router = Router();

// GET /api/leaderboard
router.get('/', (_req: Request, res: Response) => {
  const rows = db.prepare(`
    SELECT u.id, u.username, u.avatar_url,
           COALESCE(SUM(t.points_awarded), 0)                          AS total_points,
           COUNT(CASE WHEN t.points_awarded = 3 THEN 1 END)            AS exact_scores,
           COUNT(CASE WHEN t.points_awarded = 1 THEN 1 END)            AS correct_outcomes,
           COUNT(CASE WHEN t.points_awarded IS NOT NULL THEN 1 END)    AS tips_evaluated,
           COUNT(t.id)                                                  AS tips_total
    FROM   users u
    LEFT JOIN tips t ON t.user_id = u.id
    WHERE  u.role = 'user'
    GROUP  BY u.id
    ORDER  BY total_points DESC, exact_scores DESC, u.username ASC
  `).all() as Array<{
    id: number; username: string; avatar_url: string | null;
    total_points: number; exact_scores: number; correct_outcomes: number;
    tips_evaluated: number; tips_total: number;
  }>;

  const leaderboard = rows.map((u, index) => ({
    rank:             index + 1,
    id:               u.id,
    username:         u.username,
    avatar_url:       u.avatar_url ?? getDiceBearUrl(u.username),
    total_points:     u.total_points,
    exact_scores:     u.exact_scores,
    correct_outcomes: u.correct_outcomes,
    tips_evaluated:   u.tips_evaluated,
    tips_total:       u.tips_total,
  }));

  res.json(leaderboard);
});

export default router;
