import { Router, Request, Response } from 'express';
import db from '../db/database';

const router = Router();

// GET /api/matches  ?group=A  &matchday=1  &status=scheduled
router.get('/', (req: Request, res: Response) => {
  const { group, matchday, status } = req.query;

  let sql = `
    SELECT m.id, m.match_number, m.group_name, m.matchday,
           m.kickoff_utc, m.venue, m.home_goals, m.away_goals, m.status,
           ht.id AS home_team_id, ht.name AS home_team_name,
           ht.short_name AS home_short, ht.flag_emoji AS home_flag,
           at.id AS away_team_id, at.name AS away_team_name,
           at.short_name AS away_short, at.flag_emoji AS away_flag
    FROM   matches m
    JOIN   teams ht ON ht.id = m.home_team_id
    JOIN   teams at ON at.id = m.away_team_id
    WHERE  1=1
  `;
  const params: (string | number)[] = [];

  if (group)    { sql += ' AND m.group_name = ?'; params.push(String(group).toUpperCase()); }
  if (matchday) { sql += ' AND m.matchday = ?';   params.push(Number(matchday)); }
  if (status)   { sql += ' AND m.status = ?';     params.push(String(status)); }

  sql += ' ORDER BY m.kickoff_utc ASC, m.match_number ASC';

  const rows = db.prepare(sql).all(...params);
  res.json(rows.map(formatMatch));
});

// GET /api/matches/:id
router.get('/:id', (req: Request, res: Response) => {
  const row = db.prepare(`
    SELECT m.id, m.match_number, m.group_name, m.matchday,
           m.kickoff_utc, m.venue, m.home_goals, m.away_goals, m.status,
           ht.id AS home_team_id, ht.name AS home_team_name,
           ht.short_name AS home_short, ht.flag_emoji AS home_flag,
           at.id AS away_team_id, at.name AS away_team_name,
           at.short_name AS away_short, at.flag_emoji AS away_flag
    FROM   matches m
    JOIN   teams ht ON ht.id = m.home_team_id
    JOIN   teams at ON at.id = m.away_team_id
    WHERE  m.id = ?
  `).get(req.params.id);

  if (!row) { res.status(404).json({ error: 'Match not found' }); return; }
  res.json(formatMatch(row as MatchRow));
});

interface MatchRow {
  id: number; match_number: number; group_name: string; matchday: number;
  kickoff_utc: string; venue: string | null;
  home_goals: number | null; away_goals: number | null; status: string;
  home_team_id: number; home_team_name: string; home_short: string; home_flag: string | null;
  away_team_id: number; away_team_name: string; away_short: string; away_flag: string | null;
}

function formatMatch(m: MatchRow) {
  return {
    id:           m.id,
    match_number: m.match_number,
    group_name:   m.group_name,
    matchday:     m.matchday,
    kickoff_utc:  m.kickoff_utc,
    venue:        m.venue,
    status:       m.status,
    home_goals:   m.home_goals,
    away_goals:   m.away_goals,
    home_team: { id: m.home_team_id, name: m.home_team_name, short_name: m.home_short, flag_emoji: m.home_flag },
    away_team: { id: m.away_team_id, name: m.away_team_name, short_name: m.away_short, flag_emoji: m.away_flag },
  };
}

export default router;
