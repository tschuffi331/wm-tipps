import { Router, Response } from 'express';
import db from '../db/database';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/tips  — all tips of the logged-in user
router.get('/', requireAuth, (req: AuthRequest, res: Response) => {
  const tips = db.prepare(`
    SELECT t.id, t.match_id, t.home_goals_tip, t.away_goals_tip,
           t.points_awarded, t.submitted_at
    FROM   tips t
    WHERE  t.user_id = ?
    ORDER BY t.match_id ASC
  `).all(req.userId);

  res.json(tips);
});

// POST /api/tips  — submit a tip
router.post('/', requireAuth, (req: AuthRequest, res: Response) => {
  const { matchId, homeGoalsTip, awayGoalsTip } = req.body as {
    matchId?: number; homeGoalsTip?: number; awayGoalsTip?: number;
  };

  if (matchId == null || homeGoalsTip == null || awayGoalsTip == null) {
    res.status(400).json({ error: 'matchId, homeGoalsTip and awayGoalsTip are required' });
    return;
  }
  if (!Number.isInteger(homeGoalsTip) || homeGoalsTip < 0 ||
      !Number.isInteger(awayGoalsTip) || awayGoalsTip < 0) {
    res.status(400).json({ error: 'Goals must be non-negative integers' });
    return;
  }

  const match = db.prepare('SELECT kickoff_utc, status FROM matches WHERE id = ?').get(matchId) as
    { kickoff_utc: string; status: string } | undefined;

  if (!match) { res.status(404).json({ error: 'Match not found' }); return; }
  if (new Date(match.kickoff_utc) <= new Date()) {
    res.status(409).json({ error: 'Tipping deadline has passed' });
    return;
  }

  try {
    const result = db.prepare(`
      INSERT INTO tips (user_id, match_id, home_goals_tip, away_goals_tip)
      VALUES (?, ?, ?, ?)
    `).run(req.userId, matchId, homeGoalsTip, awayGoalsTip);

    res.status(201).json({ id: result.lastInsertRowid, matchId, homeGoalsTip, awayGoalsTip });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('UNIQUE')) {
      res.status(409).json({ error: 'You have already tipped this match. Use PUT to update.' });
    } else {
      throw err;
    }
  }
});

// PUT /api/tips/:id  — update a tip
router.put('/:id', requireAuth, (req: AuthRequest, res: Response) => {
  const { homeGoalsTip, awayGoalsTip } = req.body as {
    homeGoalsTip?: number; awayGoalsTip?: number;
  };

  if (homeGoalsTip == null || awayGoalsTip == null) {
    res.status(400).json({ error: 'homeGoalsTip and awayGoalsTip are required' });
    return;
  }

  const tip = db.prepare(
    'SELECT t.id, m.kickoff_utc FROM tips t JOIN matches m ON m.id = t.match_id WHERE t.id = ? AND t.user_id = ?'
  ).get(req.params.id, req.userId) as { id: number; kickoff_utc: string } | undefined;

  if (!tip) { res.status(404).json({ error: 'Tip not found' }); return; }
  if (new Date(tip.kickoff_utc) <= new Date()) {
    res.status(409).json({ error: 'Tipping deadline has passed' });
    return;
  }

  db.prepare(
    'UPDATE tips SET home_goals_tip = ?, away_goals_tip = ?, submitted_at = datetime(\'now\') WHERE id = ?'
  ).run(homeGoalsTip, awayGoalsTip, tip.id);

  res.json({ id: tip.id, homeGoalsTip, awayGoalsTip });
});

// GET /api/tips/match/:matchId  — tips for a specific match (visible after kickoff or for admin)
router.get('/match/:matchId', requireAuth, (req: AuthRequest, res: Response) => {
  const match = db.prepare('SELECT kickoff_utc FROM matches WHERE id = ?').get(req.params.matchId) as
    { kickoff_utc: string } | undefined;

  if (!match) { res.status(404).json({ error: 'Match not found' }); return; }

  const isAdmin = req.userRole === 'admin';
  const kickoffPassed = new Date(match.kickoff_utc) <= new Date();

  if (!isAdmin && !kickoffPassed) {
    res.status(403).json({ error: 'Tips are hidden until kickoff' });
    return;
  }

  const tips = db.prepare(`
    SELECT t.id, t.home_goals_tip, t.away_goals_tip, t.points_awarded,
           u.id AS user_id, u.username, u.avatar_url
    FROM   tips t
    JOIN   users u ON u.id = t.user_id
    WHERE  t.match_id = ?
    ORDER BY t.points_awarded DESC NULLS LAST, u.username ASC
  `).all(req.params.matchId);

  res.json(tips);
});

export default router;
