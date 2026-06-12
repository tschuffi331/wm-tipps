-- Correct all 72 group-stage matches: teams, kickoff times, and venues.
-- Source: Wikipedia / official FIFA 2026 World Cup schedule (as of June 2026).
-- The original seed was created before the official draw/schedule was confirmed.

-- ── GROUP A: Mexico · South Korea · South Africa · Czechia ───────────────────
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Mexico'),
  away_team_id = (SELECT id FROM teams WHERE name = 'South Africa'),
  kickoff_utc  = '2026-06-11T19:00:00Z',
  venue        = 'Estadio Azteca, Mexico City'
WHERE match_number = 1;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'South Korea'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Czechia'),
  kickoff_utc  = '2026-06-12T02:00:00Z',
  venue        = 'Estadio Akron, Guadalajara'
WHERE match_number = 2;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Czechia'),
  away_team_id = (SELECT id FROM teams WHERE name = 'South Africa'),
  kickoff_utc  = '2026-06-18T16:00:00Z',
  venue        = 'Mercedes-Benz Stadium, Atlanta'
WHERE match_number = 3;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Mexico'),
  away_team_id = (SELECT id FROM teams WHERE name = 'South Korea'),
  kickoff_utc  = '2026-06-19T01:00:00Z',
  venue        = 'Estadio Akron, Guadalajara'
WHERE match_number = 4;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Czechia'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Mexico'),
  kickoff_utc  = '2026-06-25T01:00:00Z',
  venue        = 'Estadio Azteca, Mexico City'
WHERE match_number = 5;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'South Africa'),
  away_team_id = (SELECT id FROM teams WHERE name = 'South Korea'),
  kickoff_utc  = '2026-06-25T01:00:00Z',
  venue        = 'Estadio BBVA, Monterrey'
WHERE match_number = 6;

-- ── GROUP B: Canada · Switzerland · Qatar · Bosnia and Herzegovina ────────────
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Canada'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Bosnia and Herzegovina'),
  kickoff_utc  = '2026-06-12T19:00:00Z',
  venue        = 'BMO Field, Toronto'
WHERE match_number = 7;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Qatar'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Switzerland'),
  kickoff_utc  = '2026-06-13T19:00:00Z',
  venue        = 'Levi''s Stadium, San Francisco'
WHERE match_number = 8;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Switzerland'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Bosnia and Herzegovina'),
  kickoff_utc  = '2026-06-18T19:00:00Z',
  venue        = 'SoFi Stadium, Los Angeles'
WHERE match_number = 9;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Canada'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Qatar'),
  kickoff_utc  = '2026-06-18T22:00:00Z',
  venue        = 'BC Place, Vancouver'
WHERE match_number = 10;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Switzerland'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Canada'),
  kickoff_utc  = '2026-06-24T19:00:00Z',
  venue        = 'BC Place, Vancouver'
WHERE match_number = 11;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Bosnia and Herzegovina'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Qatar'),
  kickoff_utc  = '2026-06-24T19:00:00Z',
  venue        = 'Lumen Field, Seattle'
WHERE match_number = 12;

-- ── GROUP C: Brazil · Morocco · Scotland · Haiti ─────────────────────────────
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Haiti'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Scotland'),
  kickoff_utc  = '2026-06-13T01:00:00Z',
  venue        = 'Gillette Stadium, Boston'
WHERE match_number = 13;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Brazil'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Morocco'),
  kickoff_utc  = '2026-06-13T22:00:00Z',
  venue        = 'MetLife Stadium, New York/NJ'
WHERE match_number = 14;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Scotland'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Morocco'),
  kickoff_utc  = '2026-06-19T22:00:00Z',
  venue        = 'Gillette Stadium, Boston'
WHERE match_number = 15;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Brazil'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Haiti'),
  kickoff_utc  = '2026-06-20T00:30:00Z',
  venue        = 'Lincoln Financial Field, Philadelphia'
WHERE match_number = 16;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Scotland'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Brazil'),
  kickoff_utc  = '2026-06-24T22:00:00Z',
  venue        = 'Hard Rock Stadium, Miami'
WHERE match_number = 17;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Morocco'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Haiti'),
  kickoff_utc  = '2026-06-24T22:00:00Z',
  venue        = 'Mercedes-Benz Stadium, Atlanta'
WHERE match_number = 18;

-- ── GROUP D: USA · Australia · Paraguay · Turkey ─────────────────────────────
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'USA'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Paraguay'),
  kickoff_utc  = '2026-06-12T01:00:00Z',
  venue        = 'SoFi Stadium, Los Angeles'
WHERE match_number = 19;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Australia'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Turkey'),
  kickoff_utc  = '2026-06-13T04:00:00Z',
  venue        = 'BC Place, Vancouver'
WHERE match_number = 20;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'USA'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Australia'),
  kickoff_utc  = '2026-06-19T19:00:00Z',
  venue        = 'Lumen Field, Seattle'
WHERE match_number = 21;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Turkey'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Paraguay'),
  kickoff_utc  = '2026-06-20T03:00:00Z',
  venue        = 'Levi''s Stadium, San Francisco'
WHERE match_number = 22;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Turkey'),
  away_team_id = (SELECT id FROM teams WHERE name = 'USA'),
  kickoff_utc  = '2026-06-25T02:00:00Z',
  venue        = 'SoFi Stadium, Los Angeles'
WHERE match_number = 23;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Paraguay'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Australia'),
  kickoff_utc  = '2026-06-25T02:00:00Z',
  venue        = 'Levi''s Stadium, San Francisco'
WHERE match_number = 24;

-- ── GROUP E: Germany · Ecuador · Ivory Coast · Curaçao ───────────────────────
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Germany'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Curaçao'),
  kickoff_utc  = '2026-06-14T17:00:00Z',
  venue        = 'NRG Stadium, Houston'
WHERE match_number = 25;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Ivory Coast'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Ecuador'),
  kickoff_utc  = '2026-06-14T23:00:00Z',
  venue        = 'Lincoln Financial Field, Philadelphia'
WHERE match_number = 26;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Germany'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Ivory Coast'),
  kickoff_utc  = '2026-06-20T20:00:00Z',
  venue        = 'BMO Field, Toronto'
WHERE match_number = 27;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Ecuador'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Curaçao'),
  kickoff_utc  = '2026-06-21T00:00:00Z',
  venue        = 'Arrowhead Stadium, Kansas City'
WHERE match_number = 28;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Curaçao'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Ivory Coast'),
  kickoff_utc  = '2026-06-25T20:00:00Z',
  venue        = 'Lincoln Financial Field, Philadelphia'
WHERE match_number = 29;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Ecuador'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Germany'),
  kickoff_utc  = '2026-06-25T20:00:00Z',
  venue        = 'MetLife Stadium, New York/NJ'
WHERE match_number = 30;

-- ── GROUP F: Netherlands · Japan · Tunisia · Sweden ──────────────────────────
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Netherlands'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Japan'),
  kickoff_utc  = '2026-06-14T20:00:00Z',
  venue        = 'AT&T Stadium, Dallas'
WHERE match_number = 31;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Sweden'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Tunisia'),
  kickoff_utc  = '2026-06-15T02:00:00Z',
  venue        = 'Estadio BBVA, Monterrey'
WHERE match_number = 32;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Netherlands'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Sweden'),
  kickoff_utc  = '2026-06-20T17:00:00Z',
  venue        = 'NRG Stadium, Houston'
WHERE match_number = 33;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Tunisia'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Japan'),
  kickoff_utc  = '2026-06-21T04:00:00Z',
  venue        = 'Estadio BBVA, Monterrey'
WHERE match_number = 34;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Japan'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Sweden'),
  kickoff_utc  = '2026-06-25T23:00:00Z',
  venue        = 'AT&T Stadium, Dallas'
WHERE match_number = 35;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Tunisia'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Netherlands'),
  kickoff_utc  = '2026-06-25T23:00:00Z',
  venue        = 'Arrowhead Stadium, Kansas City'
WHERE match_number = 36;

-- ── GROUP G: Belgium · Iran · Egypt · New Zealand ────────────────────────────
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Belgium'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Egypt'),
  kickoff_utc  = '2026-06-15T19:00:00Z',
  venue        = 'Lumen Field, Seattle'
WHERE match_number = 37;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Iran'),
  away_team_id = (SELECT id FROM teams WHERE name = 'New Zealand'),
  kickoff_utc  = '2026-06-16T01:00:00Z',
  venue        = 'SoFi Stadium, Los Angeles'
WHERE match_number = 38;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Belgium'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Iran'),
  kickoff_utc  = '2026-06-21T19:00:00Z',
  venue        = 'SoFi Stadium, Los Angeles'
WHERE match_number = 39;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'New Zealand'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Egypt'),
  kickoff_utc  = '2026-06-22T01:00:00Z',
  venue        = 'BC Place, Vancouver'
WHERE match_number = 40;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Egypt'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Iran'),
  kickoff_utc  = '2026-06-27T03:00:00Z',
  venue        = 'Lumen Field, Seattle'
WHERE match_number = 41;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'New Zealand'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Belgium'),
  kickoff_utc  = '2026-06-27T03:00:00Z',
  venue        = 'BC Place, Vancouver'
WHERE match_number = 42;

-- ── GROUP H: Spain · Uruguay · Saudi Arabia · Cape Verde ─────────────────────
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Spain'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Cape Verde'),
  kickoff_utc  = '2026-06-15T16:00:00Z',
  venue        = 'Mercedes-Benz Stadium, Atlanta'
WHERE match_number = 43;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Saudi Arabia'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Uruguay'),
  kickoff_utc  = '2026-06-15T22:00:00Z',
  venue        = 'Hard Rock Stadium, Miami'
WHERE match_number = 44;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Spain'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Saudi Arabia'),
  kickoff_utc  = '2026-06-21T16:00:00Z',
  venue        = 'Mercedes-Benz Stadium, Atlanta'
WHERE match_number = 45;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Uruguay'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Cape Verde'),
  kickoff_utc  = '2026-06-21T22:00:00Z',
  venue        = 'Hard Rock Stadium, Miami'
WHERE match_number = 46;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Cape Verde'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Saudi Arabia'),
  kickoff_utc  = '2026-06-26T00:00:00Z',
  venue        = 'NRG Stadium, Houston'
WHERE match_number = 47;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Uruguay'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Spain'),
  kickoff_utc  = '2026-06-26T02:00:00Z',
  venue        = 'Estadio Akron, Guadalajara'
WHERE match_number = 48;

-- ── GROUP I: France · Senegal · Norway · Iraq ────────────────────────────────
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'France'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Senegal'),
  kickoff_utc  = '2026-06-16T19:00:00Z',
  venue        = 'MetLife Stadium, New York/NJ'
WHERE match_number = 49;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Iraq'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Norway'),
  kickoff_utc  = '2026-06-16T22:00:00Z',
  venue        = 'Gillette Stadium, Boston'
WHERE match_number = 50;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'France'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Iraq'),
  kickoff_utc  = '2026-06-22T21:00:00Z',
  venue        = 'Lincoln Financial Field, Philadelphia'
WHERE match_number = 51;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Norway'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Senegal'),
  kickoff_utc  = '2026-06-23T00:00:00Z',
  venue        = 'MetLife Stadium, New York/NJ'
WHERE match_number = 52;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Norway'),
  away_team_id = (SELECT id FROM teams WHERE name = 'France'),
  kickoff_utc  = '2026-06-26T19:00:00Z',
  venue        = 'Gillette Stadium, Boston'
WHERE match_number = 53;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Senegal'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Iraq'),
  kickoff_utc  = '2026-06-26T19:00:00Z',
  venue        = 'BMO Field, Toronto'
WHERE match_number = 54;

-- ── GROUP J: Argentina · Austria · Algeria · Jordan ──────────────────────────
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Argentina'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Algeria'),
  kickoff_utc  = '2026-06-16T01:00:00Z',
  venue        = 'Arrowhead Stadium, Kansas City'
WHERE match_number = 55;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Austria'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Jordan'),
  kickoff_utc  = '2026-06-16T04:00:00Z',
  venue        = 'Levi''s Stadium, San Francisco'
WHERE match_number = 56;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Argentina'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Austria'),
  kickoff_utc  = '2026-06-22T17:00:00Z',
  venue        = 'AT&T Stadium, Dallas'
WHERE match_number = 57;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Jordan'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Algeria'),
  kickoff_utc  = '2026-06-23T03:00:00Z',
  venue        = 'Levi''s Stadium, San Francisco'
WHERE match_number = 58;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Algeria'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Austria'),
  kickoff_utc  = '2026-06-28T02:00:00Z',
  venue        = 'Arrowhead Stadium, Kansas City'
WHERE match_number = 59;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Jordan'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Argentina'),
  kickoff_utc  = '2026-06-28T02:00:00Z',
  venue        = 'AT&T Stadium, Dallas'
WHERE match_number = 60;

-- ── GROUP K: Portugal · Colombia · Uzbekistan · DR Congo ─────────────────────
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Portugal'),
  away_team_id = (SELECT id FROM teams WHERE name = 'DR Congo'),
  kickoff_utc  = '2026-06-17T17:00:00Z',
  venue        = 'NRG Stadium, Houston'
WHERE match_number = 61;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Uzbekistan'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Colombia'),
  kickoff_utc  = '2026-06-18T02:00:00Z',
  venue        = 'Estadio Azteca, Mexico City'
WHERE match_number = 62;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Portugal'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Uzbekistan'),
  kickoff_utc  = '2026-06-23T17:00:00Z',
  venue        = 'NRG Stadium, Houston'
WHERE match_number = 63;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Colombia'),
  away_team_id = (SELECT id FROM teams WHERE name = 'DR Congo'),
  kickoff_utc  = '2026-06-24T02:00:00Z',
  venue        = 'Estadio Akron, Guadalajara'
WHERE match_number = 64;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Colombia'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Portugal'),
  kickoff_utc  = '2026-06-27T23:30:00Z',
  venue        = 'Hard Rock Stadium, Miami'
WHERE match_number = 65;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'DR Congo'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Uzbekistan'),
  kickoff_utc  = '2026-06-27T23:30:00Z',
  venue        = 'Mercedes-Benz Stadium, Atlanta'
WHERE match_number = 66;

-- ── GROUP L: England · Croatia · Panama · Ghana ──────────────────────────────
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'England'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Croatia'),
  kickoff_utc  = '2026-06-17T20:00:00Z',
  venue        = 'AT&T Stadium, Dallas'
WHERE match_number = 67;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Ghana'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Panama'),
  kickoff_utc  = '2026-06-17T23:00:00Z',
  venue        = 'BMO Field, Toronto'
WHERE match_number = 68;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'England'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Ghana'),
  kickoff_utc  = '2026-06-23T20:00:00Z',
  venue        = 'Gillette Stadium, Boston'
WHERE match_number = 69;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Panama'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Croatia'),
  kickoff_utc  = '2026-06-23T23:00:00Z',
  venue        = 'BMO Field, Toronto'
WHERE match_number = 70;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Panama'),
  away_team_id = (SELECT id FROM teams WHERE name = 'England'),
  kickoff_utc  = '2026-06-27T21:00:00Z',
  venue        = 'MetLife Stadium, New York/NJ'
WHERE match_number = 71;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Croatia'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Ghana'),
  kickoff_utc  = '2026-06-27T21:00:00Z',
  venue        = 'Lincoln Financial Field, Philadelphia'
WHERE match_number = 72;
