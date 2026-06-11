"""
WM-Tipps 2026 — Python/FastAPI backend entry point.

Equivalent of server/src/server.ts + app.ts combined.
Run locally:  uvicorn main:app --reload --port 3001
"""
import os
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

from db.database import run_migrations
from db.seeds.teams import seed_teams
from db.seeds.matches import seed_matches
from routes import auth, matches, tips, leaderboard, admin, users, settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: run migrations + idempotent seeds. Shutdown: nothing needed."""
    run_migrations()
    seed_teams()
    seed_matches()
    yield


app = FastAPI(
    title="WM-Tipps 2026 API",
    version="1.0.0",
    lifespan=lifespan,
)

# Trust X-Forwarded-Proto from Railway's SSL terminator so any Starlette
# 307 redirects (e.g. trailing-slash normalisation) use https://, not http://.
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts="*")

# ── CORS ──────────────────────────────────────────────────────────────────────
# Set ALLOWED_ORIGINS in Railway as a comma-separated list, e.g.:
#   https://tschuffi331.github.io,http://localhost:5173
_allowed_origins = [
    o.strip()
    for o in os.getenv(
        "ALLOWED_ORIGINS",
        "https://tschuffi331.github.io,http://localhost:5173",
    ).split(",")
    if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static uploads ────────────────────────────────────────────────────────────
_uploads_dir = os.getenv("UPLOADS_DIR", "./uploads")
Path(_uploads_dir).mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=_uploads_dir), name="uploads")

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router,        prefix="/api/auth")
app.include_router(matches.router,     prefix="/api/matches")
app.include_router(tips.router,        prefix="/api/tips")
app.include_router(leaderboard.router, prefix="/api/leaderboard")
app.include_router(admin.router,       prefix="/api/admin")
app.include_router(users.router,       prefix="/api/users")
app.include_router(settings.router,    prefix="/api/settings")


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}
