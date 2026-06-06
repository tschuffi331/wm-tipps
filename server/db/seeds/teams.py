"""Team seed data — equivalent of db/seeds/teams.ts."""
from db.database import get_db

_TEAMS = [
    # GROUP A
    ("Mexico",               "MEX", "🇲🇽", "CONCACAF"),
    ("South Korea",          "KOR", "🇰🇷", "AFC"),
    ("South Africa",         "RSA", "🇿🇦", "CAF"),
    ("Czechia",              "CZE", "🇨🇿", "UEFA"),
    # GROUP B
    ("Canada",               "CAN", "🇨🇦", "CONCACAF"),
    ("Switzerland",          "SUI", "🇨🇭", "UEFA"),
    ("Qatar",                "QAT", "🇶🇦", "AFC"),
    ("Bosnia and Herzegovina","BIH", "🇧🇦", "UEFA"),
    # GROUP C
    ("Brazil",               "BRA", "🇧🇷", "CONMEBOL"),
    ("Morocco",              "MAR", "🇲🇦", "CAF"),
    ("Scotland",             "SCO", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "UEFA"),
    ("Haiti",                "HAI", "🇭🇹", "CONCACAF"),
    # GROUP D
    ("USA",                  "USA", "🇺🇸", "CONCACAF"),
    ("Australia",            "AUS", "🇦🇺", "AFC"),
    ("Paraguay",             "PAR", "🇵🇾", "CONMEBOL"),
    ("Turkey",               "TUR", "🇹🇷", "UEFA"),
    # GROUP E
    ("Germany",              "GER", "🇩🇪", "UEFA"),
    ("Ecuador",              "ECU", "🇪🇨", "CONMEBOL"),
    ("Ivory Coast",          "CIV", "🇨🇮", "CAF"),
    ("Curaçao",              "CUW", "🇨🇼", "CONCACAF"),
    # GROUP F
    ("Netherlands",          "NED", "🇳🇱", "UEFA"),
    ("Japan",                "JPN", "🇯🇵", "AFC"),
    ("Tunisia",              "TUN", "🇹🇳", "CAF"),
    ("Sweden",               "SWE", "🇸🇪", "UEFA"),
    # GROUP G
    ("Belgium",              "BEL", "🇧🇪", "UEFA"),
    ("Iran",                 "IRN", "🇮🇷", "AFC"),
    ("Egypt",                "EGY", "🇪🇬", "CAF"),
    ("New Zealand",          "NZL", "🇳🇿", "OFC"),
    # GROUP H
    ("Spain",                "ESP", "🇪🇸", "UEFA"),
    ("Uruguay",              "URU", "🇺🇾", "CONMEBOL"),
    ("Saudi Arabia",         "KSA", "🇸🇦", "AFC"),
    ("Cape Verde",           "CPV", "🇨🇻", "CAF"),
    # GROUP I
    ("France",               "FRA", "🇫🇷", "UEFA"),
    ("Senegal",              "SEN", "🇸🇳", "CAF"),
    ("Norway",               "NOR", "🇳🇴", "UEFA"),
    ("Iraq",                 "IRQ", "🇮🇶", "AFC"),
    # GROUP J
    ("Argentina",            "ARG", "🇦🇷", "CONMEBOL"),
    ("Austria",              "AUT", "🇦🇹", "UEFA"),
    ("Algeria",              "ALG", "🇩🇿", "CAF"),
    ("Jordan",               "JOR", "🇯🇴", "AFC"),
    # GROUP K
    ("Portugal",             "POR", "🇵🇹", "UEFA"),
    ("Colombia",             "COL", "🇨🇴", "CONMEBOL"),
    ("Uzbekistan",           "UZB", "🇺🇿", "AFC"),
    ("DR Congo",             "COD", "🇨🇩", "CAF"),
    # GROUP L
    ("England",              "ENG", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "UEFA"),
    ("Croatia",              "CRO", "🇭🇷", "UEFA"),
    ("Panama",               "PAN", "🇵🇦", "CONCACAF"),
    ("Ghana",                "GHA", "🇬🇭", "CAF"),
]


def seed_teams() -> None:
    conn = get_db()
    conn.executemany(
        "INSERT OR IGNORE INTO teams (name, short_name, flag_emoji, confederation) VALUES (?, ?, ?, ?)",
        _TEAMS,
    )
    conn.commit()
    print(f"Seeded {len(_TEAMS)} teams")
