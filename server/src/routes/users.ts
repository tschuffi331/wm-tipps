import { Router, Response } from 'express';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import bcrypt from 'bcryptjs';
import db from '../db/database';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { getDiceBearUrl } from '../services/avatarService';
import { getPasswordRules, validatePassword } from '../utils/passwordValidator';

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

  // Always write to a NEW file so sharp never reads and writes the same path
  // (happens when the uploaded file is already a .jpg)
  const outputFilename = `${path.basename(req.file.path, path.extname(req.file.path))}-r.jpg`;
  const resizedPath = path.join(UPLOADS_DIR, outputFilename);
  await sharp(req.file.path).resize(128, 128).jpeg({ quality: 85 }).toFile(resizedPath);
  fs.unlinkSync(req.file.path); // always remove the original multer temp file

  const avatarUrl = `/uploads/${outputFilename}`;
  db.prepare('UPDATE users SET avatar_url = ? WHERE id = ?').run(avatarUrl, req.userId);

  res.json({ avatar_url: avatarUrl });
});

// PUT /api/users/me/password  — change own password
router.put('/me/password', requireAuth, async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'currentPassword and newPassword are required' });
    return;
  }

  const user = db.prepare('SELECT id, password FROM users WHERE id = ?').get(req.userId) as
    { id: number; password: string } | undefined;
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) { res.status(401).json({ error: 'Aktuelles Passwort ist falsch' }); return; }

  const pwError = validatePassword(newPassword, getPasswordRules());
  if (pwError) { res.status(400).json({ error: pwError }); return; }

  const hash = await bcrypt.hash(newPassword, 10);
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hash, req.userId);

  res.json({ message: 'Passwort erfolgreich geändert' });
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
