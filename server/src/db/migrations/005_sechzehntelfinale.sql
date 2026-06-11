-- Add Sechzehntelfinale (Round of 32) and renumber existing KO rounds.
--
-- Before: Achtelfinale(73-80) + Viertelfinale(81-84) + Halbfinale(85-86) + Finale(87-88)
-- After:  Sechzehntelfinale(73-88) + Achtelfinale(89-96) + Viertelfinale(97-100) + Halbfinale(101-102) + Finale(103-104)

-- ── Step 1: Shift existing KO matches 73–88 → 89–104 ─────────────────────
UPDATE matches SET match_number = match_number + 16 WHERE match_number BETWEEN 73 AND 88;

-- ── Step 2: Advance matchday by 1 for all shifted matches ─────────────────
UPDATE matches SET matchday = matchday + 1 WHERE match_number BETWEEN 89 AND 104;

-- ── Step 3: Achtelfinale (89–96) — update dates/venues/matchups ───────────
UPDATE matches SET
  kickoff_utc = CASE match_number
    WHEN 89 THEN '2026-07-04T21:00:00Z'
    WHEN 90 THEN '2026-07-04T17:00:00Z'
    WHEN 91 THEN '2026-07-05T20:00:00Z'
    WHEN 92 THEN '2026-07-06T02:00:00Z'
    WHEN 93 THEN '2026-07-06T19:00:00Z'
    WHEN 94 THEN '2026-07-06T22:00:00Z'
    WHEN 95 THEN '2026-07-07T16:00:00Z'
    WHEN 96 THEN '2026-07-07T20:00:00Z'
    ELSE kickoff_utc END,
  venue = CASE match_number
    WHEN 89 THEN 'Lincoln Financial Field, Philadelphia'
    WHEN 90 THEN 'NRG Stadium, Houston'
    WHEN 91 THEN 'MetLife Stadium, New York'
    WHEN 92 THEN 'Estadio Azteca, Mexico City'
    WHEN 93 THEN 'AT&T Stadium, Dallas'
    WHEN 94 THEN 'Lumen Field, Seattle'
    WHEN 95 THEN 'Mercedes-Benz Stadium, Atlanta'
    WHEN 96 THEN 'BC Place, Vancouver'
    ELSE venue END,
  home_placeholder = CASE match_number
    WHEN 89 THEN 'Sieger Spiel 74'
    WHEN 90 THEN 'Sieger Spiel 73'
    WHEN 91 THEN 'Sieger Spiel 76'
    WHEN 92 THEN 'Sieger Spiel 79'
    WHEN 93 THEN 'Sieger Spiel 83'
    WHEN 94 THEN 'Sieger Spiel 81'
    WHEN 95 THEN 'Sieger Spiel 86'
    WHEN 96 THEN 'Sieger Spiel 85'
    ELSE home_placeholder END,
  away_placeholder = CASE match_number
    WHEN 89 THEN 'Sieger Spiel 77'
    WHEN 90 THEN 'Sieger Spiel 75'
    WHEN 91 THEN 'Sieger Spiel 78'
    WHEN 92 THEN 'Sieger Spiel 80'
    WHEN 93 THEN 'Sieger Spiel 84'
    WHEN 94 THEN 'Sieger Spiel 82'
    WHEN 95 THEN 'Sieger Spiel 88'
    WHEN 96 THEN 'Sieger Spiel 87'
    ELSE away_placeholder END
WHERE match_number BETWEEN 89 AND 96;

-- ── Step 4: Viertelfinale (97–100) — update Achtelfinale references ────────
UPDATE matches SET
  home_placeholder = CASE match_number
    WHEN 97  THEN 'Sieger Spiel 89'
    WHEN 98  THEN 'Sieger Spiel 91'
    WHEN 99  THEN 'Sieger Spiel 93'
    WHEN 100 THEN 'Sieger Spiel 95'
    ELSE home_placeholder END,
  away_placeholder = CASE match_number
    WHEN 97  THEN 'Sieger Spiel 90'
    WHEN 98  THEN 'Sieger Spiel 92'
    WHEN 99  THEN 'Sieger Spiel 94'
    WHEN 100 THEN 'Sieger Spiel 96'
    ELSE away_placeholder END
WHERE match_number BETWEEN 97 AND 100;

-- ── Step 5: Halbfinale (101–102) — update Viertelfinale references ─────────
UPDATE matches SET
  home_placeholder = 'Sieger Spiel 97', away_placeholder = 'Sieger Spiel 98'
WHERE match_number = 101;

UPDATE matches SET
  home_placeholder = 'Sieger Spiel 99', away_placeholder = 'Sieger Spiel 100'
WHERE match_number = 102;

-- ── Step 6: Finale (103–104) — update Halbfinale references ───────────────
UPDATE matches SET
  home_placeholder = 'Verlierer Spiel 101', away_placeholder = 'Verlierer Spiel 102'
WHERE match_number = 103;

UPDATE matches SET
  home_placeholder = 'Sieger Spiel 101', away_placeholder = 'Sieger Spiel 102'
WHERE match_number = 104;

-- ── Step 7: Insert 16 Sechzehntelfinale matches ───────────────────────────
-- Source: FIFA 2026 official schedule (Wikipedia / fifa.com)
-- All times in UTC.
INSERT OR IGNORE INTO matches
  (match_number, group_name, matchday, home_team_id, away_team_id,
   kickoff_utc, venue, home_placeholder, away_placeholder)
VALUES
  (73,  'Sechzehntelfinale', 4, NULL, NULL, '2026-06-28T19:00:00Z', 'SoFi Stadium, Los Angeles',         '2. Gruppe A',            '2. Gruppe B'),
  (74,  'Sechzehntelfinale', 4, NULL, NULL, '2026-06-29T20:30:00Z', 'Gillette Stadium, Boston',          '1. Gruppe E',            'Bester 3. (A/B/C/D/F)'),
  (75,  'Sechzehntelfinale', 4, NULL, NULL, '2026-06-30T01:00:00Z', 'Estadio BBVA, Monterrey',           '1. Gruppe F',            '2. Gruppe C'),
  (76,  'Sechzehntelfinale', 4, NULL, NULL, '2026-06-29T16:00:00Z', 'NRG Stadium, Houston',              '1. Gruppe C',            '2. Gruppe F'),
  (77,  'Sechzehntelfinale', 4, NULL, NULL, '2026-06-30T21:00:00Z', 'MetLife Stadium, New York',         '1. Gruppe I',            'Bester 3. (C/D/F/G/H)'),
  (78,  'Sechzehntelfinale', 4, NULL, NULL, '2026-06-30T17:00:00Z', 'AT&T Stadium, Dallas',              '2. Gruppe E',            '2. Gruppe I'),
  (79,  'Sechzehntelfinale', 4, NULL, NULL, '2026-07-01T01:00:00Z', 'Estadio Azteca, Mexico City',       '1. Gruppe A',            'Bester 3. (C/E/F/H/I)'),
  (80,  'Sechzehntelfinale', 4, NULL, NULL, '2026-07-01T16:00:00Z', 'Mercedes-Benz Stadium, Atlanta',    '1. Gruppe L',            'Bester 3. (E/H/I/J/K)'),
  (81,  'Sechzehntelfinale', 4, NULL, NULL, '2026-07-02T00:00:00Z', 'Levi''s Stadium, San Francisco',    '1. Gruppe D',            'Bester 3. (B/E/F/I/J)'),
  (82,  'Sechzehntelfinale', 4, NULL, NULL, '2026-07-01T20:00:00Z', 'Lumen Field, Seattle',              '1. Gruppe G',            'Bester 3. (A/E/H/I/J)'),
  (83,  'Sechzehntelfinale', 4, NULL, NULL, '2026-07-02T23:00:00Z', 'BMO Field, Toronto',                '2. Gruppe K',            '2. Gruppe L'),
  (84,  'Sechzehntelfinale', 4, NULL, NULL, '2026-07-02T19:00:00Z', 'SoFi Stadium, Los Angeles',         '1. Gruppe H',            '2. Gruppe J'),
  (85,  'Sechzehntelfinale', 4, NULL, NULL, '2026-07-03T02:00:00Z', 'BC Place, Vancouver',               '1. Gruppe B',            'Bester 3. (E/F/G/I/J)'),
  (86,  'Sechzehntelfinale', 4, NULL, NULL, '2026-07-03T22:00:00Z', 'Hard Rock Stadium, Miami',          '1. Gruppe J',            '2. Gruppe H'),
  (87,  'Sechzehntelfinale', 4, NULL, NULL, '2026-07-04T01:30:00Z', 'Arrowhead Stadium, Kansas City',    '1. Gruppe K',            'Bester 3. (D/E/I/J/L)'),
  (88,  'Sechzehntelfinale', 4, NULL, NULL, '2026-07-03T18:00:00Z', 'AT&T Stadium, Dallas',              '2. Gruppe D',            '2. Gruppe G');
