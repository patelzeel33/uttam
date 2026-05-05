import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbConnect } from './lib/dbConnect.js';
import { Applicant } from './lib/models/Applicant.js';
import { Referral } from './lib/models/Referral.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await dbConnect();

    const { fullName, phoneNumber, email, address, city, experience, hasLicense, referralCode } = req.body;

    // Validation
    if (!fullName || !phoneNumber) {
      return res.status(400).json({ error: 'Full Name and Phone Number are required.' });
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit phone number.' });
    }

    // ── Referral code validation ──
    let referrerId: any = null;
    const cleanReferralCode = referralCode?.trim().toUpperCase();

    if (cleanReferralCode) {
      // 1. Find the referrer by their unique referral_code
      const referrer = await Applicant.findOne({ referral_code: cleanReferralCode });

      if (!referrer) {
        return res.status(400).json({ error: 'Invalid referral code. Please check and try again.' });
      }

      // 2. User cannot use their own referral code (check by phone number)
      if (referrer.phoneNumber === cleanPhone) {
        return res.status(400).json({ error: 'You cannot use your own referral code.' });
      }

      referrerId = referrer._id;
    }

    // ── Create the new applicant ──
    const applicant = new Applicant({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email?.trim(),
      address: address?.trim(),
      city: city?.trim(),
      experience,
      hasLicense,
      referralCodeInput: cleanReferralCode || undefined,
      referred_by: referrerId || undefined,
      status: 'pending',
      hoursLogged: 0,
      submittedAt: new Date(),
    });

    await applicant.save();
    console.log('New applicant saved:', applicant._id, '| Referral code:', applicant.referral_code);

    // ── Create referral relationship & increment referrer count ──
    if (referrerId) {
      try {
        // Create referral record
        await Referral.create({
          referrer_id: referrerId,
          referred_user_id: applicant._id,
          created_at: new Date(),
        });

        // Increment the referrer's ridersReferred count
        await Applicant.findByIdAndUpdate(referrerId, { $inc: { ridersReferred: 1 } });

        console.log('Referral relationship created. Referrer:', referrerId, '-> New user:', applicant._id);
      } catch (err) {
        console.error('Failed to create referral relationship:', err);
        // Don't fail the registration if referral tracking fails
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: applicant._id.toString(),
      referral_code: applicant.referral_code,
    });
  } catch (error: any) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'This phone number is already registered. Our team will contact you soon.' });
    }
    return res.status(500).json({ error: error.message || 'Failed to submit application. Please try again.' });
  }
}
