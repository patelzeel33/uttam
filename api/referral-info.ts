import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbConnect } from './lib/dbConnect.js';
import { Applicant } from './lib/models/Applicant.js';
import { Referral } from './lib/models/Referral.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await dbConnect();

    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Referral code is required.' });
    }

    const cleanCode = code.trim().toUpperCase();

    // Find the user by their referral code
    const user = await Applicant.findOne({ referral_code: cleanCode }).lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Get all referral records for this user
    const referrals = await Referral.find({ referrer_id: user._id })
      .sort({ created_at: -1 })
      .lean();

    // Get details of referred users
    const referredUserIds = referrals.map(r => r.referred_user_id);
    const referredUsers = await Applicant.find({ _id: { $in: referredUserIds } })
      .select('fullName submittedAt status referral_code')
      .lean();

    // Build a map for quick lookup
    const referredUsersMap = new Map(referredUsers.map(u => [u._id.toString(), u]));

    // Build the referred users list with join dates
    const referredList = referrals.map(r => {
      const referred = referredUsersMap.get(r.referred_user_id.toString());
      return {
        id: r.referred_user_id.toString(),
        fullName: referred?.fullName || 'Unknown',
        joinDate: referred?.submittedAt || r.created_at,
        status: referred?.status || 'pending',
      };
    });

    // Get referrer info if this user was referred by someone
    let referredBy = null;
    if (user.referred_by) {
      const referrer = await Applicant.findById(user.referred_by)
        .select('fullName referral_code')
        .lean();
      if (referrer) {
        referredBy = {
          fullName: referrer.fullName,
          referral_code: referrer.referral_code,
        };
      }
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        referral_code: user.referral_code,
        ridersReferred: user.ridersReferred || 0,
        status: user.status,
        submittedAt: user.submittedAt,
      },
      referredBy,
      referredUsers: referredList,
      totalReferred: referredList.length,
    });
  } catch (error: any) {
    console.error('Referral info error:', error);
    return res.status(500).json({ error: 'Failed to fetch referral information.' });
  }
}
