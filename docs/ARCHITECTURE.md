# WM Tipps 2026 — Architecture

**Status:** Production  
**Last updated:** April 2026

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
┌─────────────────────────────────────────┐
│  Browser (GitHub Pages)                 │
│  React 18 + Vite + TypeScript           │
│  Hash-based routing (/#/tips etc.)      │
│                                         │
│  AuthContext  →  localStorage JWT       │
│  React Query  →  60s poll (leaderboard) │
└────────────────────┬────────────────────┘
                     │ HTTPS / REST
                     │ Authorization: Bearer <JWT>
┌────────────────────▼────────────────────┐
│  Railway Container                      │
│  Node.js 20 + Express                   │
│                                         │
│  Middleware:  Helmet · CORS · JWT auth  │
│  Routes:      auth · matches · tips     │
│               leaderboard · admin       │
│               users                     │
│  Services:    scoringService            │
│               avatarService (DiceBear)  │
│               passwordValidator         │
│                                         │
│  better-sqlite3 (WAL mode)              │
│  data/wm2026.db                         │
└─────────────────────────────────────────┘
```

---

## Frontend Architecture

### Routing

The app uses **HashRouter** (`/#/route`) to be compatible with GitHub Pages, which cannot handle client-side routes on a static host without a custom 404 redirect. See [ADR-003](adr/003-hash-router.md).

```
/           → HomePage     (public)  group overview + countdown
/#/login    → LoginPage    (public)
/#/register → RegisterPage (public)  avatar upload + preview
/#/tips     → TipsPage     (auth)    72 match cards + tip input
/#/leaderboard → LeaderboardPage (public)
/#/profile  → ProfilePage  (auth)    avatar change + password change
/#/admin    → AdminPage    (admin)   match results + password rules
/#/regeln   → RulesPage    (public)  scoring rules + prize info
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

### Express App

```
app.ts
├── helmet()           — security headers (CSP, HSTS, etc.)
├── cors()             — dynamic allowlist from ALLOWED_ORIGINS
├── express.json()     — request body parsing
├── /uploads           — static file serving (profile pictures)
├── /api/auth          → routes/auth.ts
├── /api/matches       → routes/matches.ts
├── /api/tips          → routes/tips.ts
├── /api/leaderboard   → routes/leaderboard.ts
├── /api/admin         → routes/admin.ts    (requireAuth + requireAdmin)
├── /api/users         → routes/users.ts    (requireAuth)
├── /api/health        — inline health check
└── errorHandler()     — global error middleware
```

### Database

**SQLite** via `better-sqlite3` with WAL mode and foreign keys enabled. Runs in-process (no separate DB server). See [ADR-002](adr/002-hosting.md).

**Migration system:** On startup, `database.ts` reads all `.sql` files from `src/db/migrations/` in alphabetical order and executes them. Migrations are idempotent (`CREATE TABLE IF NOT EXISTS`, `INSERT OR IGNORE`).

**Seeds:** Teams (48) and matches (72) are seeded via TypeScript scripts using `INSERT OR IGNORE`, so they are safe to re-run on each deploy without duplicating data.

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

`scoringService.ts` implements two functions:

```typescript
calculatePoints(tip, result): 0 | 1 | 3
// 3 = exact score, 1 = correct outcome, 0 = wrong

recalculateMatchTips(matchId, homeGoals, awayGoals): void
// Called by PUT /admin/matches/:id/result
// Updates points_awarded for every tip on that match in a single transaction
```

### Avatar Service

`avatarService.ts` builds a DiceBear URL for the `initials` style, seeded deterministically by username:

```
https://api.dicebear.com/9.x/initials/svg?seed=<username>&backgroundColor=b6e3f4,c0aede
```

Uploaded avatars are processed by `sharp` → resized to 128×128 JPEG → stored in `uploads/` with a UUID filename.

### Password Validation

`passwordValidator.ts` provides:
- `getPasswordRules()` — reads `settings` table
- `validatePassword(password, rules)` — returns an error string or `null`

Used by both `POST /auth/register` and `PUT /users/me/password` to enforce consistent rules.

### Middleware Stack

| Middleware | File | Purpose |
|-----------|------|---------|
| `requireAuth` | `middleware/auth.ts` | Verifies Bearer JWT, attaches `userId` + `userRole` to request |
| `requireAdmin` | `middleware/isAdmin.ts` | Checks `userRole === 'admin'`, returns 403 otherwise |
| `upload` | `middleware/upload.ts` | multer + sharp pipeline for avatar uploads |
| `errorHandler` | `middleware/errorHandler.ts` | Catches unhandled errors, returns 500 JSON |

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
             npm ci → tsc (build to dist/)
             → railway up --detach --service wm-tipps
             → Railway pulls new image, restarts container
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
| No rate limiting | Brute-force login possible | Add express-rate-limit on `/api/auth/*` |
| KO round not yet seeded | KO point doubling has no data to apply to | Seed KO matches after group stage draw |
| No automated tests | Regressions caught manually | Add Vitest (unit) + Playwright (e2e) |
