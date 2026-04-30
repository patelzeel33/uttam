import type { VercelRequest } from '@vercel/node';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  email: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Verify JWT token from Authorization header.
 * Returns the decoded payload if valid, or null if invalid/missing.
 */
export function verifyAdminToken(req: VercelRequest): AuthPayload | null {
  const JWT_SECRET = process.env.JWT_SECRET || 'uttam-hiring-secret-key-2024';
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) return null;

  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET) as AuthPayload;
    // Role-based check: only admins allowed
    if (decoded.role !== 'admin') return null;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Set standard CORS headers for admin endpoints.
 */
export function setCorsHeaders(res: any, methods: string = 'GET, POST, OPTIONS') {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
