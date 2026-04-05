import db from '../database';

interface TeamSeed {
  name: string;
  short_name: string;
  flag_emoji: string;
  confederation: string;
}

const teams: TeamSeed[] = [
  // UEFA (17)
  { name: 'Germany',      short_name: 'GER', flag_emoji: '🇩🇪', confederation: 'UEFA' },
  { name: 'France',       short_name: 'FRA', flag_emoji: '🇫🇷', confederation: 'UEFA' },
  { name: 'Spain',        short_name: 'ESP', flag_emoji: '🇪🇸', confederation: 'UEFA' },
  { name: 'England',      short_name: 'ENG', flag_emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA' },
  { name: 'Portugal',     short_name: 'POR', flag_emoji: '🇵🇹', confederation: 'UEFA' },
  { name: 'Netherlands',  short_name: 'NED', flag_emoji: '🇳🇱', confederation: 'UEFA' },
  { name: 'Belgium',      short_name: 'BEL', flag_emoji: '🇧🇪', confederation: 'UEFA' },
  { name: 'Croatia',      short_name: 'CRO', flag_emoji: '🇭🇷', confederation: 'UEFA' },
  { name: 'Denmark',      short_name: 'DEN', flag_emoji: '🇩🇰', confederation: 'UEFA' },
  { name: 'Austria',      short_name: 'AUT', flag_emoji: '🇦🇹', confederation: 'UEFA' },
  { name: 'Switzerland',  short_name: 'SUI', flag_emoji: '🇨🇭', confederation: 'UEFA' },
  { name: 'Serbia',       short_name: 'SRB', flag_emoji: '🇷🇸', confederation: 'UEFA' },
  { name: 'Poland',       short_name: 'POL', flag_emoji: '🇵🇱', confederation: 'UEFA' },
  { name: 'Albania',      short_name: 'ALB', flag_emoji: '🇦🇱', confederation: 'UEFA' },
  { name: 'Slovakia',     short_name: 'SVK', flag_emoji: '🇸🇰', confederation: 'UEFA' },
  { name: 'Czechia',      short_name: 'CZE', flag_emoji: '🇨🇿', confederation: 'UEFA' },
  { name: 'Turkey',       short_name: 'TUR', flag_emoji: '🇹🇷', confederation: 'UEFA' },
  // CONMEBOL (6)
  { name: 'Argentina',    short_name: 'ARG', flag_emoji: '🇦🇷', confederation: 'CONMEBOL' },
  { name: 'Brazil',       short_name: 'BRA', flag_emoji: '🇧🇷', confederation: 'CONMEBOL' },
  { name: 'Colombia',     short_name: 'COL', flag_emoji: '🇨🇴', confederation: 'CONMEBOL' },
  { name: 'Uruguay',      short_name: 'URU', flag_emoji: '🇺🇾', confederation: 'CONMEBOL' },
  { name: 'Ecuador',      short_name: 'ECU', flag_emoji: '🇪🇨', confederation: 'CONMEBOL' },
  { name: 'Paraguay',     short_name: 'PAR', flag_emoji: '🇵🇾', confederation: 'CONMEBOL' },
  // CONCACAF (6)
  { name: 'USA',          short_name: 'USA', flag_emoji: '🇺🇸', confederation: 'CONCACAF' },
  { name: 'Mexico',       short_name: 'MEX', flag_emoji: '🇲🇽', confederation: 'CONCACAF' },
  { name: 'Canada',       short_name: 'CAN', flag_emoji: '🇨🇦', confederation: 'CONCACAF' },
  { name: 'Panama',       short_name: 'PAN', flag_emoji: '🇵🇦', confederation: 'CONCACAF' },
  { name: 'Costa Rica',   short_name: 'CRC', flag_emoji: '🇨🇷', confederation: 'CONCACAF' },
  { name: 'Jamaica',      short_name: 'JAM', flag_emoji: '🇯🇲', confederation: 'CONCACAF' },
  // AFC (9)
  { name: 'Japan',        short_name: 'JPN', flag_emoji: '🇯🇵', confederation: 'AFC' },
  { name: 'South Korea',  short_name: 'KOR', flag_emoji: '🇰🇷', confederation: 'AFC' },
  { name: 'Iran',         short_name: 'IRN', flag_emoji: '🇮🇷', confederation: 'AFC' },
  { name: 'Australia',    short_name: 'AUS', flag_emoji: '🇦🇺', confederation: 'AFC' },
  { name: 'Saudi Arabia', short_name: 'KSA', flag_emoji: '🇸🇦', confederation: 'AFC' },
  { name: 'Qatar',        short_name: 'QAT', flag_emoji: '🇶🇦', confederation: 'AFC' },
  { name: 'Uzbekistan',   short_name: 'UZB', flag_emoji: '🇺🇿', confederation: 'AFC' },
  { name: 'Iraq',         short_name: 'IRQ', flag_emoji: '🇮🇶', confederation: 'AFC' },
  { name: 'Jordan',       short_name: 'JOR', flag_emoji: '🇯🇴', confederation: 'AFC' },
  // CAF (10)
  { name: 'Morocco',      short_name: 'MAR', flag_emoji: '🇲🇦', confederation: 'CAF' },
  { name: 'Senegal',      short_name: 'SEN', flag_emoji: '🇸🇳', confederation: 'CAF' },
  { name: 'Egypt',        short_name: 'EGY', flag_emoji: '🇪🇬', confederation: 'CAF' },
  { name: "Ivory Coast",  short_name: 'CIV', flag_emoji: '🇨🇮', confederation: 'CAF' },
  { name: 'Algeria',      short_name: 'ALG', flag_emoji: '🇩🇿', confederation: 'CAF' },
  { name: 'Ghana',        short_name: 'GHA', flag_emoji: '🇬🇭', confederation: 'CAF' },
  { name: 'South Africa', short_name: 'RSA', flag_emoji: '🇿🇦', confederation: 'CAF' },
  { name: 'DR Congo',     short_name: 'COD', flag_emoji: '🇨🇩', confederation: 'CAF' },
  { name: 'Tunisia',      short_name: 'TUN', flag_emoji: '🇹🇳', confederation: 'CAF' },
  { name: 'Cape Verde',   short_name: 'CPV', flag_emoji: '🇨🇻', confederation: 'CAF' },
  // OFC (1)
  { name: 'New Zealand',  short_name: 'NZL', flag_emoji: '🇳🇿', confederation: 'OFC' },
];

export function seedTeams(): void {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO teams (name, short_name, flag_emoji, confederation)
    VALUES (@name, @short_name, @flag_emoji, @confederation)
  `);

  const insertAll = db.transaction(() => {
    for (const team of teams) {
      insert.run(team);
    }
  });

  insertAll();
  console.log(`Seeded ${teams.length} teams`);
}

if (require.main === module) {
  seedTeams();
}
