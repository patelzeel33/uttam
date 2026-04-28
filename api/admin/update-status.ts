import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verify } from 'jsonwebtoken';
import { dbConnect } from '../../lib/dbConnect';
import { Applicant } from '../../lib/models/Applicant';

function verifyToken(req: VercelRequest): boolean {
  const JWT_SECRET = process.env.JWT_SECRET || 'uttam-hiring-secret-key-2024';
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return false;
  try {
    verify(auth.slice(7), JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method Not Allowed' });

  if (!verifyToken(req)) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  try {
    await dbConnect();

    const { id, status, hoursLogged } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Applicant ID is required.' });
    }

    const validStatuses = ['pending', 'interview', 'active', 'rejected'];
    const updateData: any = {};
    if (status !== undefined) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value.' });
      }
      updateData.status = status;
    }
    if (hoursLogged !== undefined) {
      updateData.hoursLogged = Number(hoursLogged);
    }

    const updated = await Applicant.findByIdAndUpdate(id, updateData, { new: true }).lean();

    if (!updated) {
      return res.status(404).json({ error: 'Applicant not found.' });
    }

    return res.status(200).json({
      success: true,
      applicant: { ...updated, id: updated._id.toString() },
    });
  } catch (error: any) {
    console.error('Update status error:', error);
    return res.status(500).json({ error: 'Failed to update applicant status.' });
  }
}
