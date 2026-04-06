import db from '../database';
import { seedTeams } from './teams';

interface MatchSeed {
  match_number: number;
  group_name: string;
  matchday: number;
  home_team: string;
  away_team: string;
  kickoff_utc: string;
  venue: string;
}

// WM 2026 Group Stage — 72 matches
// Groups source: sky sport (December 2025 draw)
// Germany schedule confirmed: Jun 14 Houston, Jun 20 Toronto, Jun 25 East Rutherford
// All other kick-off times are indicative (official full schedule pending FIFA confirmation)
const matches: MatchSeed[] = [
  // ── GROUP A: Mexico · South Korea · South Africa · Czechia ───────────────
  { match_number:  1, group_name: 'A', matchday: 1, home_team: 'Mexico',       away_team: 'South Korea',          kickoff_utc: '2026-06-11T21:00:00Z', venue: 'Estadio Azteca, Mexico City' },
  { match_number:  2, group_name: 'A', matchday: 1, home_team: 'South Africa', away_team: 'Czechia',              kickoff_utc: '2026-06-12T01:00:00Z', venue: 'Estadio BBVA, Monterrey' },
  { match_number:  3, group_name: 'A', matchday: 2, home_team: 'South Korea',  away_team: 'South Africa',         kickoff_utc: '2026-06-16T22:00:00Z', venue: 'Estadio Azteca, Mexico City' },
  { match_number:  4, group_name: 'A', matchday: 2, home_team: 'Mexico',       away_team: 'Czechia',              kickoff_utc: '2026-06-17T01:00:00Z', venue: 'Estadio Akron, Guadalajara' },
  { match_number:  5, group_name: 'A', matchday: 3, home_team: 'Czechia',      away_team: 'South Korea',          kickoff_utc: '2026-06-22T01:00:00Z', venue: 'Estadio BBVA, Monterrey' },
  { match_number:  6, group_name: 'A', matchday: 3, home_team: 'South Africa', away_team: 'Mexico',               kickoff_utc: '2026-06-22T01:00:00Z', venue: 'Estadio Akron, Guadalajara' },

  // ── GROUP B: Canada · Switzerland · Qatar · Bosnia and Herzegovina ────────
  { match_number:  7, group_name: 'B', matchday: 1, home_team: 'Canada',       away_team: 'Switzerland',          kickoff_utc: '2026-06-12T18:00:00Z', venue: 'BMO Field, Toronto' },
  { match_number:  8, group_name: 'B', matchday: 1, home_team: 'Qatar',        away_team: 'Bosnia and Herzegovina', kickoff_utc: '2026-06-12T21:00:00Z', venue: 'SoFi Stadium, Los Angeles' },
  { match_number:  9, group_name: 'B', matchday: 2, home_team: 'Switzerland',  away_team: 'Qatar',                kickoff_utc: '2026-06-17T18:00:00Z', venue: 'BMO Field, Toronto' },
  { match_number: 10, group_name: 'B', matchday: 2, home_team: 'Canada',       away_team: 'Bosnia and Herzegovina', kickoff_utc: '2026-06-17T21:00:00Z', venue: 'BC Place, Vancouver' },
  { match_number: 11, group_name: 'B', matchday: 3, home_team: 'Bosnia and Herzegovina', away_team: 'Switzerland', kickoff_utc: '2026-06-22T21:00:00Z', venue: 'SoFi Stadium, Los Angeles' },
  { match_number: 12, group_name: 'B', matchday: 3, home_team: 'Qatar',        away_team: 'Canada',               kickoff_utc: '2026-06-22T21:00:00Z', venue: 'BC Place, Vancouver' },

  // ── GROUP C: Brazil · Morocco · Scotland · Haiti ─────────────────────────
  { match_number: 13, group_name: 'C', matchday: 1, home_team: 'Brazil',       away_team: 'Morocco',              kickoff_utc: '2026-06-13T00:00:00Z', venue: 'Hard Rock Stadium, Miami' },
  { match_number: 14, group_name: 'C', matchday: 1, home_team: 'Scotland',     away_team: 'Haiti',                kickoff_utc: '2026-06-13T18:00:00Z', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { match_number: 15, group_name: 'C', matchday: 2, home_team: 'Morocco',      away_team: 'Scotland',             kickoff_utc: '2026-06-18T00:00:00Z', venue: 'Hard Rock Stadium, Miami' },
  { match_number: 16, group_name: 'C', matchday: 2, home_team: 'Brazil',       away_team: 'Haiti',                kickoff_utc: '2026-06-18T21:00:00Z', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { match_number: 17, group_name: 'C', matchday: 3, home_team: 'Haiti',        away_team: 'Morocco',              kickoff_utc: '2026-06-23T01:00:00Z', venue: 'Hard Rock Stadium, Miami' },
  { match_number: 18, group_name: 'C', matchday: 3, home_team: 'Scotland',     away_team: 'Brazil',               kickoff_utc: '2026-06-23T01:00:00Z', venue: 'Mercedes-Benz Stadium, Atlanta' },

  // ── GROUP D: USA · Australia · Paraguay · Turkey ─────────────────────────
  { match_number: 19, group_name: 'D', matchday: 1, home_team: 'USA',          away_team: 'Australia',            kickoff_utc: '2026-06-13T21:00:00Z', venue: 'MetLife Stadium, New York/NJ' },
  { match_number: 20, group_name: 'D', matchday: 1, home_team: 'Paraguay',     away_team: 'Turkey',               kickoff_utc: '2026-06-14T01:00:00Z', venue: 'AT&T Stadium, Dallas' },
  { match_number: 21, group_name: 'D', matchday: 2, home_team: 'Australia',    away_team: 'Paraguay',             kickoff_utc: '2026-06-19T18:00:00Z', venue: 'MetLife Stadium, New York/NJ' },
  { match_number: 22, group_name: 'D', matchday: 2, home_team: 'USA',          away_team: 'Turkey',               kickoff_utc: '2026-06-19T21:00:00Z', venue: 'Arrowhead Stadium, Kansas City' },
  { match_number: 23, group_name: 'D', matchday: 3, home_team: 'Turkey',       away_team: 'Australia',            kickoff_utc: '2026-06-24T01:00:00Z', venue: 'AT&T Stadium, Dallas' },
  { match_number: 24, group_name: 'D', matchday: 3, home_team: 'Paraguay',     away_team: 'USA',                  kickoff_utc: '2026-06-24T01:00:00Z', venue: 'Arrowhead Stadium, Kansas City' },

  // ── GROUP E: Germany · Ecuador · Ivory Coast · Curaçao ───────────────────
  // Confirmed schedule from Sky Sport article
  { match_number: 25, group_name: 'E', matchday: 1, home_team: 'Germany',      away_team: 'Curaçao',              kickoff_utc: '2026-06-14T23:00:00Z', venue: 'NRG Stadium, Houston' },
  { match_number: 26, group_name: 'E', matchday: 1, home_team: 'Ecuador',      away_team: 'Ivory Coast',          kickoff_utc: '2026-06-15T01:00:00Z', venue: 'Lincoln Financial Field, Philadelphia' },
  { match_number: 27, group_name: 'E', matchday: 2, home_team: 'Germany',      away_team: 'Ivory Coast',          kickoff_utc: '2026-06-21T00:00:00Z', venue: 'BMO Field, Toronto' },
  { match_number: 28, group_name: 'E', matchday: 2, home_team: 'Curaçao',      away_team: 'Ecuador',              kickoff_utc: '2026-06-21T18:00:00Z', venue: 'Lincoln Financial Field, Philadelphia' },
  { match_number: 29, group_name: 'E', matchday: 3, home_team: 'Ecuador',      away_team: 'Germany',              kickoff_utc: '2026-06-26T00:00:00Z', venue: 'MetLife Stadium, New York/NJ' },
  { match_number: 30, group_name: 'E', matchday: 3, home_team: 'Ivory Coast',  away_team: 'Curaçao',              kickoff_utc: '2026-06-26T00:00:00Z', venue: 'NRG Stadium, Houston' },

  // ── GROUP F: Netherlands · Japan · Tunisia · Sweden ──────────────────────
  { match_number: 31, group_name: 'F', matchday: 1, home_team: 'Netherlands',  away_team: 'Japan',                kickoff_utc: '2026-06-14T18:00:00Z', venue: 'Levi\'s Stadium, San Francisco' },
  { match_number: 32, group_name: 'F', matchday: 1, home_team: 'Tunisia',      away_team: 'Sweden',               kickoff_utc: '2026-06-14T21:00:00Z', venue: 'Lumen Field, Seattle' },
  { match_number: 33, group_name: 'F', matchday: 2, home_team: 'Japan',        away_team: 'Tunisia',              kickoff_utc: '2026-06-19T22:00:00Z', venue: 'Levi\'s Stadium, San Francisco' },
  { match_number: 34, group_name: 'F', matchday: 2, home_team: 'Netherlands',  away_team: 'Sweden',               kickoff_utc: '2026-06-20T01:00:00Z', venue: 'BC Place, Vancouver' },
  { match_number: 35, group_name: 'F', matchday: 3, home_team: 'Sweden',       away_team: 'Japan',                kickoff_utc: '2026-06-25T01:00:00Z', venue: 'Lumen Field, Seattle' },
  { match_number: 36, group_name: 'F', matchday: 3, home_team: 'Tunisia',      away_team: 'Netherlands',          kickoff_utc: '2026-06-25T01:00:00Z', venue: 'BC Place, Vancouver' },

  // ── GROUP G: Belgium · Iran · Egypt · New Zealand ────────────────────────
  { match_number: 37, group_name: 'G', matchday: 1, home_team: 'Belgium',      away_team: 'Iran',                 kickoff_utc: '2026-06-15T18:00:00Z', venue: 'Gillette Stadium, Boston' },
  { match_number: 38, group_name: 'G', matchday: 1, home_team: 'Egypt',        away_team: 'New Zealand',          kickoff_utc: '2026-06-15T21:00:00Z', venue: 'NRG Stadium, Houston' },
  { match_number: 39, group_name: 'G', matchday: 2, home_team: 'Iran',         away_team: 'Egypt',                kickoff_utc: '2026-06-20T18:00:00Z', venue: 'Gillette Stadium, Boston' },
  { match_number: 40, group_name: 'G', matchday: 2, home_team: 'Belgium',      away_team: 'New Zealand',          kickoff_utc: '2026-06-20T21:00:00Z', venue: 'AT&T Stadium, Dallas' },
  { match_number: 41, group_name: 'G', matchday: 3, home_team: 'New Zealand',  away_team: 'Iran',                 kickoff_utc: '2026-06-25T21:00:00Z', venue: 'Gillette Stadium, Boston' },
  { match_number: 42, group_name: 'G', matchday: 3, home_team: 'Egypt',        away_team: 'Belgium',              kickoff_utc: '2026-06-25T21:00:00Z', venue: 'AT&T Stadium, Dallas' },

  // ── GROUP H: Spain · Uruguay · Saudi Arabia · Cape Verde ─────────────────
  { match_number: 43, group_name: 'H', matchday: 1, home_team: 'Spain',        away_team: 'Uruguay',              kickoff_utc: '2026-06-15T22:00:00Z', venue: 'Hard Rock Stadium, Miami' },
  { match_number: 44, group_name: 'H', matchday: 1, home_team: 'Saudi Arabia', away_team: 'Cape Verde',           kickoff_utc: '2026-06-16T01:00:00Z', venue: 'Mercedes-Benz Stadium, Atlanta' },
  { match_number: 45, group_name: 'H', matchday: 2, home_team: 'Uruguay',      away_team: 'Saudi Arabia',         kickoff_utc: '2026-06-21T22:00:00Z', venue: 'Hard Rock Stadium, Miami' },
  { match_number: 46, group_name: 'H', matchday: 2, home_team: 'Spain',        away_team: 'Cape Verde',           kickoff_utc: '2026-06-22T01:00:00Z', venue: 'Lincoln Financial Field, Philadelphia' },
  { match_number: 47, group_name: 'H', matchday: 3, home_team: 'Cape Verde',   away_team: 'Uruguay',              kickoff_utc: '2026-06-27T01:00:00Z', venue: 'Hard Rock Stadium, Miami' },
  { match_number: 48, group_name: 'H', matchday: 3, home_team: 'Saudi Arabia', away_team: 'Spain',                kickoff_utc: '2026-06-27T01:00:00Z', venue: 'Mercedes-Benz Stadium, Atlanta' },

  // ── GROUP I: France · Senegal · Norway · Iraq ────────────────────────────
  { match_number: 49, group_name: 'I', matchday: 1, home_team: 'France',       away_team: 'Senegal',              kickoff_utc: '2026-06-16T18:00:00Z', venue: 'SoFi Stadium, Los Angeles' },
  { match_number: 50, group_name: 'I', matchday: 1, home_team: 'Norway',       away_team: 'Iraq',                 kickoff_utc: '2026-06-16T21:00:00Z', venue: 'Arrowhead Stadium, Kansas City' },
  { match_number: 51, group_name: 'I', matchday: 2, home_team: 'Senegal',      away_team: 'Norway',               kickoff_utc: '2026-06-22T18:00:00Z', venue: 'SoFi Stadium, Los Angeles' },
  { match_number: 52, group_name: 'I', matchday: 2, home_team: 'France',       away_team: 'Iraq',                 kickoff_utc: '2026-06-22T21:00:00Z', venue: 'Levi\'s Stadium, San Francisco' },
  { match_number: 53, group_name: 'I', matchday: 3, home_team: 'Iraq',         away_team: 'Senegal',              kickoff_utc: '2026-06-27T18:00:00Z', venue: 'Arrowhead Stadium, Kansas City' },
  { match_number: 54, group_name: 'I', matchday: 3, home_team: 'Norway',       away_team: 'France',               kickoff_utc: '2026-06-27T18:00:00Z', venue: 'Levi\'s Stadium, San Francisco' },

  // ── GROUP J: Argentina · Austria · Algeria · Jordan ──────────────────────
  { match_number: 55, group_name: 'J', matchday: 1, home_team: 'Argentina',    away_team: 'Austria',              kickoff_utc: '2026-06-16T22:00:00Z', venue: 'MetLife Stadium, New York/NJ' },
  { match_number: 56, group_name: 'J', matchday: 1, home_team: 'Algeria',      away_team: 'Jordan',               kickoff_utc: '2026-06-17T01:00:00Z', venue: 'Gillette Stadium, Boston' },
  { match_number: 57, group_name: 'J', matchday: 2, home_team: 'Austria',      away_team: 'Algeria',              kickoff_utc: '2026-06-22T22:00:00Z', venue: 'MetLife Stadium, New York/NJ' },
  { match_number: 58, group_name: 'J', matchday: 2, home_team: 'Argentina',    away_team: 'Jordan',               kickoff_utc: '2026-06-23T01:00:00Z', venue: 'Gillette Stadium, Boston' },
  { match_number: 59, group_name: 'J', matchday: 3, home_team: 'Jordan',       away_team: 'Austria',              kickoff_utc: '2026-06-28T01:00:00Z', venue: 'MetLife Stadium, New York/NJ' },
  { match_number: 60, group_name: 'J', matchday: 3, home_team: 'Algeria',      away_team: 'Argentina',            kickoff_utc: '2026-06-28T01:00:00Z', venue: 'Gillette Stadium, Boston' },

  // ── GROUP K: Portugal · Colombia · Uzbekistan · DR Congo ─────────────────
  { match_number: 61, group_name: 'K', matchday: 1, home_team: 'Portugal',     away_team: 'Colombia',             kickoff_utc: '2026-06-17T22:00:00Z', venue: 'Lumen Field, Seattle' },
  { match_number: 62, group_name: 'K', matchday: 1, home_team: 'Uzbekistan',   away_team: 'DR Congo',             kickoff_utc: '2026-06-18T01:00:00Z', venue: 'BC Place, Vancouver' },
  { match_number: 63, group_name: 'K', matchday: 2, home_team: 'Colombia',     away_team: 'Uzbekistan',           kickoff_utc: '2026-06-23T22:00:00Z', venue: 'Lumen Field, Seattle' },
  { match_number: 64, group_name: 'K', matchday: 2, home_team: 'Portugal',     away_team: 'DR Congo',             kickoff_utc: '2026-06-24T01:00:00Z', venue: 'BC Place, Vancouver' },
  { match_number: 65, group_name: 'K', matchday: 3, home_team: 'DR Congo',     away_team: 'Colombia',             kickoff_utc: '2026-06-29T01:00:00Z', venue: 'Lumen Field, Seattle' },
  { match_number: 66, group_name: 'K', matchday: 3, home_team: 'Uzbekistan',   away_team: 'Portugal',             kickoff_utc: '2026-06-29T01:00:00Z', venue: 'BC Place, Vancouver' },

  // ── GROUP L: England · Croatia · Panama · Ghana ──────────────────────────
  { match_number: 67, group_name: 'L', matchday: 1, home_team: 'England',      away_team: 'Croatia',              kickoff_utc: '2026-06-18T18:00:00Z', venue: 'Levi\'s Stadium, San Francisco' },
  { match_number: 68, group_name: 'L', matchday: 1, home_team: 'Panama',       away_team: 'Ghana',                kickoff_utc: '2026-06-18T21:00:00Z', venue: 'SoFi Stadium, Los Angeles' },
  { match_number: 69, group_name: 'L', matchday: 2, home_team: 'Croatia',      away_team: 'Panama',               kickoff_utc: '2026-06-24T18:00:00Z', venue: 'Levi\'s Stadium, San Francisco' },
  { match_number: 70, group_name: 'L', matchday: 2, home_team: 'England',      away_team: 'Ghana',                kickoff_utc: '2026-06-24T21:00:00Z', venue: 'SoFi Stadium, Los Angeles' },
  { match_number: 71, group_name: 'L', matchday: 3, home_team: 'Ghana',        away_team: 'Croatia',              kickoff_utc: '2026-06-29T21:00:00Z', venue: 'Levi\'s Stadium, San Francisco' },
  { match_number: 72, group_name: 'L', matchday: 3, home_team: 'Panama',       away_team: 'England',              kickoff_utc: '2026-06-29T21:00:00Z', venue: 'SoFi Stadium, Los Angeles' },
];

export function seedMatches(): void {
  const getTeamId = db.prepare('SELECT id FROM teams WHERE name = ?');

  const insert = db.prepare(`
    INSERT OR IGNORE INTO matches
      (match_number, group_name, matchday, home_team_id, away_team_id, kickoff_utc, venue)
    VALUES
      (@match_number, @group_name, @matchday, @home_team_id, @away_team_id, @kickoff_utc, @venue)
  `);

  const insertAll = db.transaction(() => {
    for (const m of matches) {
      const home = getTeamId.get(m.home_team) as { id: number } | undefined;
      const away = getTeamId.get(m.away_team) as { id: number } | undefined;

      if (!home) { console.warn(`Team not found: ${m.home_team}`); continue; }
      if (!away) { console.warn(`Team not found: ${m.away_team}`); continue; }

      insert.run({
        match_number: m.match_number,
        group_name:   m.group_name,
        matchday:     m.matchday,
        home_team_id: home.id,
        away_team_id: away.id,
        kickoff_utc:  m.kickoff_utc,
        venue:        m.venue,
      });
    }
  });

  insertAll();
  console.log(`Seeded ${matches.length} matches`);
}

if (require.main === module) {
  seedTeams();
  seedMatches();
}
