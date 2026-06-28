CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT OR IGNORE INTO settings (key, value) VALUES ('pw_min_length',      '6');
INSERT OR IGNORE INTO settings (key, value) VALUES ('pw_require_digit',   '0');
INSERT OR IGNORE INTO settings (key, value) VALUES ('pw_require_special', '0');
