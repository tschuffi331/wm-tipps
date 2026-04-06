import { Router, Response } from 'express';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import db from '../db/database';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { getDiceBearUrl } from '../services/avatarService';

const router = Router();
const UPLOADS_DIR = process.env.UPLOADS_DIR ?? './uploads';

// PUT /api/users/me  — update profile picture
router.put('/me', requireAuth, upload.single('avatar'), async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  // Remove old picture if it exists
  const existing = db.prepare('SELECT avatar_url FROM users WHERE id = ?').get(req.userId) as
    { avatar_url: string | null } | undefined;

  if (existing?.avatar_url) {
    const oldPath = path.join(UPLOADS_DIR, path.basename(existing.avatar_url));
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  const resizedPath = req.file.path.replace(path.extname(req.file.path), '.jpg');
  await sharp(req.file.path).resize(128, 128).jpeg({ quality: 85 }).toFile(resizedPath);
  if (resizedPath !== req.file.path) fs.unlinkSync(req.file.path);

  const avatarUrl = `/uploads/${path.basename(resizedPath)}`;
  db.prepare('UPDATE users SET avatar_url = ? WHERE id = ?').run(avatarUrl, req.userId);

  res.json({ avatar_url: avatarUrl });
});

// DELETE /api/users/me/avatar  — revert to DiceBear
router.delete('/me/avatar', requireAuth, (req: AuthRequest, res: Response) => {
  const existing = db.prepare('SELECT avatar_url, username FROM users WHERE id = ?').get(req.userId) as
    { avatar_url: string | null; username: string } | undefined;

  if (existing?.avatar_url) {
    const oldPath = path.join(UPLOADS_DIR, path.basename(existing.avatar_url));
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  db.prepare('UPDATE users SET avatar_url = NULL WHERE id = ?').run(req.userId);

  res.json({ avatar_url: getDiceBearUrl(existing?.username ?? '') });
});

export default router;
