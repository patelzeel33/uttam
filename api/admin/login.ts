import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sign } from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Read credentials at request-time so env vars are always fresh
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@uttam.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'uttam@admin2024';
    const JWT_SECRET = process.env.JWT_SECRET || 'uttam-hiring-secret-key-2024';

    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (email.trim() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      success: true,
      token,
      admin: { email, role: 'admin' },
    });
  } catch (error: any) {
    console.error('[admin/login] Error:', error?.message ?? error);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
}
