import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { seedTeams } from './db/seeds/teams';
import { seedMatches } from './db/seeds/matches';

// Run seeds on every start (INSERT OR IGNORE keeps it idempotent)
seedTeams();
seedMatches();

const PORT = parseInt(process.env.PORT ?? '3001', 10);

app.listen(PORT, () => {
  console.log(`WM-Tipps API running on port ${PORT} [${process.env.NODE_ENV ?? 'development'}]`);
});
