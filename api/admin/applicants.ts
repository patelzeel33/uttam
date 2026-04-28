import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { dbConnect } from '../lib/dbConnect.js';
import { Applicant } from '../lib/models/Applicant.js';


function verifyToken(req: VercelRequest): boolean {
  const JWT_SECRET = process.env.JWT_SECRET || 'uttam-hiring-secret-key-2024';
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return false;
  try {
    jwt.verify(auth.slice(7), JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  if (!verifyToken(req)) {
    return res.status(401).json({ error: 'Unauthorized. Please login first.' });
  }

  try {
    await dbConnect();

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const search = (req.query.search as string) || '';
    const statusFilter = (req.query.status as string) || '';

    const query: any = {};
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (statusFilter && statusFilter !== 'all') {
      query.status = statusFilter;
    }

    const total = await Applicant.countDocuments(query);
    const applicants = await Applicant.find(query)
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      applicants: applicants.map((a) => ({ ...a, id: a._id.toString() })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Fetch applicants error:', error);
    return res.status(500).json({ error: 'Failed to fetch applicants.' });
  }
}
