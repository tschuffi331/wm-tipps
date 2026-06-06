import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';

import authRouter        from './routes/auth';
import matchesRouter     from './routes/matches';
import tipsRouter        from './routes/tips';
import leaderboardRouter from './routes/leaderboard';
import adminRouter       from './routes/admin';
import usersRouter       from './routes/users';
import settingsRouter    from './routes/settings';
import { errorHandler }  from './middleware/errorHandler';

dotenv.config();

const app = express();

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173').split(',').map(o => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded profile pictures
const UPLOADS_DIR = process.env.UPLOADS_DIR ?? './uploads';
app.use('/uploads', express.static(path.resolve(UPLOADS_DIR)));

// Routes
app.use('/api/auth',        authRouter);
app.use('/api/matches',     matchesRouter);
app.use('/api/tips',        tipsRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/admin',       adminRouter);
app.use('/api/users',       usersRouter);
app.use('/api/settings',    settingsRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
