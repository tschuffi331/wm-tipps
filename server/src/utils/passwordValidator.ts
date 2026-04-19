import db from '../db/database';

export interface PasswordRules {
  minLength: number;
  requireDigit: boolean;
  requireSpecial: boolean;
}

export function getPasswordRules(): PasswordRules {
  const rows = db.prepare(
    "SELECT key, value FROM settings WHERE key LIKE 'pw_%'"
  ).all() as { key: string; value: string }[];
  const map = Object.fromEntries(rows.map(r => [r.key, r.value]));
  return {
    minLength:      Number(map['pw_min_length'] ?? 6),
    requireDigit:   map['pw_require_digit']   === '1',
    requireSpecial: map['pw_require_special'] === '1',
  };
}

export function validatePassword(password: string, rules: PasswordRules): string | null {
  if (password.length < rules.minLength) {
    return `Passwort muss mindestens ${rules.minLength} Zeichen lang sein`;
  }
  if (rules.requireDigit && !/\d/.test(password)) {
    return 'Passwort muss mindestens eine Ziffer enthalten';
  }
  if (rules.requireSpecial && !/[^a-zA-Z0-9]/.test(password)) {
    return 'Passwort muss mindestens ein Sonderzeichen enthalten';
  }
  return null;
}
