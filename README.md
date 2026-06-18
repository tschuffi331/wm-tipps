# WM Tipps 2026 ⚽

Tipp-App für die FIFA Herren-Weltmeisterschaft 2026 (USA · Kanada · Mexiko).
Mehrere Benutzer können sich registrieren, für alle 72 Vorrundenspiele tippen und sich auf der Rangliste messen.

**Live:** https://tschuffi331.github.io/wm-tipps/ · **API:** https://wm-tipps-production.up.railway.app/api/health

---

## Features

- Registrierung mit Benutzername + optionalem Profilbild (128×128 JPEG, via Pillow + sharp)
- Automatisch generierter DiceBear-Avatar (Initialen-Style) als Fallback
- Tipps für alle 72 Vorrundenspiele (12 Gruppen × 6 Spiele)
- Deadline-Guard: Tipps nur bis zum Anpfiff möglich; danach gesperrt
- Öffentliche Rangliste (Punkte → exakte Treffer → Benutzername alphabetisch)
- KO-Runden-Bonus: Punkte verdoppeln sich ab Achtelfinale
- **Gruppenansicht:** Tabellenstand aller 12 Gruppen mit Qualifikationsmarkierungen (Sechzehntelfinale)
- **Andere Tipps:** Nach Spielende sind die Tipps aller Mitspieler sichtbar
- Admin-Panel: Ergebnisse eintragen, Live-Ergebnisse von worldcup26.ir abrufen, Punkte neu berechnen, Passwortregeln konfigurieren, Benutzer umbenennen & löschen
- Passwort ändern (Profil-Seite)
- WCAG 2.1 AA Accessibility

## Punktesystem

| Tipp | Punkte (Vorrunde) | Punkte (KO) |
|------|-------------------|-------------|
| Exaktes Ergebnis | 3 | 6 |
| Richtiger Ausgang | 1 | 2 |
| Falsch | 0 | 0 |

---

## Technologie

| Bereich | Stack |
|---------|-------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, TanStack Query |
| Backend | Python 3.12, FastAPI, SQLite |
| Auth | JWT (PyJWT + bcrypt) |
| Avatare | Pillow (Upload-Resize), DiceBear API (Fallback) |
| CI/CD | GitHub Actions |
| Hosting | GitHub Pages (Frontend) + Railway via Docker (Backend) |

---

## Lokale Entwicklung

### Voraussetzungen

- Python 3.12+
- Node.js 20+ (nur für den Client)
- Git

### 1. Repository klonen

```bash
git clone https://github.com/tschuffi331/wm-tipps.git
cd wm-tipps
```

### 2. Server starten

```bash
cd server
cp .env.example .env        # JWT_SECRET setzen!
pip install -r requirements.txt
uvicorn main:app --reload --port 3001   # API auf http://localhost:3001

# Datenbank + Seeds werden beim ersten Start automatisch angelegt
```

### 3. Client starten (neues Terminal)

```bash
cd client
cp .env.example .env.local   # VITE_API_URL=http://localhost:3001/api
npm install
npm run dev                  # App auf http://localhost:5173
```

### 4. Ersten Admin-User erstellen

Nach dem Registrieren über die Web-Oberfläche:

```bash
cd server
python - <<'EOF'
from db.database import get_db
conn = get_db()
conn.execute("UPDATE users SET role='admin' WHERE username=?", ("DEIN_USERNAME",))
conn.commit()
EOF
```

---

## Deployment

Jeder Push auf `main` triggert automatisch den passenden GitHub Actions Workflow.

### Frontend → GitHub Pages

1. GitHub Secret `VITE_API_URL` setzen (z. B. `https://wm-tipps-api.railway.app/api`)
2. Settings → Pages → Source: Branch `gh-pages`, Ordner `/`
3. Push auf `main` mit Änderungen in `client/` → Build + Deploy via `peaceiris/actions-gh-pages`

### Backend → Railway

1. [Railway](https://railway.app) Projekt anlegen → "Deploy from GitHub Repo" → Root-Verzeichnis: `server/`
2. Railway erkennt das `Dockerfile` automatisch und baut ein Python-Image
3. Umgebungsvariablen im Railway-Dashboard setzen (siehe unten)
4. GitHub Secret `RAILWAY_TOKEN` setzen
5. Push auf `main` mit Änderungen in `server/` → `railway up --detach --service wm-tipps`

### Umgebungsvariablen (Server)

| Variable | Pflicht | Beispiel | Beschreibung |
|----------|---------|---------|--------------|
| `JWT_SECRET` | ✅ | `supersecretkey123` | Signing-Key für JWT-Token |
| `JWT_EXPIRES_IN` | – | `7d` | Token-Gültigkeit (Default: `7d`) |
| `PORT` | – | `3001` | HTTP-Port (Default: `3001`) |
| `DATABASE_PATH` | – | `./data/wm2026.db` | SQLite-Datei |
| `UPLOADS_DIR` | – | `./uploads` | Verzeichnis für Profilbilder |
| `ALLOWED_ORIGINS` | – | `https://tschuffi331.github.io` | CORS-Whitelist (kommagetrennt) |

---

## Projektstruktur

```
wm-tipps/
├── client/                  # React + Vite Frontend
│   └── src/
│       ├── api/             # Axios-Wrapper je Ressource
│       ├── components/      # Layout, Matches, Common
│       ├── context/         # AuthContext (JWT)
│       ├── pages/           # Je Route eine Page-Komponente
│       └── types/           # Shared TypeScript Types
├── server/                  # Python + FastAPI Backend
│   ├── main.py              # App-Einstiegspunkt (uvicorn)
│   ├── requirements.txt     # Python-Abhängigkeiten
│   ├── Dockerfile           # Docker-Image für Railway
│   ├── db/                  # SQLite, Migrations, Seeds
│   ├── middleware/          # auth (PyJWT), upload (Pillow)
│   ├── routes/              # REST-Endpunkte (FastAPI Router)
│   │   ├── admin.py         # Ergebnisse, Benutzer, Einstellungen
│   │   ├── auth.py          # Register, Login
│   │   ├── matches.py       # Spielplan
│   │   ├── tips.py          # Tipps + fremde Tipps nach Kickoff
│   │   ├── leaderboard.py   # Rangliste
│   │   └── users.py         # Profil, Passwort, Avatar
│   ├── services/            # scoring_service, avatar_service
│   └── utils/               # password_validator
├── docs/                    # Technische Dokumentation
│   ├── API.md               # REST API Referenz
│   ├── ARCHITECTURE.md      # Architektur-Übersicht
│   ├── RUNBOOK.md           # Betriebshandbuch
│   └── adr/                 # Architecture Decision Records
├── .github/workflows/       # CI/CD Pipelines
└── ONBOARDING.md            # Claude Code Onboarding Guide
```

---

## Dokumentation

| Dokument | Inhalt |
|----------|--------|
| [docs/API.md](docs/API.md) | Vollständige REST API Referenz |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architektur, Datenfluss, Entscheidungen |
| [docs/RUNBOOK.md](docs/RUNBOOK.md) | Deploy, Rollback, Incident-Playbooks |
| [ONBOARDING.md](ONBOARDING.md) | Claude Code Onboarding für neue Teammitglieder |

---

## Beitragen

Dieses Projekt nutzt einen PR-basierten Workflow — direkte Pushes auf `main` sind gesperrt.

```bash
git checkout -b feature/meine-aenderung
# Änderungen vornehmen
git push -u origin feature/meine-aenderung

# Pull Request auf GitHub öffnen
```
