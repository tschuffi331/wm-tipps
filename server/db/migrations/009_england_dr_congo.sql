-- Fix match 80: set DR Congo as England's away opponent (Sechzehntelfinale).
-- Migration 008 left away_team_id = NULL for this match; this corrects it.
UPDATE matches SET
  away_team_id = (SELECT id FROM teams WHERE name = 'DR Congo')
WHERE match_number = 80;
