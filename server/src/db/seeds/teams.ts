import db from '../database';

interface TeamSeed {
  name: string;
  short_name: string;
  flag_emoji: string;
  confederation: string;
}

// 48 teams — official WM 2026 draw (Source: sky sport, December 2025)
const teams: TeamSeed[] = [
  // GROUP A
  { name: 'Mexico',               short_name: 'MEX', flag_emoji: '🇲🇽', confederation: 'CONCACAF' },
  { name: 'South Korea',          short_name: 'KOR', flag_emoji: '🇰🇷', confederation: 'AFC'      },
  { name: 'South Africa',         short_name: 'RSA', flag_emoji: '🇿🇦', confederation: 'CAF'      },
  { name: 'Czechia',              short_name: 'CZE', flag_emoji: '🇨🇿', confederation: 'UEFA'     },
  // GROUP B
  { name: 'Canada',               short_name: 'CAN', flag_emoji: '🇨🇦', confederation: 'CONCACAF' },
  { name: 'Switzerland',          short_name: 'SUI', flag_emoji: '🇨🇭', confederation: 'UEFA'     },
  { name: 'Qatar',                short_name: 'QAT', flag_emoji: '🇶🇦', confederation: 'AFC'      },
  { name: 'Bosnia and Herzegovina', short_name: 'BIH', flag_emoji: '🇧🇦', confederation: 'UEFA'  },
  // GROUP C
  { name: 'Brazil',               short_name: 'BRA', flag_emoji: '🇧🇷', confederation: 'CONMEBOL' },
  { name: 'Morocco',              short_name: 'MAR', flag_emoji: '🇲🇦', confederation: 'CAF'      },
  { name: 'Scotland',             short_name: 'SCO', flag_emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', confederation: 'UEFA'     },
  { name: 'Haiti',                short_name: 'HAI', flag_emoji: '🇭🇹', confederation: 'CONCACAF' },
  // GROUP D
  { name: 'USA',                  short_name: 'USA', flag_emoji: '🇺🇸', confederation: 'CONCACAF' },
  { name: 'Australia',            short_name: 'AUS', flag_emoji: '🇦🇺', confederation: 'AFC'      },
  { name: 'Paraguay',             short_name: 'PAR', flag_emoji: '🇵🇾', confederation: 'CONMEBOL' },
  { name: 'Turkey',               short_name: 'TUR', flag_emoji: '🇹🇷', confederation: 'UEFA'     },
  // GROUP E
  { name: 'Germany',              short_name: 'GER', flag_emoji: '🇩🇪', confederation: 'UEFA'     },
  { name: 'Ecuador',              short_name: 'ECU', flag_emoji: '🇪🇨', confederation: 'CONMEBOL' },
  { name: 'Ivory Coast',          short_name: 'CIV', flag_emoji: '🇨🇮', confederation: 'CAF'      },
  { name: 'Curaçao',              short_name: 'CUW', flag_emoji: '🇨🇼', confederation: 'CONCACAF' },
  // GROUP F
  { name: 'Netherlands',          short_name: 'NED', flag_emoji: '🇳🇱', confederation: 'UEFA'     },
  { name: 'Japan',                short_name: 'JPN', flag_emoji: '🇯🇵', confederation: 'AFC'      },
  { name: 'Tunisia',              short_name: 'TUN', flag_emoji: '🇹🇳', confederation: 'CAF'      },
  { name: 'Sweden',               short_name: 'SWE', flag_emoji: '🇸🇪', confederation: 'UEFA'     },
  // GROUP G
  { name: 'Belgium',              short_name: 'BEL', flag_emoji: '🇧🇪', confederation: 'UEFA'     },
  { name: 'Iran',                 short_name: 'IRN', flag_emoji: '🇮🇷', confederation: 'AFC'      },
  { name: 'Egypt',                short_name: 'EGY', flag_emoji: '🇪🇬', confederation: 'CAF'      },
  { name: 'New Zealand',          short_name: 'NZL', flag_emoji: '🇳🇿', confederation: 'OFC'      },
  // GROUP H
  { name: 'Spain',                short_name: 'ESP', flag_emoji: '🇪🇸', confederation: 'UEFA'     },
  { name: 'Uruguay',              short_name: 'URU', flag_emoji: '🇺🇾', confederation: 'CONMEBOL' },
  { name: 'Saudi Arabia',         short_name: 'KSA', flag_emoji: '🇸🇦', confederation: 'AFC'      },
  { name: 'Cape Verde',           short_name: 'CPV', flag_emoji: '🇨🇻', confederation: 'CAF'      },
  // GROUP I
  { name: 'France',               short_name: 'FRA', flag_emoji: '🇫🇷', confederation: 'UEFA'     },
  { name: 'Senegal',              short_name: 'SEN', flag_emoji: '🇸🇳', confederation: 'CAF'      },
  { name: 'Norway',               short_name: 'NOR', flag_emoji: '🇳🇴', confederation: 'UEFA'     },
  { name: 'Iraq',                 short_name: 'IRQ', flag_emoji: '🇮🇶', confederation: 'AFC'      },
  // GROUP J
  { name: 'Argentina',            short_name: 'ARG', flag_emoji: '🇦🇷', confederation: 'CONMEBOL' },
  { name: 'Austria',              short_name: 'AUT', flag_emoji: '🇦🇹', confederation: 'UEFA'     },
  { name: 'Algeria',              short_name: 'ALG', flag_emoji: '🇩🇿', confederation: 'CAF'      },
  { name: 'Jordan',               short_name: 'JOR', flag_emoji: '🇯🇴', confederation: 'AFC'      },
  // GROUP K
  { name: 'Portugal',             short_name: 'POR', flag_emoji: '🇵🇹', confederation: 'UEFA'     },
  { name: 'Colombia',             short_name: 'COL', flag_emoji: '🇨🇴', confederation: 'CONMEBOL' },
  { name: 'Uzbekistan',           short_name: 'UZB', flag_emoji: '🇺🇿', confederation: 'AFC'      },
  { name: 'DR Congo',             short_name: 'COD', flag_emoji: '🇨🇩', confederation: 'CAF'      },
  // GROUP L
  { name: 'England',              short_name: 'ENG', flag_emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', confederation: 'UEFA'     },
  { name: 'Croatia',              short_name: 'CRO', flag_emoji: '🇭🇷', confederation: 'UEFA'     },
  { name: 'Panama',               short_name: 'PAN', flag_emoji: '🇵🇦', confederation: 'CONCACAF' },
  { name: 'Ghana',                short_name: 'GHA', flag_emoji: '🇬🇭', confederation: 'CAF'      },
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
