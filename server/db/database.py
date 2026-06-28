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


def _iter_statements(sql: str):
    """Yield individual SQL statements from a migration script.

    Splits on semicolons while skipping blank lines and -- comments.
    Handles the PRAGMA statements in our migrations correctly.
    """
    buf = ""
    for line in sql.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("--"):
            continue
        buf += " " + stripped
        if buf.rstrip().endswith(";"):
            stmt = buf.strip().rstrip(";").strip()
            if stmt:
                yield stmt
            buf = ""
    if buf.strip():
        yield buf.strip().rstrip(";").strip()


def run_migrations() -> None:
    """Run every *.sql file in src/db/migrations/ exactly once.

    Uses a schema_migrations tracking table so each file is applied only on
    its first deployment — restarts and redeployments skip already-applied
    files.  Individual statements that fail with "duplicate column" or
    "already exists" are silently skipped so that bootstrapping against a
    pre-existing database (e.g. one created by the TypeScript server) works.

    SQL migration files are kept in the original src/db/migrations/ directory
    (shared source of truth with the TypeScript server).  Once the TS source
    is removed they can be moved to db/migrations/ and this path updated.
    """
    # Create the tracking table if it doesn't exist yet.
    _conn.execute("""
        CREATE TABLE IF NOT EXISTS schema_migrations (
            filename   TEXT PRIMARY KEY,
            applied_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    """)
    _conn.commit()

    migration_dir = Path(__file__).parent / "migrations"
    for sql_file in sorted(migration_dir.glob("*.sql")):
        filename = sql_file.name

        # Skip files that were already applied on a previous startup.
        if _conn.execute(
            "SELECT 1 FROM schema_migrations WHERE filename = ?", (filename,)
        ).fetchone():
            print(f"  Skipped (already applied): {filename}")
            continue

        # Execute each statement individually so we can ignore "already exists"
        # errors without aborting the whole migration — needed when deploying
        # Python for the first time against a DB that the TypeScript server
        # already migrated.
        sql = sql_file.read_text(encoding="utf-8")
        for stmt in _iter_statements(sql):
            try:
                _conn.execute(stmt)
            except sqlite3.OperationalError as exc:
                msg = str(exc).lower()
                if any(kw in msg for kw in ("duplicate column", "already exists", "table already exists")):
                    continue  # idempotent — the change is already in place
                raise  # unexpected error → propagate
        _conn.commit()

        # Record that this migration has been applied.
        _conn.execute(
            "INSERT OR IGNORE INTO schema_migrations (filename) VALUES (?)",
            (filename,),
        )
        _conn.commit()
        print(f"  Applied: {filename}")

    print("Migrations complete.")
