import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbConnect } from '../lib/dbConnect.js';
import { Attendance } from '../lib/models/Attendance.js';
import { Applicant } from '../lib/models/Applicant.js';
import { verifyAdminToken, setCorsHeaders } from '../lib/authMiddleware.js';
import mongoose from 'mongoose';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res, 'GET, POST, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const admin = verifyAdminToken(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin access required.' });
  }

  await dbConnect();

  // ─── POST: Record login or logout ───
  if (req.method === 'POST') {
    try {
      const { applicantId, action, notes } = req.body || {};

      if (!applicantId || !action) {
        return res.status(400).json({ error: 'applicantId and action (login/logout) are required.' });
      }

      if (!mongoose.Types.ObjectId.isValid(applicantId)) {
        return res.status(400).json({ error: 'Invalid applicant ID.' });
      }

      // Verify applicant exists and is active
      const applicant = await Applicant.findById(applicantId).lean();
      if (!applicant) {
        return res.status(404).json({ error: 'Applicant not found.' });
      }

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (action === 'login') {
        // Check if already clocked in today (no logout yet)
        const openSession = await Attendance.findOne({
          applicantId,
          date: today,
          logoutTime: null,
        });

        if (openSession) {
          return res.status(400).json({ error: 'Already clocked in today. Please logout first.' });
        }

        const attendance = new Attendance({
          applicantId,
          date: today,
          loginTime: now,
          notes: notes || '',
        });

        await attendance.save();
        return res.status(201).json({ success: true, attendance, message: 'Login recorded.' });

      } else if (action === 'logout') {
        // Find the open session for today
        const openSession = await Attendance.findOne({
          applicantId,
          date: today,
          logoutTime: null,
        });

        if (!openSession) {
          return res.status(400).json({ error: 'No active login session found for today.' });
        }

        const loginTime = new Date(openSession.loginTime);
        const hoursWorked = Math.round(((now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)) * 100) / 100;

        openSession.logoutTime = now;
        openSession.hoursWorked = Math.max(0, hoursWorked);
        if (notes) openSession.notes = notes;
        await openSession.save();

        // Update total hoursLogged on the Applicant
        const totalHours = await Attendance.aggregate([
          { $match: { applicantId: new mongoose.Types.ObjectId(applicantId) } },
          { $group: { _id: null, total: { $sum: '$hoursWorked' } } },
        ]);
        const newTotal = totalHours[0]?.total || 0;
        await Applicant.findByIdAndUpdate(applicantId, { hoursLogged: Math.round(newTotal * 100) / 100 });

        return res.status(200).json({ success: true, attendance: openSession, hoursWorked, message: 'Logout recorded.' });

      } else {
        return res.status(400).json({ error: 'Invalid action. Use "login" or "logout".' });
      }
    } catch (error: any) {
      console.error('[attendance] POST error:', error);
      return res.status(500).json({ error: `Failed to record attendance: ${error?.message}` });
    }
  }

  // ─── GET: Fetch attendance records ───
  if (req.method === 'GET') {
    try {
      const { applicantId, startDate, endDate, page: pageStr, limit: limitStr } = req.query as any;

      const page = parseInt(pageStr) || 1;
      const limit = parseInt(limitStr) || 50;
      const query: any = {};

      if (applicantId) {
        if (!mongoose.Types.ObjectId.isValid(applicantId)) {
          return res.status(400).json({ error: 'Invalid applicant ID.' });
        }
        query.applicantId = new mongoose.Types.ObjectId(applicantId);
      }

      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate as string);
        if (endDate) query.date.$lte = new Date(endDate as string);
      }

      const total = await Attendance.countDocuments(query);
      const records = await Attendance.find(query)
        .sort({ date: -1, loginTime: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('applicantId', 'fullName phoneNumber city')
        .lean();

      return res.status(200).json({
        success: true,
        records: records.map((r: any) => ({
          ...r,
          id: r._id.toString(),
          applicantName: r.applicantId?.fullName || 'Unknown',
          applicantPhone: r.applicantId?.phoneNumber || '',
          applicantCity: r.applicantId?.city || '',
        })),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error: any) {
      console.error('[attendance] GET error:', error);
      return res.status(500).json({ error: `Failed to fetch attendance: ${error?.message}` });
    }
  }

  // ─── PATCH: Manual correction of an attendance record ───
  if (req.method === 'PATCH') {
    try {
      const { recordId, loginTime, logoutTime, notes } = req.body || {};

      if (!recordId) {
        return res.status(400).json({ error: 'recordId is required.' });
      }

      const record = await Attendance.findById(recordId);
      if (!record) {
        return res.status(404).json({ error: 'Attendance record not found.' });
      }

      if (loginTime) record.loginTime = new Date(loginTime);
      if (logoutTime) {
        record.logoutTime = new Date(logoutTime);
        const hours = (record.logoutTime.getTime() - record.loginTime.getTime()) / (1000 * 60 * 60);
        record.hoursWorked = Math.max(0, Math.round(hours * 100) / 100);
      }
      if (notes !== undefined) record.notes = notes;

      await record.save();

      // Recalculate total hours
      const totalHours = await Attendance.aggregate([
        { $match: { applicantId: record.applicantId } },
        { $group: { _id: null, total: { $sum: '$hoursWorked' } } },
      ]);
      await Applicant.findByIdAndUpdate(record.applicantId, {
        hoursLogged: Math.round((totalHours[0]?.total || 0) * 100) / 100,
      });

      return res.status(200).json({ success: true, record, message: 'Attendance updated.' });
    } catch (error: any) {
      console.error('[attendance] PATCH error:', error);
      return res.status(500).json({ error: `Failed to update attendance: ${error?.message}` });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
