import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { dbConnect } from '../lib/dbConnect.js';
import { Applicant } from '../lib/models/Applicant.js';
import { Referral } from '../lib/models/Referral.js';


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
        { referral_code: { $regex: search, $options: 'i' } },
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

    // For each applicant, look up who referred them
    const applicantIds = applicants.map(a => a._id);
    const referrals = await Referral.find({
      referred_user_id: { $in: applicantIds }
    }).lean();

    // Build a map: referred_user_id -> referrer_id
    const referralMap = new Map(
      referrals.map(r => [r.referred_user_id.toString(), r.referrer_id.toString()])
    );

    // Get referrer names
    const referrerIds = [...new Set(referrals.map(r => r.referrer_id.toString()))];
    const referrers = await Applicant.find({ _id: { $in: referrerIds } })
      .select('fullName referral_code')
      .lean();
    const referrerMap = new Map(
      referrers.map(r => [r._id.toString(), { fullName: r.fullName, referral_code: r.referral_code }])
    );

    const enrichedApplicants = applicants.map(a => {
      const referrerId = referralMap.get(a._id.toString());
      const referrer = referrerId ? referrerMap.get(referrerId) : null;
      return {
        ...a,
        id: a._id.toString(),
        referral_code: a.referral_code,
        ridersReferred: a.ridersReferred || 0,
        referredByName: referrer?.fullName || null,
        referredByCode: referrer?.referral_code || null,
      };
    });

    return res.status(200).json({
      success: true,
      applicants: enrichedApplicants,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Fetch applicants error:', error);
    return res.status(500).json({ error: 'Failed to fetch applicants.' });
  }
}
