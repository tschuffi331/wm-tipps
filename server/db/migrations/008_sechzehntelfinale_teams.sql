-- Sechzehntelfinale (match 73–88): set real teams from group-stage results.
-- Source: worldcup26.ir/get/games  (verified 2026-06-28)
-- Match 80 (England vs best 3rd E/H/I/J/K) — opponent TBD; home_team set only.

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'South Africa'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Canada')
WHERE match_number = 73;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Germany'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Paraguay')
WHERE match_number = 74;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Netherlands'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Morocco')
WHERE match_number = 75;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Brazil'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Japan')
WHERE match_number = 76;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'France'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Sweden')
WHERE match_number = 77;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Ivory Coast'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Norway')
WHERE match_number = 78;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Mexico'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Ecuador')
WHERE match_number = 79;

-- Match 80: England vs best 3rd (E/H/I/J/K) — opponent confirmed TBD
UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'England')
WHERE match_number = 80;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'USA'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Bosnia and Herzegovina')
WHERE match_number = 81;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Belgium'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Senegal')
WHERE match_number = 82;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Portugal'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Croatia')
WHERE match_number = 83;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Spain'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Austria')
WHERE match_number = 84;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Switzerland'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Algeria')
WHERE match_number = 85;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Argentina'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Cape Verde')
WHERE match_number = 86;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Colombia'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Ghana')
WHERE match_number = 87;

UPDATE matches SET
  home_team_id = (SELECT id FROM teams WHERE name = 'Australia'),
  away_team_id = (SELECT id FROM teams WHERE name = 'Egypt')
WHERE match_number = 88;
