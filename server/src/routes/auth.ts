import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import sharp from 'sharp';
import db from '../db/database';
import { upload } from '../middleware/upload';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { getDiceBearUrl } from '../services/avatarService';
import { getPasswordRules, validatePassword } from '../utils/passwordValidator';

const router = Router();

// POST /api/auth/register
router.post('/register', upload.single('avatar'), async (req: Request, res: Response) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }
  if (username.length < 3 || username.length > 30) {
    res.status(400).json({ error: 'Username must be 3–30 characters' });
    return;
  }
  const pwError = validatePassword(password, getPasswordRules());
  if (pwError) { res.status(400).json({ error: pwError }); return; }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    res.status(409).json({ error: 'Username already taken' });
    return;
  }

  const hash = await bcrypt.hash(password, 10);

  let avatarUrl: string | null = null;
  if (req.file) {
    // Always write to a NEW file so sharp never reads and writes the same path
    // (happens when the uploaded file is already a .jpg)
    const outputFilename = `${path.basename(req.file.path, path.extname(req.file.path))}-r.jpg`;
    const resizedPath = path.join(path.dirname(req.file.path), outputFilename);
    await sharp(req.file.path).resize(128, 128).jpeg({ quality: 85 }).toFile(resizedPath);
    const { unlinkSync } = await import('fs');
    unlinkSync(req.file.path); // always remove the original multer temp file
    avatarUrl = `/uploads/${outputFilename}`;
  }

  const result = db.prepare(
    'INSERT INTO users (username, password, avatar_url) VALUES (?, ?, ?)'
  ).run(username, hash, avatarUrl);

  const userId = result.lastInsertRowid as number;
  const token  = jwt.sign(
    { userId, role: 'user' },
    process.env.JWT_SECRET ?? '',
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' } as jwt.SignOptions
  );

  res.status(201).json({
    token,
    user: {
      id: userId,
      username,
      avatar_url: avatarUrl ?? getDiceBearUrl(username),
      role: 'user',
    },
  });
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  const user = db.prepare(
    'SELECT id, username, password, role, avatar_url FROM users WHERE username = ?'
  ).get(username) as { id: number; username: string; password: string; role: string; avatar_url: string | null } | undefined;

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ error: 'Invalid username or password' });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET ?? '',
    { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' } as jwt.SignOptions
  );

  res.json({
    token,
    user: {
      id:         user.id,
      username:   user.username,
      avatar_url: user.avatar_url ?? getDiceBearUrl(user.username),
      role:       user.role,
    },
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
  const user = db.prepare(`
    SELECT u.id, u.username, u.avatar_url, u.role,
           COALESCE(SUM(t.points_awarded), 0) AS total_points
    FROM   users u
    LEFT JOIN tips t ON t.user_id = u.id
    WHERE  u.id = ?
    GROUP BY u.id
  `).get(req.userId) as {
    id: number; username: string; avatar_url: string | null; role: string; total_points: number;
  } | undefined;

  if (!user) { res.status(404).json({ error: 'User not found' }); return; }

  res.json({
    id:           user.id,
    username:     user.username,
    avatar_url:   user.avatar_url ?? getDiceBearUrl(user.username),
    role:         user.role,
    total_points: user.total_points,
  });
});

export default router;
