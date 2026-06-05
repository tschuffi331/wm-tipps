"""Password rules helper — equivalent of passwordValidator.ts."""
import re
from dataclasses import dataclass
from db.database import get_db


@dataclass
class PasswordRules:
    min_length: int
    require_digit: bool
    require_special: bool


def get_password_rules() -> PasswordRules:
    """Read current password rules from the settings table."""
    conn = get_db()
    rows = conn.execute(
        "SELECT key, value FROM settings WHERE key LIKE 'pw_%'"
    ).fetchall()
    mapping = {r["key"]: r["value"] for r in rows}
    return PasswordRules(
        min_length=int(mapping.get("pw_min_length", 6)),
        require_digit=mapping.get("pw_require_digit", "0") == "1",
        require_special=mapping.get("pw_require_special", "0") == "1",
    )


def validate_password(password: str, rules: PasswordRules) -> str | None:
    """Return an error message string, or None if the password is valid."""
    if len(password) < rules.min_length:
        return f"Passwort muss mindestens {rules.min_length} Zeichen lang sein"
    if rules.require_digit and not re.search(r"\d", password):
        return "Passwort muss mindestens eine Ziffer enthalten"
    if rules.require_special and not re.search(r"[^a-zA-Z0-9]", password):
        return "Passwort muss mindestens ein Sonderzeichen enthalten"
    return None
