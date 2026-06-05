"""Match seed data — equivalent of db/seeds/matches.ts.

72 group-stage matches. KO matches are inserted via migration 004_ko_matches.sql.
"""
from db.database import get_db

# (match_number, group_name, matchday, home_team_name, away_team_name, kickoff_utc, venue)
_MATCHES = [
    # GROUP A: Mexico · South Korea · South Africa · Czechia
    (1,  "A", 1, "Mexico",       "South Korea",            "2026-06-11T21:00:00Z", "Estadio Azteca, Mexico City"),
    (2,  "A", 1, "South Africa", "Czechia",                "2026-06-12T01:00:00Z", "Estadio BBVA, Monterrey"),
    (3,  "A", 2, "South Korea",  "South Africa",           "2026-06-16T22:00:00Z", "Estadio Azteca, Mexico City"),
    (4,  "A", 2, "Mexico",       "Czechia",                "2026-06-17T01:00:00Z", "Estadio Akron, Guadalajara"),
    (5,  "A", 3, "Czechia",      "South Korea",            "2026-06-22T01:00:00Z", "Estadio BBVA, Monterrey"),
    (6,  "A", 3, "South Africa", "Mexico",                 "2026-06-22T01:00:00Z", "Estadio Akron, Guadalajara"),
    # GROUP B: Canada · Switzerland · Qatar · Bosnia and Herzegovina
    (7,  "B", 1, "Canada",       "Switzerland",            "2026-06-12T18:00:00Z", "BMO Field, Toronto"),
    (8,  "B", 1, "Qatar",        "Bosnia and Herzegovina", "2026-06-12T21:00:00Z", "SoFi Stadium, Los Angeles"),
    (9,  "B", 2, "Switzerland",  "Qatar",                  "2026-06-17T18:00:00Z", "BMO Field, Toronto"),
    (10, "B", 2, "Canada",       "Bosnia and Herzegovina", "2026-06-17T21:00:00Z", "BC Place, Vancouver"),
    (11, "B", 3, "Bosnia and Herzegovina", "Switzerland",  "2026-06-22T21:00:00Z", "SoFi Stadium, Los Angeles"),
    (12, "B", 3, "Qatar",        "Canada",                 "2026-06-22T21:00:00Z", "BC Place, Vancouver"),
    # GROUP C: Brazil · Morocco · Scotland · Haiti
    (13, "C", 1, "Brazil",       "Morocco",                "2026-06-13T00:00:00Z", "Hard Rock Stadium, Miami"),
    (14, "C", 1, "Scotland",     "Haiti",                  "2026-06-13T18:00:00Z", "Mercedes-Benz Stadium, Atlanta"),
    (15, "C", 2, "Morocco",      "Scotland",               "2026-06-18T00:00:00Z", "Hard Rock Stadium, Miami"),
    (16, "C", 2, "Brazil",       "Haiti",                  "2026-06-18T21:00:00Z", "Mercedes-Benz Stadium, Atlanta"),
    (17, "C", 3, "Haiti",        "Morocco",                "2026-06-23T01:00:00Z", "Hard Rock Stadium, Miami"),
    (18, "C", 3, "Scotland",     "Brazil",                 "2026-06-23T01:00:00Z", "Mercedes-Benz Stadium, Atlanta"),
    # GROUP D: USA · Australia · Paraguay · Turkey
    (19, "D", 1, "USA",          "Australia",              "2026-06-13T21:00:00Z", "MetLife Stadium, New York/NJ"),
    (20, "D", 1, "Paraguay",     "Turkey",                 "2026-06-14T01:00:00Z", "AT&T Stadium, Dallas"),
    (21, "D", 2, "Australia",    "Paraguay",               "2026-06-19T18:00:00Z", "MetLife Stadium, New York/NJ"),
    (22, "D", 2, "USA",          "Turkey",                 "2026-06-19T21:00:00Z", "Arrowhead Stadium, Kansas City"),
    (23, "D", 3, "Turkey",       "Australia",              "2026-06-24T01:00:00Z", "AT&T Stadium, Dallas"),
    (24, "D", 3, "Paraguay",     "USA",                    "2026-06-24T01:00:00Z", "Arrowhead Stadium, Kansas City"),
    # GROUP E: Germany · Ecuador · Ivory Coast · Curaçao
    (25, "E", 1, "Germany",      "Curaçao",                "2026-06-14T23:00:00Z", "NRG Stadium, Houston"),
    (26, "E", 1, "Ecuador",      "Ivory Coast",            "2026-06-15T01:00:00Z", "Lincoln Financial Field, Philadelphia"),
    (27, "E", 2, "Germany",      "Ivory Coast",            "2026-06-21T00:00:00Z", "BMO Field, Toronto"),
    (28, "E", 2, "Curaçao",      "Ecuador",                "2026-06-21T18:00:00Z", "Lincoln Financial Field, Philadelphia"),
    (29, "E", 3, "Ecuador",      "Germany",                "2026-06-26T00:00:00Z", "MetLife Stadium, New York/NJ"),
    (30, "E", 3, "Ivory Coast",  "Curaçao",                "2026-06-26T00:00:00Z", "NRG Stadium, Houston"),
    # GROUP F: Netherlands · Japan · Tunisia · Sweden
    (31, "F", 1, "Netherlands",  "Japan",                  "2026-06-14T18:00:00Z", "Levi's Stadium, San Francisco"),
    (32, "F", 1, "Tunisia",      "Sweden",                 "2026-06-14T21:00:00Z", "Lumen Field, Seattle"),
    (33, "F", 2, "Japan",        "Tunisia",                "2026-06-19T22:00:00Z", "Levi's Stadium, San Francisco"),
    (34, "F", 2, "Netherlands",  "Sweden",                 "2026-06-20T01:00:00Z", "BC Place, Vancouver"),
    (35, "F", 3, "Sweden",       "Japan",                  "2026-06-25T01:00:00Z", "Lumen Field, Seattle"),
    (36, "F", 3, "Tunisia",      "Netherlands",            "2026-06-25T01:00:00Z", "BC Place, Vancouver"),
    # GROUP G: Belgium · Iran · Egypt · New Zealand
    (37, "G", 1, "Belgium",      "Iran",                   "2026-06-15T18:00:00Z", "Gillette Stadium, Boston"),
    (38, "G", 1, "Egypt",        "New Zealand",            "2026-06-15T21:00:00Z", "NRG Stadium, Houston"),
    (39, "G", 2, "Iran",         "Egypt",                  "2026-06-20T18:00:00Z", "Gillette Stadium, Boston"),
    (40, "G", 2, "Belgium",      "New Zealand",            "2026-06-20T21:00:00Z", "AT&T Stadium, Dallas"),
    (41, "G", 3, "New Zealand",  "Iran",                   "2026-06-25T21:00:00Z", "Gillette Stadium, Boston"),
    (42, "G", 3, "Egypt",        "Belgium",                "2026-06-25T21:00:00Z", "AT&T Stadium, Dallas"),
    # GROUP H: Spain · Uruguay · Saudi Arabia · Cape Verde
    (43, "H", 1, "Spain",        "Uruguay",                "2026-06-15T22:00:00Z", "Hard Rock Stadium, Miami"),
    (44, "H", 1, "Saudi Arabia", "Cape Verde",             "2026-06-16T01:00:00Z", "Mercedes-Benz Stadium, Atlanta"),
    (45, "H", 2, "Uruguay",      "Saudi Arabia",           "2026-06-21T22:00:00Z", "Hard Rock Stadium, Miami"),
    (46, "H", 2, "Spain",        "Cape Verde",             "2026-06-22T01:00:00Z", "Lincoln Financial Field, Philadelphia"),
    (47, "H", 3, "Cape Verde",   "Uruguay",                "2026-06-27T01:00:00Z", "Hard Rock Stadium, Miami"),
    (48, "H", 3, "Saudi Arabia", "Spain",                  "2026-06-27T01:00:00Z", "Mercedes-Benz Stadium, Atlanta"),
    # GROUP I: France · Senegal · Norway · Iraq
    (49, "I", 1, "France",       "Senegal",                "2026-06-16T18:00:00Z", "SoFi Stadium, Los Angeles"),
    (50, "I", 1, "Norway",       "Iraq",                   "2026-06-16T21:00:00Z", "Arrowhead Stadium, Kansas City"),
    (51, "I", 2, "Senegal",      "Norway",                 "2026-06-22T18:00:00Z", "SoFi Stadium, Los Angeles"),
    (52, "I", 2, "France",       "Iraq",                   "2026-06-22T21:00:00Z", "Levi's Stadium, San Francisco"),
    (53, "I", 3, "Iraq",         "Senegal",                "2026-06-27T18:00:00Z", "Arrowhead Stadium, Kansas City"),
    (54, "I", 3, "Norway",       "France",                 "2026-06-27T18:00:00Z", "Levi's Stadium, San Francisco"),
    # GROUP J: Argentina · Austria · Algeria · Jordan
    (55, "J", 1, "Argentina",    "Austria",                "2026-06-16T22:00:00Z", "MetLife Stadium, New York/NJ"),
    (56, "J", 1, "Algeria",      "Jordan",                 "2026-06-17T01:00:00Z", "Gillette Stadium, Boston"),
    (57, "J", 2, "Austria",      "Algeria",                "2026-06-22T22:00:00Z", "MetLife Stadium, New York/NJ"),
    (58, "J", 2, "Argentina",    "Jordan",                 "2026-06-23T01:00:00Z", "Gillette Stadium, Boston"),
    (59, "J", 3, "Jordan",       "Austria",                "2026-06-28T01:00:00Z", "MetLife Stadium, New York/NJ"),
    (60, "J", 3, "Algeria",      "Argentina",              "2026-06-28T01:00:00Z", "Gillette Stadium, Boston"),
    # GROUP K: Portugal · Colombia · Uzbekistan · DR Congo
    (61, "K", 1, "Portugal",     "Colombia",               "2026-06-17T22:00:00Z", "Lumen Field, Seattle"),
    (62, "K", 1, "Uzbekistan",   "DR Congo",               "2026-06-18T01:00:00Z", "BC Place, Vancouver"),
    (63, "K", 2, "Colombia",     "Uzbekistan",             "2026-06-23T22:00:00Z", "Lumen Field, Seattle"),
    (64, "K", 2, "Portugal",     "DR Congo",               "2026-06-24T01:00:00Z", "BC Place, Vancouver"),
    (65, "K", 3, "DR Congo",     "Colombia",               "2026-06-29T01:00:00Z", "Lumen Field, Seattle"),
    (66, "K", 3, "Uzbekistan",   "Portugal",               "2026-06-29T01:00:00Z", "BC Place, Vancouver"),
    # GROUP L: England · Croatia · Panama · Ghana
    (67, "L", 1, "England",      "Croatia",                "2026-06-18T18:00:00Z", "Levi's Stadium, San Francisco"),
    (68, "L", 1, "Panama",       "Ghana",                  "2026-06-18T21:00:00Z", "SoFi Stadium, Los Angeles"),
    (69, "L", 2, "Croatia",      "Panama",                 "2026-06-24T18:00:00Z", "Levi's Stadium, San Francisco"),
    (70, "L", 2, "England",      "Ghana",                  "2026-06-24T21:00:00Z", "SoFi Stadium, Los Angeles"),
    (71, "L", 3, "Ghana",        "Croatia",                "2026-06-29T21:00:00Z", "Levi's Stadium, San Francisco"),
    (72, "L", 3, "Panama",       "England",                "2026-06-29T21:00:00Z", "SoFi Stadium, Los Angeles"),
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
