import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@uttam.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'uttam@admin2024';
    const JWT_SECRET = process.env.JWT_SECRET || 'uttam-hiring-secret-key-2024';

    const body = req.body ?? {};
    const email: string = body.email ?? '';
    const password: string = body.password ?? '';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (email.trim() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      success: true,
      token,
      admin: { email, role: 'admin' },
    });
  } catch (error: any) {
    console.error('[admin/login] Error:', error?.stack ?? error?.message ?? error);
    return res.status(500).json({ error: `Login failed: ${error?.message}` });
  }
}
