"""
SQLite database module — single persistent connection, WAL mode.
Equivalent of server/src/db/database.ts (better-sqlite3 → stdlib sqlite3).
"""
import os
import sqlite3
from pathlib import Path

DB_PATH = os.getenv("DATABASE_PATH", "./data/wm2026.db")

# Ensure the parent directory exists
Path(DB_PATH).parent.mkdir(parents=True, exist_ok=True)

# Single module-level connection.
# check_same_thread=False is safe here because:
#   - WAL mode allows concurrent reads
#   - FastAPI synchronous routes run in a thread-pool, but SQLite's internal
#     locking handles write serialisation correctly at this scale.
_conn = sqlite3.connect(DB_PATH, check_same_thread=False)
_conn.row_factory = sqlite3.Row
_conn.execute("PRAGMA journal_mode = WAL")
_conn.execute("PRAGMA foreign_keys = ON")
_conn.commit()


def get_db() -> sqlite3.Connection:
    """Return the shared database connection."""
    return _conn


def run_migrations() -> None:
    """Execute every *.sql file in db/migrations/ in alphabetical order."""
    migration_dir = Path(__file__).parent / "migrations"
    for sql_file in sorted(migration_dir.glob("*.sql")):
        _conn.executescript(sql_file.read_text(encoding="utf-8"))
    _conn.commit()
    print("Migrations applied.")
