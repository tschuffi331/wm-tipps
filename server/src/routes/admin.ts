import { Router, Response } from 'express';
import db from '../db/database';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { requireAdmin } from '../middleware/isAdmin';
import { recalculateMatchTips } from '../services/scoringService';
import { getPasswordRules } from '../utils/passwordValidator';

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
           m.home_team_id, m.away_team_id,
           ht.name AS home_team_name, ht.short_name AS home_short, ht.flag_emoji AS home_flag,
           at.name AS away_team_name, at.short_name AS away_short, at.flag_emoji AS away_flag
    FROM   matches m
    JOIN   teams ht ON ht.id = m.home_team_id
    JOIN   teams at ON at.id = m.away_team_id
    ORDER BY m.kickoff_utc ASC
  `).all() as Array<{
    id: number; match_number: number; group_name: string; matchday: number;
    kickoff_utc: string; venue: string; home_goals: number | null; away_goals: number | null;
    status: string; home_team_id: number; away_team_id: number;
    home_team_name: string; home_short: string; home_flag: string;
    away_team_name: string; away_short: string; away_flag: string;
  }>;

  const formatted = rows.map(r => ({
    id: r.id,
    match_number: r.match_number,
    group_name: r.group_name,
    matchday: r.matchday,
    kickoff_utc: r.kickoff_utc,
    venue: r.venue,
    home_goals: r.home_goals,
    away_goals: r.away_goals,
    status: r.status,
    home_team: { id: r.home_team_id, name: r.home_team_name, short_name: r.home_short, flag_emoji: r.home_flag },
    away_team: { id: r.away_team_id, name: r.away_team_name, short_name: r.away_short, flag_emoji: r.away_flag },
  }));

  res.json(formatted);
});

const WM_PHASES = ['Vorrunde', 'Achtelfinale', 'Viertelfinale', 'Halbfinale', 'Finale'] as const;
type WmPhase = typeof WM_PHASES[number];

function getWmPhase(): WmPhase {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'wm_phase'").get() as { value: string } | undefined;
  return (row?.value ?? 'Vorrunde') as WmPhase;
}

// GET /api/admin/settings
router.get('/settings', requireAuth, requireAdmin, (_req: AuthRequest, res: Response) => {
  res.json({ ...getPasswordRules(), wmPhase: getWmPhase() });
});

// PUT /api/admin/settings
router.put('/settings', requireAuth, requireAdmin, (req: AuthRequest, res: Response) => {
  const { minLength, requireDigit, requireSpecial, wmPhase } = req.body as {
    minLength?: number;
    requireDigit?: boolean;
    requireSpecial?: boolean;
    wmPhase?: string;
  };

  if (minLength !== undefined) {
    if (!Number.isInteger(minLength) || minLength < 1 || minLength > 64) {
      res.status(400).json({ error: 'minLength must be an integer between 1 and 64' });
      return;
    }
    db.prepare("UPDATE settings SET value = ? WHERE key = 'pw_min_length'").run(String(minLength));
  }
  if (requireDigit !== undefined) {
    db.prepare("UPDATE settings SET value = ? WHERE key = 'pw_require_digit'").run(requireDigit ? '1' : '0');
  }
  if (requireSpecial !== undefined) {
    db.prepare("UPDATE settings SET value = ? WHERE key = 'pw_require_special'").run(requireSpecial ? '1' : '0');
  }
  if (wmPhase !== undefined) {
    if (!(WM_PHASES as readonly string[]).includes(wmPhase)) {
      res.status(400).json({ error: `wmPhase must be one of: ${WM_PHASES.join(', ')}` });
      return;
    }
    db.prepare("UPDATE settings SET value = ? WHERE key = 'wm_phase'").run(wmPhase);
  }

  res.json({ ...getPasswordRules(), wmPhase: getWmPhase() });
});

export default router;
