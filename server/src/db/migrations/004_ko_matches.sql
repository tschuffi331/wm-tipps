-- Add placeholder columns for KO-round matches (teams not yet determined)
ALTER TABLE matches ADD COLUMN home_placeholder TEXT;
ALTER TABLE matches ADD COLUMN away_placeholder TEXT;

-- ── Achtelfinale (match_number 73–80) ─────────────────────────────────────
INSERT OR IGNORE INTO matches
  (match_number, group_name, matchday, home_team_id, away_team_id,
   kickoff_utc, venue, home_placeholder, away_placeholder)
VALUES
  (73,'Achtelfinale',4,NULL,NULL,'2026-07-04T18:00:00Z','AT&T Stadium, Dallas',           '1. Gruppe A','2. Gruppe B'),
  (74,'Achtelfinale',4,NULL,NULL,'2026-07-04T22:00:00Z','MetLife Stadium, New York',       '1. Gruppe C','2. Gruppe D'),
  (75,'Achtelfinale',4,NULL,NULL,'2026-07-05T18:00:00Z','SoFi Stadium, Los Angeles',       '1. Gruppe E','2. Gruppe F'),
  (76,'Achtelfinale',4,NULL,NULL,'2026-07-05T22:00:00Z','Levi''s Stadium, San Francisco',  '1. Gruppe G','2. Gruppe H'),
  (77,'Achtelfinale',4,NULL,NULL,'2026-07-06T18:00:00Z','Hard Rock Stadium, Miami',        '1. Gruppe I','2. Gruppe J'),
  (78,'Achtelfinale',4,NULL,NULL,'2026-07-06T22:00:00Z','Arrowhead Stadium, Kansas City',  '1. Gruppe K','2. Gruppe L'),
  (79,'Achtelfinale',4,NULL,NULL,'2026-07-07T18:00:00Z','Rose Bowl, Los Angeles',           'Bester 3. (1)','Bester 3. (2)'),
  (80,'Achtelfinale',4,NULL,NULL,'2026-07-07T22:00:00Z','Estadio Azteca, Mexiko-Stadt',    'Bester 3. (3)','Bester 3. (4)');

-- ── Viertelfinale (match_number 81–84) ────────────────────────────────────
INSERT OR IGNORE INTO matches
  (match_number, group_name, matchday, home_team_id, away_team_id,
   kickoff_utc, venue, home_placeholder, away_placeholder)
VALUES
  (81,'Viertelfinale',5,NULL,NULL,'2026-07-10T22:00:00Z','MetLife Stadium, New York',    'Sieger Spiel 73','Sieger Spiel 74'),
  (82,'Viertelfinale',5,NULL,NULL,'2026-07-11T18:00:00Z','SoFi Stadium, Los Angeles',    'Sieger Spiel 75','Sieger Spiel 76'),
  (83,'Viertelfinale',5,NULL,NULL,'2026-07-11T22:00:00Z','AT&T Stadium, Dallas',         'Sieger Spiel 77','Sieger Spiel 78'),
  (84,'Viertelfinale',5,NULL,NULL,'2026-07-12T18:00:00Z','Estadio Azteca, Mexiko-Stadt', 'Sieger Spiel 79','Sieger Spiel 80');

-- ── Halbfinale (match_number 85–86) ──────────────────────────────────────
INSERT OR IGNORE INTO matches
  (match_number, group_name, matchday, home_team_id, away_team_id,
   kickoff_utc, venue, home_placeholder, away_placeholder)
VALUES
  (85,'Halbfinale',6,NULL,NULL,'2026-07-14T22:00:00Z','MetLife Stadium, New York', 'Sieger Spiel 81','Sieger Spiel 82'),
  (86,'Halbfinale',6,NULL,NULL,'2026-07-15T22:00:00Z','SoFi Stadium, Los Angeles', 'Sieger Spiel 83','Sieger Spiel 84');

-- ── Finale (87 = Spiel um Platz 3 · 88 = Finale) ─────────────────────────
INSERT OR IGNORE INTO matches
  (match_number, group_name, matchday, home_team_id, away_team_id,
   kickoff_utc, venue, home_placeholder, away_placeholder)
VALUES
  (87,'Finale',7,NULL,NULL,'2026-07-18T18:00:00Z','Hard Rock Stadium, Miami',  'Verlierer Spiel 85','Verlierer Spiel 86'),
  (88,'Finale',7,NULL,NULL,'2026-07-19T22:00:00Z','MetLife Stadium, New York', 'Sieger Spiel 85',  'Sieger Spiel 86');
