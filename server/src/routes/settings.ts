import { Router, Request, Response } from 'express';
import db from '../db/database';

const router = Router();

// GET /api/settings/phase  — public, no auth required
router.get('/phase', (_req: Request, res: Response) => {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'wm_phase'").get() as
    { value: string } | undefined;
  res.json({ wmPhase: row?.value ?? 'Vorrunde' });
});

export default router;
