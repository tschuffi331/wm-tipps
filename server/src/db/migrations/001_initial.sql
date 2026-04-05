PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  username    TEXT    NOT NULL UNIQUE COLLATE NOCASE,
  password    TEXT    NOT NULL,
  role        TEXT    NOT NULL DEFAULT 'user',
  avatar_url  TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS teams (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL UNIQUE,
  short_name    TEXT    NOT NULL,
  flag_emoji    TEXT,
  confederation TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS matches (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  match_number INTEGER NOT NULL UNIQUE,
  group_name   TEXT    NOT NULL,
  matchday     INTEGER NOT NULL,
  home_team_id INTEGER REFERENCES teams(id),
  away_team_id INTEGER REFERENCES teams(id),
  kickoff_utc  TEXT    NOT NULL,
  venue        TEXT,
  home_goals   INTEGER,
  away_goals   INTEGER,
  status       TEXT    NOT NULL DEFAULT 'scheduled'
);

CREATE INDEX IF NOT EXISTS idx_matches_group    ON matches(group_name);
CREATE INDEX IF NOT EXISTS idx_matches_status   ON matches(status);

CREATE TABLE IF NOT EXISTS tips (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL REFERENCES users(id),
  match_id       INTEGER NOT NULL REFERENCES matches(id),
  home_goals_tip INTEGER NOT NULL,
  away_goals_tip INTEGER NOT NULL,
  points_awarded INTEGER,
  submitted_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, match_id)
);

CREATE INDEX IF NOT EXISTS idx_tips_user  ON tips(user_id);
CREATE INDEX IF NOT EXISTS idx_tips_match ON tips(match_id);
