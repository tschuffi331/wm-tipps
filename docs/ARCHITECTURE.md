# WM Tipps 2026 — Architecture

**Status:** Production  
**Last updated:** Juni 2026

---

## Context & Goals

WM Tipps is a multi-user betting/prediction app for the 2026 FIFA World Cup (USA, Canada, Mexico). It targets a small group of friends (~10–30 users) who want to compete on predicting match results for the 72 group-stage games.

**Core requirements:**
- Multiple users register and submit predictions before each match starts
- An admin enters final scores; points are calculated automatically
- Public leaderboard ranked by points
- Zero operational cost where possible

---

## High-Level Design

```
┌─────────────────────────────────────────────┐
│  Browser (GitHub Pages)                     │
│  React 18 + Vite + TypeScript               │
│  Hash-based routing (/#/tips etc.)          │
│                                             │
│  AuthContext  →  localStorage JWT           │
│  React Query  →  60s poll (leaderboard)     │
│                                             │
│  worldcup26.ir  ←  fetchLiveResults()       │
│  (browser fetches directly — no CORS issue) │
└────────────────────┬────────────────────────┘
                     │ HTTPS / REST
                     │ Authorization: Bearer <JWT>
┌────────────────────▼────────────────────────┐
│  Railway Container                          │
│  Python 3.12 + FastAPI                      │
│                                             │
│  Middleware:  CORSMiddleware · JWT auth      │
│  Routes:      auth · matches · tips         │
│               leaderboard · admin · users   │
│  Services:    scoring_service               │
│               avatar_service (DiceBear)     │
│               password_validator            │
│                                             │
│  SQLite (WAL mode, foreign_keys ON)         │
│  data/wm2026.db                             │
└─────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Routing

The app uses **HashRouter** (`/#/route`) to be compatible with GitHub Pages, which cannot handle client-side routes on a static host without a custom 404 redirect. See [ADR-003](adr/003-hash-router.md).

```
/              → HomePage        (public)  group overview + countdown
/#/login       → LoginPage       (public)
/#/register    → RegisterPage    (public)  avatar upload + preview
/#/tips        → TipsPage        (auth)    72 match cards + tip input + other players' tips after kickoff
/#/groups      → GroupsPage      (auth)    group standings with qualification markers
/#/leaderboard → LeaderboardPage (public)
/#/profile     → ProfilePage     (auth)    avatar change + password change
/#/admin       → AdminPage       (admin)   match results + live fetch + user management + password rules
/#/rules       → RulesPage       (public)  scoring rules + prize info
```

Protected routes redirect to `/#/login` if no valid token is in `localStorage`.

### State Management

| Concern | Tool |
|---------|------|
| Server state (matches, tips, leaderboard) | TanStack Query v5 |
| Auth state (token + user object) | React Context + localStorage |
| Form state | Local component `useState` |
| Toast notifications | react-hot-toast |

The leaderboard query uses a 60-second `refetchInterval`. All other queries refetch on window focus.

### API Layer

`client/src/api/axiosInstance.ts` creates a shared Axios instance that:
- Sets `baseURL` from the `VITE_API_URL` env var (baked in at build time)
- Attaches `Authorization: Bearer <token>` from localStorage on every request
- Returns typed response data

Each resource has its own module (`auth.ts`, `matches.ts`, `tips.ts`, etc.) with typed functions.

### Authentication

JWT tokens are stored in **localStorage** (not `httpOnly` cookies) for simplicity on a cross-origin setup (GitHub Pages ↔ Railway). The token payload contains `userId` and `role`. See [ADR-001](adr/001-jwt-auth.md).

---

## Backend Architecture

### FastAPI App

```
main.py
├── CORSMiddleware     — dynamic allowlist from ALLOWED_ORIGINS
├── /uploads           — static file serving (profile pictures)
├── /api/auth          → routes/auth.py
├── /api/matches       → routes/matches.py
├── /api/tips          → routes/tips.py
├── /api/leaderboard   → routes/leaderboard.py
├── /api/admin         → routes/admin.py    (require_admin)
├── /api/users         → routes/users.py    (require_auth)
└── /api/health        — inline health check
```

FastAPI's dependency injection is used for auth: `Depends(require_auth)` / `Depends(require_admin)` on every protected route. Pydantic BaseModel handles request body validation.

### Database

**SQLite** via the standard `sqlite3` module with WAL mode and `PRAGMA foreign_keys = ON`. Runs in-process (no separate DB server). See [ADR-002](adr/002-hosting.md).

**Migration system:** On startup, `db/database.py` reads all `.sql` files from `db/migrations/` in alphabetical order and executes them. Migrations are idempotent (`CREATE TABLE IF NOT EXISTS`, `INSERT OR IGNORE`).

**Seeds:** Teams (48) and matches (72) are seeded via SQL `INSERT OR IGNORE` in the migration files, so they are safe to re-run on each deploy without duplicating data.

#### Schema

```
users
  id, username (unique NOCASE), password (bcrypt), role, avatar_url, created_at

teams
  id, name (unique), short_name, flag_emoji, confederation

matches
  id, match_number (unique), group_name, matchday
  home_team_id → teams.id, away_team_id → teams.id
  kickoff_utc, venue, home_goals, away_goals, status

tips
  id, user_id → users.id, match_id → matches.id
  home_goals_tip, away_goals_tip, points_awarded, submitted_at
  UNIQUE (user_id, match_id)

settings
  key (PK), value
  Rows: pw_min_length, pw_require_digit, pw_require_special
```

### Scoring Service

`services/scoring_service.py` implements two functions:

```python
def calculate_points(tip_home, tip_away, result_home, result_away) -> int:
    # 3 = exact score, 1 = correct outcome, 0 = wrong

def recalculate_match_tips(match_id: int) -> None:
    # Called by PUT /admin/matches/:id/result
    # Updates points_awarded for every tip on that match in a single transaction
```

### Avatar Service

`services/avatar_service.py` builds a DiceBear URL for the `initials` style, seeded deterministically by username:

```
https://api.dicebear.com/9.x/initials/svg?seed=<username>&backgroundColor=b6e3f4,c0aede
```

Uploaded avatars are processed by **Pillow** → resized to 128×128 JPEG → stored in `uploads/` with a UUID filename.

### Password Validation

`utils/password_validator.py` provides:
- `get_password_rules()` — reads `settings` table, returns a `PasswordRules` dataclass
- `validate_password(password, rules)` — returns an error string or `None`

Used by both `POST /auth/register` and `PUT /users/me/password` to enforce consistent rules.

### Middleware Stack

| Dependency | File | Purpose |
|-----------|------|---------|
| `require_auth` | `middleware/auth.py` | Verifies Bearer JWT, returns `{"user_id", "role"}` dict |
| `require_admin` | `middleware/auth.py` | Calls `require_auth`, then checks `role == "admin"`, raises 403 otherwise |
| `upload` | `middleware/upload.py` | UploadFile handler + Pillow resize pipeline |

---

## Data Flow Examples

### Submit a tip

```
Browser                  Express                    SQLite
  │                         │                          │
  │  POST /api/tips          │                          │
  │  {match_id, home, away}  │                          │
  │─────────────────────────►│                          │
  │                          │ requireAuth              │
  │                          │ verify JWT               │
  │                          │                          │
  │                          │ SELECT kickoff_utc       │
  │                          │──────────────────────────►│
  │                          │◄──────────────────────────│
  │                          │                          │
  │                          │ if now > kickoff → 403   │
  │                          │                          │
  │                          │ INSERT INTO tips         │
  │                          │──────────────────────────►│
  │                          │◄──────────────────────────│
  │◄─────────────────────────│                          │
  │  201 {tip}               │                          │
```

### Admin enters a match result

```
Admin Browser            Express                    SQLite
  │                         │                          │
  │  PUT /admin/matches/1/result                        │
  │  {home_goals:3, away_goals:1}                       │
  │─────────────────────────►│                          │
  │                          │ requireAuth + requireAdmin│
  │                          │                          │
  │                          │ UPDATE matches           │
  │                          │ SET home_goals=3,        │
  │                          │     away_goals=1,        │
  │                          │     status='finished'    │
  │                          │──────────────────────────►│
  │                          │                          │
  │                          │ SELECT * FROM tips       │
  │                          │ WHERE match_id=1         │
  │                          │──────────────────────────►│
  │                          │◄──────────────────────────│
  │                          │                          │
  │                          │ For each tip:            │
  │                          │   calculatePoints()      │
  │                          │   UPDATE tips SET        │
  │                          │   points_awarded=...     │
  │                          │──────────────────────────►│
  │◄─────────────────────────│                          │
  │  200 {match}             │                          │
```

---

## CI/CD Pipeline

```
git push main
     │
     ├── client/** changed?
     │   └── deploy-frontend.yml
     │       npm ci → tsc && vite build (VITE_API_URL secret)
     │       → peaceiris/actions-gh-pages → gh-pages branch
     │       → GitHub Pages serves dist/
     │
     └── server/** changed?
         └── deploy-backend.yml
             → railway up --detach --service wm-tipps
             → Railway builds Docker image (Python 3.12)
             → Container starts, runs migrations, seeds data
```

Both workflows also support **manual dispatch** via `workflow_dispatch`.

---

## Key Decisions

| Decision | ADR |
|----------|-----|
| JWT in localStorage (not httpOnly cookies) | [ADR-001](adr/001-jwt-auth.md) |
| GitHub Pages + Railway split hosting | [ADR-002](adr/002-hosting.md) |
| HashRouter instead of BrowserRouter | [ADR-003](adr/003-hash-router.md) |

---

## Known Limitations & Future Work

| Limitation | Impact | Mitigation |
|-----------|--------|-----------|
| SQLite on Railway ephemeral filesystem | DB wiped on redeploy | Attach Railway persistent volume at `/app/data` |
| No real-time updates | Leaderboard polls every 60s | Add WebSocket or SSE for live score updates |
| No password reset flow | Locked-out users need admin help | Add email-based reset (requires SMTP integration) |
| No rate limiting | Brute-force login possible | Add `slowapi` rate limiter on `/api/auth/*` |
| Live results from worldcup26.ir | External dependency; breaks if API changes | Monitor API shape; add fallback |
| No automated tests | Regressions caught manually | Add pytest (unit) + Playwright (e2e) |
