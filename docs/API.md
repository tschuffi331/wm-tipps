# WM Tipps 2026 — API Reference

**Base URL (Production):** `https://wm-tipps-api.railway.app/api`  
**Base URL (Local):** `http://localhost:3001/api`

---

## Authentication

Most write endpoints and all personal-data endpoints require a JWT Bearer token.

```
Authorization: Bearer <token>
```

Tokens are obtained via `POST /auth/login` or `POST /auth/register`. They expire after `JWT_EXPIRES_IN` (default: 7 days).

Endpoints marked **🔒 JWT** require a valid token.  
Endpoints marked **🔒 Admin** additionally require the user to have `role = 'admin'`.

---

## Error Format

All errors return JSON:

```json
{
  "error": "Human-readable error message"
}
```

Common HTTP status codes:

| Code | Meaning |
|------|---------|
| 400 | Bad request / validation failed |
| 401 | Missing or invalid JWT |
| 403 | Authenticated but insufficient role |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate username) |
| 500 | Internal server error |

---

## Health

### `GET /health`

Returns API health status. Use for uptime monitoring.

**Response 200**
```json
{
  "status": "ok",
  "timestamp": "2026-06-11T21:00:00.000Z"
}
```

---

## Auth

### `POST /auth/register`

Register a new user. Optionally upload a profile picture.

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `username` | string | ✅ | 3–30 chars, unique (case-insensitive) |
| `password` | string | ✅ | Min length + rules as configured by admin |
| `avatar` | file | – | image/* — resized to 128×128 JPEG |

**Response 201**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "tschuffi331",
    "role": "user",
    "avatar_url": "/uploads/abc123.jpg"
  }
}
```

**Errors**
- `400` — Password does not meet rules / username too short or too long
- `409` — Username already taken

---

### `POST /auth/login`

Authenticate and receive a JWT token.

**Content-Type:** `application/json`

```json
{
  "username": "tschuffi331",
  "password": "geheim123"
}
```

**Response 200**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "tschuffi331",
    "role": "user",
    "avatar_url": null
  }
}
```

**Errors**
- `400` — Missing username or password
- `401` — Invalid credentials

---

### `GET /auth/me` 🔒 JWT

Returns the currently authenticated user's profile and total points earned.

**Response 200**
```json
{
  "id": 1,
  "username": "tschuffi331",
  "role": "user",
  "avatar_url": "/uploads/abc123.jpg",
  "total_points": 42,
  "created_at": "2026-06-01T10:00:00.000Z"
}
```

---

## Matches

### `GET /matches`

Returns all matches. Supports optional query filters.

**Query parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `group` | string | Filter by group name (e.g. `A`–`L`) |
| `matchday` | number | Filter by matchday (1, 2, or 3 for group stage) |
| `status` | string | `scheduled` or `finished` |

**Response 200**
```json
[
  {
    "id": 1,
    "match_number": 1,
    "group_name": "A",
    "matchday": 1,
    "kickoff_utc": "2026-06-11T21:00:00.000Z",
    "venue": "SoFi Stadium, Los Angeles",
    "home_goals": null,
    "away_goals": null,
    "status": "scheduled",
    "home_team": {
      "id": 1,
      "name": "Mexiko",
      "short_name": "MEX",
      "flag_emoji": "🇲🇽",
      "confederation": "CONCACAF"
    },
    "away_team": {
      "id": 2,
      "name": "Kanada",
      "short_name": "CAN",
      "flag_emoji": "🇨🇦",
      "confederation": "CONCACAF"
    }
  }
]
```

---

### `GET /matches/:id`

Returns a single match by ID.

**Response 200** — Same shape as a single item from `GET /matches`.

**Errors**
- `404` — Match not found

---

## Tips

### `GET /tips` 🔒 JWT

Returns all tips submitted by the currently authenticated user.

**Response 200**
```json
[
  {
    "id": 7,
    "match_id": 1,
    "home_goals_tip": 2,
    "away_goals_tip": 1,
    "points_awarded": 3,
    "submitted_at": "2026-06-11T18:30:00.000Z"
  }
]
```

`points_awarded` is `null` until an admin enters the match result.

---

### `POST /tips` 🔒 JWT

Submit a tip for a match. Only allowed before kickoff.

**Content-Type:** `application/json`

```json
{
  "match_id": 1,
  "home_goals_tip": 2,
  "away_goals_tip": 1
}
```

**Response 201**
```json
{
  "id": 7,
  "match_id": 1,
  "home_goals_tip": 2,
  "away_goals_tip": 1,
  "points_awarded": null,
  "submitted_at": "2026-06-11T18:30:00.000Z"
}
```

**Errors**
- `400` — Missing fields / goals must be integers ≥ 0
- `403` — Kickoff has already passed (deadline exceeded)
- `409` — Tip already exists for this match (use `PUT /tips/:id` to update)

---

### `PUT /tips/:id` 🔒 JWT

Update an existing tip. Only allowed before kickoff. The tip must belong to the authenticated user.

**Content-Type:** `application/json`

```json
{
  "home_goals_tip": 1,
  "away_goals_tip": 1
}
```

**Response 200**
```json
{
  "id": 7,
  "match_id": 1,
  "home_goals_tip": 1,
  "away_goals_tip": 1,
  "points_awarded": null,
  "submitted_at": "2026-06-11T18:30:00.000Z"
}
```

**Errors**
- `403` — Kickoff has passed / tip belongs to another user
- `404` — Tip not found

---

### `GET /tips/match/:matchId` 🔒 JWT

Returns all users' tips for a specific match. Admins can always access this; regular users can only access it after kickoff (to prevent peeking before the deadline).

**Response 200**
```json
[
  {
    "id": 7,
    "user_id": 1,
    "username": "tschuffi331",
    "home_goals_tip": 2,
    "away_goals_tip": 1,
    "points_awarded": 3
  }
]
```

---

## Leaderboard

### `GET /leaderboard`

Returns the ranked leaderboard. Public — no authentication required.

**Response 200**
```json
[
  {
    "rank": 1,
    "id": 1,
    "username": "tschuffi331",
    "avatar_url": null,
    "total_points": 42,
    "exact_scores": 8,
    "correct_outcomes": 10,
    "tips_evaluated": 18,
    "tips_total": 24
  }
]
```

**Tiebreaker order:** total_points DESC → exact_scores DESC → username ASC

---

## Users

### `PUT /users/me` 🔒 JWT

Update the authenticated user's profile picture.

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `avatar` | file | ✅ | image/* — resized to 128×128 JPEG |

**Response 200**
```json
{
  "avatar_url": "/uploads/new-uuid.jpg"
}
```

---

### `DELETE /users/me/avatar` 🔒 JWT

Delete the custom profile picture and revert to the DiceBear auto-generated avatar.

**Response 200**
```json
{
  "avatar_url": null
}
```

---

### `PUT /users/me/password` 🔒 JWT

Change the authenticated user's password.

**Content-Type:** `application/json`

```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword123!"
}
```

**Response 200**
```json
{
  "message": "Passwort erfolgreich geändert"
}
```

**Errors**
- `401` — Current password is incorrect
- `400` — New password does not meet the configured rules

---

## Admin

### `GET /admin/matches` 🔒 Admin

Returns all matches with full team details for the admin panel.

**Response 200** — Array of match objects (same shape as `GET /matches`).

---

### `PUT /admin/matches/:id/result` 🔒 Admin

Enter the result for a finished match. Triggers immediate recalculation of `points_awarded` for all tips on that match.

**Content-Type:** `application/json`

```json
{
  "home_goals": 3,
  "away_goals": 1
}
```

**Response 200**
```json
{
  "id": 1,
  "home_goals": 3,
  "away_goals": 1,
  "status": "finished"
}
```

**Errors**
- `400` — Missing or invalid goals (must be integers ≥ 0)
- `404` — Match not found

---

### `GET /admin/settings` 🔒 Admin

Returns the current password validation rules.

**Response 200**
```json
{
  "minLength": 6,
  "requireDigit": false,
  "requireSpecial": false
}
```

---

### `PUT /admin/settings` 🔒 Admin

Update password validation rules. Applies to all future registrations and password changes.

**Content-Type:** `application/json`

```json
{
  "minLength": 8,
  "requireDigit": true,
  "requireSpecial": false
}
```

**Response 200** — Updated settings object (same shape as `GET /admin/settings`).

---

## Avatar URL Resolution

Profile pictures are served as static files from the backend:

```
avatar_url set   →  <BACKEND_URL><avatar_url>
                    e.g. https://wm-tipps-api.railway.app/uploads/abc123.jpg

avatar_url null  →  https://api.dicebear.com/9.x/initials/svg
                    ?seed=<username>
                    &backgroundColor=b6e3f4,c0aede
```

The frontend resolves this logic in `client/src/components/common/Avatar.tsx`.

---

## Scoring Algorithm

```typescript
function calculatePoints(tip: { home: number; away: number }, result: { home: number; away: number }): number {
  if (tip.home === result.home && tip.away === result.away) return 3;  // exact score
  if (Math.sign(tip.home - tip.away) === Math.sign(result.home - result.away)) return 1;  // correct outcome
  return 0;
}
```

> **KO round multiplier:** Points are doubled for knockout-round matches (implemented via the match's `group_name` containing `KO` or a dedicated flag — see `scoringService.ts`).
