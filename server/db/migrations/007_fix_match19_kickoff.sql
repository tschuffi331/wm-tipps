-- Fix match 19 (USA vs Paraguay) kickoff time.
-- Was: 2026-06-12T01:00:00Z  (= June 11 at 6 PM PDT — one day too early)
-- Now: 2026-06-13T01:00:00Z  (= June 12 at 9 PM ET / 6 PM PDT — correct)
UPDATE matches SET kickoff_utc = '2026-06-13T01:00:00Z'
WHERE match_number = 19;
