"""Match seed data — equivalent of db/seeds/matches.ts.

72 group-stage matches. KO matches are inserted via migration 004_ko_matches.sql.
Source: Wikipedia / official FIFA 2026 World Cup schedule (corrected June 2026).
"""
from db.database import get_db

# (match_number, group_name, matchday, home_team_name, away_team_name, kickoff_utc, venue)
_MATCHES = [
    # GROUP A: Mexico · South Korea · South Africa · Czechia
    (1,  "A", 1, "Mexico",       "South Africa",           "2026-06-11T19:00:00Z", "Estadio Azteca, Mexico City"),
    (2,  "A", 1, "South Korea",  "Czechia",                "2026-06-12T02:00:00Z", "Estadio Akron, Guadalajara"),
    (3,  "A", 2, "Czechia",      "South Africa",           "2026-06-18T16:00:00Z", "Mercedes-Benz Stadium, Atlanta"),
    (4,  "A", 2, "Mexico",       "South Korea",            "2026-06-19T01:00:00Z", "Estadio Akron, Guadalajara"),
    (5,  "A", 3, "Czechia",      "Mexico",                 "2026-06-25T01:00:00Z", "Estadio Azteca, Mexico City"),
    (6,  "A", 3, "South Africa", "South Korea",            "2026-06-25T01:00:00Z", "Estadio BBVA, Monterrey"),
    # GROUP B: Canada · Switzerland · Qatar · Bosnia and Herzegovina
    (7,  "B", 1, "Canada",       "Bosnia and Herzegovina", "2026-06-12T19:00:00Z", "BMO Field, Toronto"),
    (8,  "B", 1, "Qatar",        "Switzerland",            "2026-06-13T19:00:00Z", "Levi's Stadium, San Francisco"),
    (9,  "B", 2, "Switzerland",  "Bosnia and Herzegovina", "2026-06-18T19:00:00Z", "SoFi Stadium, Los Angeles"),
    (10, "B", 2, "Canada",       "Qatar",                  "2026-06-18T22:00:00Z", "BC Place, Vancouver"),
    (11, "B", 3, "Switzerland",  "Canada",                 "2026-06-24T19:00:00Z", "BC Place, Vancouver"),
    (12, "B", 3, "Bosnia and Herzegovina", "Qatar",        "2026-06-24T19:00:00Z", "Lumen Field, Seattle"),
    # GROUP C: Brazil · Morocco · Scotland · Haiti
    (13, "C", 1, "Haiti",        "Scotland",               "2026-06-13T01:00:00Z", "Gillette Stadium, Boston"),
    (14, "C", 1, "Brazil",       "Morocco",                "2026-06-13T22:00:00Z", "MetLife Stadium, New York/NJ"),
    (15, "C", 2, "Scotland",     "Morocco",                "2026-06-19T22:00:00Z", "Gillette Stadium, Boston"),
    (16, "C", 2, "Brazil",       "Haiti",                  "2026-06-20T00:30:00Z", "Lincoln Financial Field, Philadelphia"),
    (17, "C", 3, "Scotland",     "Brazil",                 "2026-06-24T22:00:00Z", "Hard Rock Stadium, Miami"),
    (18, "C", 3, "Morocco",      "Haiti",                  "2026-06-24T22:00:00Z", "Mercedes-Benz Stadium, Atlanta"),
    # GROUP D: USA · Australia · Paraguay · Turkey
    (19, "D", 1, "USA",          "Paraguay",               "2026-06-12T01:00:00Z", "SoFi Stadium, Los Angeles"),
    (20, "D", 1, "Australia",    "Turkey",                 "2026-06-13T04:00:00Z", "BC Place, Vancouver"),
    (21, "D", 2, "USA",          "Australia",              "2026-06-19T19:00:00Z", "Lumen Field, Seattle"),
    (22, "D", 2, "Turkey",       "Paraguay",               "2026-06-20T03:00:00Z", "Levi's Stadium, San Francisco"),
    (23, "D", 3, "Turkey",       "USA",                    "2026-06-25T02:00:00Z", "SoFi Stadium, Los Angeles"),
    (24, "D", 3, "Paraguay",     "Australia",              "2026-06-25T02:00:00Z", "Levi's Stadium, San Francisco"),
    # GROUP E: Germany · Ecuador · Ivory Coast · Curaçao
    (25, "E", 1, "Germany",      "Curaçao",                "2026-06-14T17:00:00Z", "NRG Stadium, Houston"),
    (26, "E", 1, "Ivory Coast",  "Ecuador",                "2026-06-14T23:00:00Z", "Lincoln Financial Field, Philadelphia"),
    (27, "E", 2, "Germany",      "Ivory Coast",            "2026-06-20T20:00:00Z", "BMO Field, Toronto"),
    (28, "E", 2, "Ecuador",      "Curaçao",                "2026-06-21T00:00:00Z", "Arrowhead Stadium, Kansas City"),
    (29, "E", 3, "Curaçao",      "Ivory Coast",            "2026-06-25T20:00:00Z", "Lincoln Financial Field, Philadelphia"),
    (30, "E", 3, "Ecuador",      "Germany",                "2026-06-25T20:00:00Z", "MetLife Stadium, New York/NJ"),
    # GROUP F: Netherlands · Japan · Tunisia · Sweden
    (31, "F", 1, "Netherlands",  "Japan",                  "2026-06-14T20:00:00Z", "AT&T Stadium, Dallas"),
    (32, "F", 1, "Sweden",       "Tunisia",                "2026-06-15T02:00:00Z", "Estadio BBVA, Monterrey"),
    (33, "F", 2, "Netherlands",  "Sweden",                 "2026-06-20T17:00:00Z", "NRG Stadium, Houston"),
    (34, "F", 2, "Tunisia",      "Japan",                  "2026-06-21T04:00:00Z", "Estadio BBVA, Monterrey"),
    (35, "F", 3, "Japan",        "Sweden",                 "2026-06-25T23:00:00Z", "AT&T Stadium, Dallas"),
    (36, "F", 3, "Tunisia",      "Netherlands",            "2026-06-25T23:00:00Z", "Arrowhead Stadium, Kansas City"),
    # GROUP G: Belgium · Iran · Egypt · New Zealand
    (37, "G", 1, "Belgium",      "Egypt",                  "2026-06-15T19:00:00Z", "Lumen Field, Seattle"),
    (38, "G", 1, "Iran",         "New Zealand",            "2026-06-16T01:00:00Z", "SoFi Stadium, Los Angeles"),
    (39, "G", 2, "Belgium",      "Iran",                   "2026-06-21T19:00:00Z", "SoFi Stadium, Los Angeles"),
    (40, "G", 2, "New Zealand",  "Egypt",                  "2026-06-22T01:00:00Z", "BC Place, Vancouver"),
    (41, "G", 3, "Egypt",        "Iran",                   "2026-06-27T03:00:00Z", "Lumen Field, Seattle"),
    (42, "G", 3, "New Zealand",  "Belgium",                "2026-06-27T03:00:00Z", "BC Place, Vancouver"),
    # GROUP H: Spain · Uruguay · Saudi Arabia · Cape Verde
    (43, "H", 1, "Spain",        "Cape Verde",             "2026-06-15T16:00:00Z", "Mercedes-Benz Stadium, Atlanta"),
    (44, "H", 1, "Saudi Arabia", "Uruguay",                "2026-06-15T22:00:00Z", "Hard Rock Stadium, Miami"),
    (45, "H", 2, "Spain",        "Saudi Arabia",           "2026-06-21T16:00:00Z", "Mercedes-Benz Stadium, Atlanta"),
    (46, "H", 2, "Uruguay",      "Cape Verde",             "2026-06-21T22:00:00Z", "Hard Rock Stadium, Miami"),
    (47, "H", 3, "Cape Verde",   "Saudi Arabia",           "2026-06-26T00:00:00Z", "NRG Stadium, Houston"),
    (48, "H", 3, "Uruguay",      "Spain",                  "2026-06-26T02:00:00Z", "Estadio Akron, Guadalajara"),
    # GROUP I: France · Senegal · Norway · Iraq
    (49, "I", 1, "France",       "Senegal",                "2026-06-16T19:00:00Z", "MetLife Stadium, New York/NJ"),
    (50, "I", 1, "Iraq",         "Norway",                 "2026-06-16T22:00:00Z", "Gillette Stadium, Boston"),
    (51, "I", 2, "France",       "Iraq",                   "2026-06-22T21:00:00Z", "Lincoln Financial Field, Philadelphia"),
    (52, "I", 2, "Norway",       "Senegal",                "2026-06-23T00:00:00Z", "MetLife Stadium, New York/NJ"),
    (53, "I", 3, "Norway",       "France",                 "2026-06-26T19:00:00Z", "Gillette Stadium, Boston"),
    (54, "I", 3, "Senegal",      "Iraq",                   "2026-06-26T19:00:00Z", "BMO Field, Toronto"),
    # GROUP J: Argentina · Austria · Algeria · Jordan
    (55, "J", 1, "Argentina",    "Algeria",                "2026-06-16T01:00:00Z", "Arrowhead Stadium, Kansas City"),
    (56, "J", 1, "Austria",      "Jordan",                 "2026-06-16T04:00:00Z", "Levi's Stadium, San Francisco"),
    (57, "J", 2, "Argentina",    "Austria",                "2026-06-22T17:00:00Z", "AT&T Stadium, Dallas"),
    (58, "J", 2, "Jordan",       "Algeria",                "2026-06-23T03:00:00Z", "Levi's Stadium, San Francisco"),
    (59, "J", 3, "Algeria",      "Austria",                "2026-06-28T02:00:00Z", "Arrowhead Stadium, Kansas City"),
    (60, "J", 3, "Jordan",       "Argentina",              "2026-06-28T02:00:00Z", "AT&T Stadium, Dallas"),
    # GROUP K: Portugal · Colombia · Uzbekistan · DR Congo
    (61, "K", 1, "Portugal",     "DR Congo",               "2026-06-17T17:00:00Z", "NRG Stadium, Houston"),
    (62, "K", 1, "Uzbekistan",   "Colombia",               "2026-06-18T02:00:00Z", "Estadio Azteca, Mexico City"),
    (63, "K", 2, "Portugal",     "Uzbekistan",             "2026-06-23T17:00:00Z", "NRG Stadium, Houston"),
    (64, "K", 2, "Colombia",     "DR Congo",               "2026-06-24T02:00:00Z", "Estadio Akron, Guadalajara"),
    (65, "K", 3, "Colombia",     "Portugal",               "2026-06-27T23:30:00Z", "Hard Rock Stadium, Miami"),
    (66, "K", 3, "DR Congo",     "Uzbekistan",             "2026-06-27T23:30:00Z", "Mercedes-Benz Stadium, Atlanta"),
    # GROUP L: England · Croatia · Panama · Ghana
    (67, "L", 1, "England",      "Croatia",                "2026-06-17T20:00:00Z", "AT&T Stadium, Dallas"),
    (68, "L", 1, "Ghana",        "Panama",                 "2026-06-17T23:00:00Z", "BMO Field, Toronto"),
    (69, "L", 2, "England",      "Ghana",                  "2026-06-23T20:00:00Z", "Gillette Stadium, Boston"),
    (70, "L", 2, "Panama",       "Croatia",                "2026-06-23T23:00:00Z", "BMO Field, Toronto"),
    (71, "L", 3, "Panama",       "England",                "2026-06-27T21:00:00Z", "MetLife Stadium, New York/NJ"),
    (72, "L", 3, "Croatia",      "Ghana",                  "2026-06-27T21:00:00Z", "Lincoln Financial Field, Philadelphia"),
]


def seed_matches() -> None:
    conn = get_db()
    inserted = 0
    for mn, gn, md, home_name, away_name, ko, venue in _MATCHES:
        home = conn.execute("SELECT id FROM teams WHERE name = ?", (home_name,)).fetchone()
        away = conn.execute("SELECT id FROM teams WHERE name = ?", (away_name,)).fetchone()
        if not home:
            print(f"  WARNING: team not found: {home_name}")
            continue
        if not away:
            print(f"  WARNING: team not found: {away_name}")
            continue
        conn.execute(
            """
            INSERT OR IGNORE INTO matches
              (match_number, group_name, matchday, home_team_id, away_team_id, kickoff_utc, venue)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (mn, gn, md, home["id"], away["id"], ko, venue),
        )
        inserted += 1
    conn.commit()
    print(f"Seeded {inserted} matches")
