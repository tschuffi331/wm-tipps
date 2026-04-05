import { Router, Response } from 'express';
import db from '../db/database';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { requireAdmin } from '../middleware/isAdmin';
import { recalculateMatchTips } from '../services/scoringService';

const router = Router();

// PUT /api/admin/matches/:id/result
router.put('/matches/:id/result', requireAuth, requireAdmin, (req: AuthRequest, res: Response) => {
  const { homeGoals, awayGoals } = req.body as { homeGoals?: number; awayGoals?: number };

  if (homeGoals == null || awayGoals == null) {
    res.status(400).json({ error: 'homeGoals and awayGoals are required' });
    return;
  }
  if (!Number.isInteger(homeGoals) || homeGoals < 0 ||
      !Number.isInteger(awayGoals) || awayGoals < 0) {
    res.status(400).json({ error: 'Goals must be non-negative integers' });
    return;
  }

  const matchId = Number(req.params.id);
  const match = db.prepare('SELECT id FROM matches WHERE id = ?').get(matchId);
  if (!match) { res.status(404).json({ error: 'Match not found' }); return; }

  db.prepare(
    "UPDATE matches SET home_goals = ?, away_goals = ?, status = 'finished' WHERE id = ?"
  ).run(homeGoals, awayGoals, matchId);

  recalculateMatchTips(matchId);

  res.json({ message: 'Result saved and points recalculated', matchId, homeGoals, awayGoals });
});

// GET /api/admin/matches  — all matches for admin panel
router.get('/matches', requireAuth, requireAdmin, (_req: AuthRequest, res: Response) => {
  const rows = db.prepare(`
    SELECT m.id, m.match_number, m.group_name, m.matchday, m.kickoff_utc, m.venue,
           m.home_goals, m.away_goals, m.status,
           ht.name AS home_team_name, ht.short_name AS home_short, ht.flag_emoji AS home_flag,
           at.name AS away_team_name, at.short_name AS away_short, at.flag_emoji AS away_flag
    FROM   matches m
    JOIN   teams ht ON ht.id = m.home_team_id
    JOIN   teams at ON at.id = m.away_team_id
    ORDER BY m.kickoff_utc ASC
  `).all();
  res.json(rows);
});

export default router;
