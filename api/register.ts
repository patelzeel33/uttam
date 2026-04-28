import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbConnect } from '../lib/dbConnect';
import { Applicant } from '../lib/models/Applicant';

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

    const { fullName, phoneNumber, email, address, city, experience, hasLicense } = req.body;

    // Validation
    if (!fullName || !phoneNumber) {
      return res.status(400).json({ error: 'Full Name and Phone Number are required.' });
    }

    if (phoneNumber.replace(/\D/g, '').length < 10) {
      return res.status(400).json({ error: 'Please enter a valid phone number.' });
    }

    const applicant = new Applicant({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email?.trim(),
      address: address?.trim(),
      city: city?.trim(),
      experience,
      hasLicense,
      status: 'pending',
      hoursLogged: 0,
      submittedAt: new Date(),
    });

    await applicant.save();
    console.log('New applicant saved:', applicant._id);

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: applicant._id.toString(),
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Failed to submit application. Please try again.' });
  }
}
