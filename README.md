# WM Tipps 2026 ⚽

Tipp-App für die FIFA Herren-Weltmeisterschaft 2026 (USA · Kanada · Mexiko).

## Features

- Registrierung mit Benutzername + optionalem Profilbild
- Automatisch generierter Avatar (DiceBear Initialen) falls kein Bild hochgeladen
- Tipps für alle 72 Vorrundenspiele (12 Gruppen × 6 Spiele)
- Rangliste mit Punktestand
- Punktesystem: 3 Punkte exaktes Ergebnis, 1 Punkt richtiger Ausgang
- Admin-Panel zum Ergebnisse eintragen
- Deadline: Tipps nur vor Anpfiff möglich

## Lokale Entwicklung

### Voraussetzungen

- Node.js 20+

### Server starten

```bash
cd server
cp .env.example .env
# JWT_SECRET in .env anpassen!
npm install
npm run dev
```

### Client starten (neues Terminal)

```bash
cd client
cp .env.example .env.local
npm install
npm run dev
```

App läuft unter `http://localhost:5173`

### Ersten Admin-User erstellen

Nach dem Registrieren eines Users direkt in der DB:

```bash
cd server
npx tsx -e "import db from './src/db/database'; db.prepare(\"UPDATE users SET role='admin' WHERE username=?\").run('DEIN_USERNAME');"
```

## Deployment

### Frontend → GitHub Pages

1. GitHub Secret `VITE_API_URL` setzen (z.B. `https://wm-tipps-api.railway.app/api`)
2. In GitHub: Settings → Pages → Source: `gh-pages` Branch
3. Push auf `main` → GitHub Actions deployed automatisch

### Backend → Railway

1. [Railway](https://railway.app) Account erstellen
2. Neues Projekt → "Deploy from GitHub Repo" → `server/` als Root-Verzeichnis
3. Umgebungsvariablen setzen (siehe `server/.env.example`)
4. GitHub Secret `RAILWAY_TOKEN` setzen → GitHub Actions deployed automatisch

## Technologie

| Bereich | Stack |
|---------|-------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, SQLite (better-sqlite3) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Avatare | DiceBear API (Initialen-Style) |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages + Railway |
