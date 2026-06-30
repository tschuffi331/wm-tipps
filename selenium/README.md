# WM Tipps 2026 — Selenium Tests

End-to-end browser tests for **https://tschuffi331.github.io/wm-tipps** using Selenium 4 + JUnit 5, built with Gradle.

---

## Voraussetzungen

| Tool | Mindestversion |
|------|---------------|
| Java | 17 |
| Google Chrome | aktuell (stable) |
| Gradle | 8.x (oder Gradle Wrapper, siehe unten) |

ChromeDriver wird automatisch von **WebDriverManager** heruntergeladen und muss **nicht** manuell installiert werden.

---

## Projektstruktur

```
selenium/
├── build.gradle                   Gradle-Build-Skript
├── settings.gradle
├── gradle/wrapper/
│   └── gradle-wrapper.properties  Gradle 8.7 Wrapper-Konfiguration
├── README.md
└── src/test/java/de/wmtipps/selenium/
    ├── config/
    │   ├── TestConfig.java        Konfiguration via System-Properties
    │   └── DriverFactory.java     Chrome-Driver-Erzeugung (headless by default)
    ├── pages/                     Page-Object-Model (POM)
    │   ├── BasePage.java
    │   ├── NavbarPage.java
    │   ├── HomePage.java
    │   ├── LoginPage.java
    │   ├── RegisterPage.java
    │   ├── LeaderboardPage.java
    │   ├── RulesPage.java
    │   ├── TipsPage.java
    │   ├── GroupsPage.java
    │   ├── ProfilePage.java
    │   ├── AdminPage.java
    │   └── NotFoundPage.java
    └── tests/
        ├── BaseTest.java          setUp/tearDown, Login-Hilfsmethoden
        ├── HomePageTest.java
        ├── LoginPageTest.java
        ├── RegisterPageTest.java
        ├── LeaderboardPageTest.java
        ├── RulesPageTest.java
        ├── TipsPageTest.java
        ├── GroupsPageTest.java
        ├── ProfilePageTest.java
        ├── AdminPageTest.java
        ├── NavigationTest.java
        └── NotFoundPageTest.java
```

---

## Bauen

### Nur kompilieren (ohne Tests auszuführen)

```bash
# Mit lokalem Gradle
gradle buildOnly -p selenium

# Mit Gradle Wrapper (nach gradlew generieren, siehe unten)
cd selenium && ./gradlew buildOnly
```

### Gradle Wrapper generieren (einmalig)

Falls noch kein `gradlew`-Skript vorhanden ist:

```bash
cd selenium
gradle wrapper
```

Danach steht `./gradlew` (Linux/macOS) bzw. `gradlew.bat` (Windows) zur Verfügung.

> **Windows mit Java 26 — Gradle 8.14.2 verwenden** (ältere Versionen unterstützen Java 26 nicht):
> ```powershell
> # Gradle 8.14.2 herunterladen und entpacken nach C:\gradle-8.14.2
> $env:PATH     = "C:\gradle-8.14.2\bin;$env:PATH"
> $env:JAVA_HOME = "C:\Program Files\jdk-26.0.1"
> cd selenium
> gradle wrapper       # generiert gradlew.bat einmalig
> .\gradlew.bat test
> ```

---

## Tests ausführen

### Einfachster Start — alle öffentlichen Tests (kein Login nötig)

```bash
cd selenium
gradle test
```

oder mit Gradle Wrapper:

```bash
cd selenium
./gradlew test          # Linux/macOS
gradlew.bat test        # Windows
```

Tests, die Zugangsdaten benötigen (`@EnabledIf("...hasTestCredentials")`), werden automatisch **übersprungen** wenn keine Credentials gesetzt sind.

---

### Mit Test-Zugangsdaten (geschützte Seiten)

```bash
gradle test \
  -PTEST_USERNAME=meinnutzer \
  -PTEST_PASSWORD=meinpasswort
```

oder via Java System-Property:

```bash
gradle test \
  -DTEST_USERNAME=meinnutzer \
  -DTEST_PASSWORD=meinpasswort
```

### Mit Admin-Zugangsdaten (Admin-Seite)

```bash
gradle test \
  -PTEST_USERNAME=user \
  -PTEST_PASSWORD=userpw \
  -PADMIN_USERNAME=admin \
  -PADMIN_PASSWORD=adminpw
```

---

### Browser sichtbar ausführen (nicht headless)

```bash
gradle test -PHEADLESS=false
```

oder die vordefinierte Task:

```bash
gradle runTestsHeaded
```

---

### Alle Konfigurationsoptionen

| Property | Standard | Beschreibung |
|----------|----------|--------------|
| `BASE_URL` | `https://tschuffi331.github.io/wm-tipps` | Basis-URL der Anwendung |
| `TEST_USERNAME` | *(leer)* | Benutzername für geschützte Seiten |
| `TEST_PASSWORD` | *(leer)* | Passwort für geschützte Seiten |
| `ADMIN_USERNAME` | *(leer)* | Admin-Benutzername |
| `ADMIN_PASSWORD` | *(leer)* | Admin-Passwort |
| `HEADLESS` | `true` | `false` = Browser sichtbar öffnen |
| `TIMEOUT_SECONDS` | `15` | Wartezeit für Element-Visibility (Sekunden) |

Properties können übergeben werden als:
- Gradle: `-Pkey=value`
- Java: `-Dkey=value`
- Umgebungsvariable (im Build-Skript bereits weitergeleitet)

---

## Test-Berichte

Nach dem Testlauf findet sich der HTML-Bericht unter:

```
selenium/build/reports/tests/test/index.html
```

Im Browser öffnen für detaillierte Ergebnisse inkl. Fehler-Stack-Traces.

---

## Test-Kategorien

| Testklasse | Auth nötig | Beschreibung |
|------------|-----------|--------------|
| `HomePageTest` | Nein | Startseite, 12 Gruppen, Navbar |
| `LoginPageTest` | Nein* | Login-Formular, falsches PW, Weiterleitung |
| `RegisterPageTest` | Nein | Registrier-Formular, Felder, Links |
| `LeaderboardPageTest` | Nein | Rangliste, Tabellen-Spalten |
| `RulesPageTest` | Nein | Regeln, Punkte-Badges, KO-Verdopplung |
| `NotFoundPageTest` | Nein | 404-Seite, Abseits-Text, Home-Link |
| `NavigationTest` | Teilw. | Navbar-Links, Hamburger, Auth-Links |
| `TipsPageTest` | Ja | Phase-Selektor, Spielkarten, Tipp-Inputs |
| `GroupsPageTest` | Ja | 12 Gruppen-Karten, Tabellenstand |
| `ProfilePageTest` | Ja | Profil, Logout, Passwort-Ändern |
| `AdminPageTest` | Admin | Spielliste, Fetch-Button, Passwort-Regeln |

\* `LoginPageTest#successfulLoginRedirectsToTips` braucht `TEST_USERNAME`/`TEST_PASSWORD`

---

## Lokale Entwicklung gegen localhost

```bash
gradle test \
  -PBASE_URL=http://localhost:5173 \
  -PTEST_USERNAME=devuser \
  -PTEST_PASSWORD=devpw \
  -PHEADLESS=false
```

> Stelle sicher, dass das Frontend mit `npm run dev` (im `client/`-Verzeichnis) läuft.

---

## GitHub Actions (CI)

Beispiel-Workflow-Snippet für `.github/workflows/selenium.yml`:

```yaml
name: Selenium Tests

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  selenium:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Run Selenium Tests
        working-directory: selenium
        run: ./gradlew test
        env:
          TEST_USERNAME: ${{ secrets.SELENIUM_TEST_USERNAME }}
          TEST_PASSWORD: ${{ secrets.SELENIUM_TEST_PASSWORD }}
          ADMIN_USERNAME: ${{ secrets.SELENIUM_ADMIN_USERNAME }}
          ADMIN_PASSWORD: ${{ secrets.SELENIUM_ADMIN_PASSWORD }}

      - name: Upload Test Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: selenium-test-report
          path: selenium/build/reports/tests/test/
```

Secrets `SELENIUM_TEST_USERNAME` etc. in den GitHub Repository Settings unter **Settings → Secrets and variables → Actions** anlegen.
