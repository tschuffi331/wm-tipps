import { Router, Request, Response } from 'express';
import db from '../db/database';

const router = Router();

// Shorten a placeholder string for the mobile short_name slot
function shortPlaceholder(text: string | null): string {
  if (!text) return 'TBD';
  const g = text.match(/^(\d)\. Gruppe ([A-L])$/);      if (g) return `${g[1]}.${g[2]}`;   // "1. Gruppe A" → "1.A"
  const s = text.match(/Sieger Spiel (\d+)/);            if (s) return `S.${s[1]}`;          // "Sieger Spiel 73" → "S.73"
  const v = text.match(/Verlierer Spiel (\d+)/);         if (v) return `V.${v[1]}`;          // "Verlierer Spiel 85" → "V.85"
  const b = text.match(/Bester 3\. \((\d)\)/);           if (b) return `B3.${b[1]}`;         // "Bester 3. (1)" → "B3.1"
  return text.substring(0, 5);
}

// GET /api/matches  ?group=A  &matchday=1  &status=scheduled  &phase=Achtelfinale
router.get('/', (req: Request, res: Response) => {
  const { group, matchday, status, phase } = req.query;
  const GROUP_NAMES = ['A','B','C','D','E','F','G','H','I','J','K','L'];

  let sql = `
    SELECT m.id, m.match_number, m.group_name, m.matchday,
           m.kickoff_utc, m.venue, m.home_goals, m.away_goals, m.status,
           m.home_placeholder, m.away_placeholder,
           ht.id AS home_team_id, ht.name AS home_team_name,
           ht.short_name AS home_short, ht.flag_emoji AS home_flag,
           at.id AS away_team_id, at.name AS away_team_name,
           at.short_name AS away_short, at.flag_emoji AS away_flag
    FROM   matches m
    LEFT JOIN teams ht ON ht.id = m.home_team_id
    LEFT JOIN teams at ON at.id = m.away_team_id
    WHERE  1=1
  `;
  const params: (string | number)[] = [];

  if (phase) {
    const p = String(phase);
    if (p === 'Vorrunde') {
      sql += ` AND m.group_name IN (${GROUP_NAMES.map(() => '?').join(',')})`;
      params.push(...GROUP_NAMES);
    } else {
      sql += ' AND m.group_name = ?';
      params.push(p);
    }
  }

  if (group)    { sql += ' AND m.group_name = ?'; params.push(String(group).toUpperCase()); }
  if (matchday) { sql += ' AND m.matchday = ?';   params.push(Number(matchday)); }
  if (status)   { sql += ' AND m.status = ?';     params.push(String(status)); }

  sql += ' ORDER BY m.kickoff_utc ASC, m.match_number ASC';

  const rows = db.prepare(sql).all(...params) as MatchRow[];
  res.json(rows.map(formatMatch));
});

// GET /api/matches/:id
router.get('/:id', (req: Request, res: Response) => {
  const row = db.prepare(`
    SELECT m.id, m.match_number, m.group_name, m.matchday,
           m.kickoff_utc, m.venue, m.home_goals, m.away_goals, m.status,
           m.home_placeholder, m.away_placeholder,
           ht.id AS home_team_id, ht.name AS home_team_name,
           ht.short_name AS home_short, ht.flag_emoji AS home_flag,
           at.id AS away_team_id, at.name AS away_team_name,
           at.short_name AS away_short, at.flag_emoji AS away_flag
    FROM   matches m
    LEFT JOIN teams ht ON ht.id = m.home_team_id
    LEFT JOIN teams at ON at.id = m.away_team_id
    WHERE  m.id = ?
  `).get(req.params.id);

  if (!row) { res.status(404).json({ error: 'Match not found' }); return; }
  res.json(formatMatch(row as MatchRow));
});

interface MatchRow {
  id: number; match_number: number; group_name: string; matchday: number;
  kickoff_utc: string; venue: string | null;
  home_goals: number | null; away_goals: number | null; status: string;
  home_placeholder: string | null; away_placeholder: string | null;
  home_team_id: number | null; home_team_name: string | null; home_short: string | null; home_flag: string | null;
  away_team_id: number | null; away_team_name: string | null; away_short: string | null; away_flag: string | null;
}

export function formatMatch(m: MatchRow) {
  // For KO matches where teams are not yet determined, use placeholder text as the team name
  const homeTeam = m.home_team_id != null
    ? { id: m.home_team_id, name: m.home_team_name!, short_name: m.home_short!, flag_emoji: m.home_flag }
    : { id: null,           name: m.home_placeholder ?? 'TBD', short_name: shortPlaceholder(m.home_placeholder), flag_emoji: null };

  const awayTeam = m.away_team_id != null
    ? { id: m.away_team_id, name: m.away_team_name!, short_name: m.away_short!, flag_emoji: m.away_flag }
    : { id: null,           name: m.away_placeholder ?? 'TBD', short_name: shortPlaceholder(m.away_placeholder), flag_emoji: null };

  return {
    id:               m.id,
    match_number:     m.match_number,
    group_name:       m.group_name,
    matchday:         m.matchday,
    kickoff_utc:      m.kickoff_utc,
    venue:            m.venue,
    status:           m.status,
    home_goals:       m.home_goals,
    away_goals:       m.away_goals,
    home_placeholder: m.home_placeholder,
    away_placeholder: m.away_placeholder,
    home_team:        homeTeam,
    away_team:        awayTeam,
  };
}

export default router;
