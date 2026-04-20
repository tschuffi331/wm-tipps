# WM Tipps 2026 — Runbook

Operational playbook for deploying, maintaining, and recovering the WM Tipps application.

**Production URLs:**
- Frontend: https://tschuffi331.github.io/wm-tipps/
- Backend API: https://wm-tipps-api.railway.app/api
- Health check: https://wm-tipps-api.railway.app/api/health
- GitHub repo: https://github.com/tschuffi331/wm-tipps
- Railway dashboard: https://railway.app/dashboard

---

## Access & Secrets

| What | Where |
|------|-------|
| Admin user in app | Register normally, then promote via DB (see below) |
| `RAILWAY_TOKEN` | GitHub → Settings → Secrets and variables → Actions |
| `VITE_API_URL` | GitHub → Settings → Secrets and variables → Actions |
| Railway env vars | Railway Dashboard → Service → Variables |
| GitHub Pages config | GitHub → Settings → Pages |

---

## Routine Operations

### Deploy — Frontend (manual trigger)

```
GitHub → Actions → "Deploy Frontend" → Run workflow
```

Or push any change to `client/` on `main`.

### Deploy — Backend (manual trigger)

```
GitHub → Actions → "Deploy Backend" → Run workflow
```

Or push any change to `server/` on `main`.

### Check deployment status

```bash
# View recent Actions runs
gh run list --repo tschuffi331/wm-tipps --limit 5

# Check Railway service status
railway status --service wm-tipps
```

### View backend logs

```bash
# Install Railway CLI if not already installed
npm install -g @railway/cli
railway login
railway logs --service wm-tipps
```

Or: Railway Dashboard → Service → Logs tab.

---

## Promote a User to Admin

After the user has registered via the web UI:

```bash
cd server

# Option A: Railway run (production)
railway run --service wm-tipps npx tsx -e \
  "import db from './src/db/database.js'; \
   const r = db.prepare(\"UPDATE users SET role='admin' WHERE username=?\").run('USERNAME'); \
   console.log(r.changes, 'rows updated');"

# Option B: locally against the dev DB
npx tsx -e \
  "import db from './src/db/database.js'; \
   db.prepare(\"UPDATE users SET role='admin' WHERE username=?\").run('USERNAME');"
```

---

## Entering Match Results

1. Log in as an admin user at `/#/admin`
2. Find the finished match
3. Enter home goals and away goals
4. Click "Speichern" — points are recalculated immediately for all tips on that match
5. The leaderboard auto-refreshes within 60 seconds

---

## Configuring Password Rules

1. Log in as admin at `/#/admin`
2. Scroll to "Passwort-Regeln"
3. Adjust minimum length and digit/special-character requirements
4. Click "Regeln speichern" — rules apply to all future registrations and password changes

---

## Backup the Database

The SQLite database lives at `data/wm2026.db` on the Railway container filesystem. **Railway's ephemeral filesystem means the DB is lost on each new deploy.** Until a persistent volume is attached, take manual backups before deploying:

```bash
# Download DB from Railway container
railway run --service wm-tipps cat data/wm2026.db > backup-$(date +%Y%m%d).db
```

Or via Railway CLI shell:
```bash
railway shell --service wm-tipps
# Inside container:
cp data/wm2026.db /tmp/backup.db
```

---

## Playbooks

### Playbook: Backend returns 5xx / site is blank

**Symptoms:** Frontend shows network errors; `/api/health` returns non-200.

1. Check Railway logs:
   ```bash
   railway logs --service wm-tipps --tail 100
   ```
2. Look for startup errors (DB migration failure, missing env vars).
3. If the service crashed, Railway auto-restarts — wait 30 seconds and check health again.
4. If it's a bad deploy: **Rollback** (see below).

---

### Playbook: GitHub Actions deploy failed

**Symptoms:** Red ✗ on a workflow run in GitHub Actions.

1. Open the failed run → expand the failing step.
2. Common causes:

| Error | Fix |
|-------|-----|
| `RAILWAY_TOKEN` invalid or expired | Regenerate token in Railway dashboard → update GitHub secret |
| `VITE_API_URL` not set | Add secret in GitHub → Settings → Secrets |
| TypeScript build error | Fix the type error in code and push again |
| `npm ci` fails (lockfile mismatch) | Run `npm install` locally and commit updated `package-lock.json` |

---

### Playbook: Rollback Backend

Railway keeps the previous deployment available:

**Via Railway Dashboard:**
1. Railway Dashboard → Service → Deployments tab
2. Find the last known-good deployment
3. Click "Rollback to this deployment"

**Via CLI:**
```bash
# List recent deployments
railway deployments --service wm-tipps

# Redeploy a specific deployment ID
railway redeploy <deployment-id> --service wm-tipps
```

---

### Playbook: Rollback Frontend

GitHub Pages serves the content of the `gh-pages` branch. To roll back:

```bash
git clone https://github.com/tschuffi331/wm-tipps.git
cd wm-tipps
git checkout gh-pages

# Find the commit before the bad deploy
git log --oneline -10

# Reset to the previous good commit
git reset --hard <good-commit-sha>
git push --force origin gh-pages
```

---

### Playbook: Database wiped after Railway redeploy

Railway's ephemeral filesystem wipes data on each new container image. The seed data (48 teams, 72 matches) is automatically re-inserted on startup via `INSERT OR IGNORE`. **User accounts and tips are lost.**

**Prevention:** Attach a Railway persistent volume before any redeploy that affects schema or data.

**Recovery:**
1. All teams and matches are restored automatically from seeds on next startup.
2. Users must re-register.
3. Match results must be re-entered via the admin panel.
4. Tips cannot be recovered without a backup.

**Future mitigation:** Attach a Railway volume at mount path `/app/data` and set `DATABASE_PATH=/app/data/wm2026.db`.

---

### Playbook: User locked out (forgot password)

There is no self-service password reset in v1. An admin must reset the password directly in the DB:

```bash
# 1. Generate a bcrypt hash for the new password
node -e "const b=require('bcryptjs'); console.log(b.hashSync('NewPassword123', 10));"

# 2. Update the DB
railway run --service wm-tipps npx tsx -e \
  "import db from './src/db/database.js'; \
   db.prepare(\"UPDATE users SET password=? WHERE username=?\").run('\$HASH', 'USERNAME');"
```

Tell the user to change their password immediately via the profile page after logging in.

---

### Playbook: CORS errors in browser console

**Symptom:** Browser shows `Access-Control-Allow-Origin` errors; API calls fail.

1. Check `ALLOWED_ORIGINS` in Railway environment variables.
2. Ensure the GitHub Pages URL is listed exactly: `https://tschuffi331.github.io`
3. Update the env var in Railway Dashboard → Variables → `ALLOWED_ORIGINS`.
4. The change takes effect on the next request — no redeploy required.

---

## Environment Variables Reference

### Server (Railway Dashboard → Variables)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | ✅ | — | Random secret for signing JWT tokens. At least 32 chars. |
| `JWT_EXPIRES_IN` | — | `7d` | Token lifetime (e.g. `7d`, `24h`) |
| `PORT` | — | `3001` | HTTP port |
| `DATABASE_PATH` | — | `./data/wm2026.db` | Path to SQLite file |
| `UPLOADS_DIR` | — | `./uploads` | Directory for profile picture storage |
| `ALLOWED_ORIGINS` | — | `http://localhost:5173` | Comma-separated CORS allowlist |
| `NODE_ENV` | — | — | Set to `production` on Railway |

### Frontend (GitHub Actions Secrets)

| Secret | Description |
|--------|-------------|
| `VITE_API_URL` | Full URL to the backend API, e.g. `https://wm-tipps-api.railway.app/api` |

---

## Monitoring & Alerts

There is no automated alerting in v1. Recommended manual checks:

```bash
# Health check (can be added to UptimeRobot or similar)
curl https://wm-tipps-api.railway.app/api/health

# Expected response:
# {"status":"ok","timestamp":"2026-..."}
```

Set up a free [UptimeRobot](https://uptimerobot.com) monitor on the health endpoint to get email alerts if the API goes down.

---

## Escalation

| Issue | Contact |
|-------|---------|
| Railway outage | https://status.railway.app |
| GitHub Pages outage | https://www.githubstatus.com |
| Application bug | Open an issue at https://github.com/tschuffi331/wm-tipps/issues |
