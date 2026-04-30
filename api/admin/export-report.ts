import type { VercelRequest, VercelResponse } from '@vercel/node';
import { dbConnect } from '../lib/dbConnect.js';
import { Attendance } from '../lib/models/Attendance.js';
import { Applicant } from '../lib/models/Applicant.js';
import { verifyAdminToken, setCorsHeaders } from '../lib/authMiddleware.js';
import mongoose from 'mongoose';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res, 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  const admin = verifyAdminToken(req);
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized. Admin access required.' });
  }

  try {
    await dbConnect();

    const { month, year, format } = req.query as any;
    const exportFormat = (format || 'csv').toLowerCase();

    const reportYear = parseInt(year) || new Date().getFullYear();
    const reportMonth = parseInt(month) || new Date().getMonth() + 1;

    const startDate = new Date(reportYear, reportMonth - 1, 1);
    const endDate = new Date(reportYear, reportMonth, 0, 23, 59, 59);

    // Get all attendance with populated applicant info
    const records = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $lookup: {
          from: 'applicants',
          localField: 'applicantId',
          foreignField: '_id',
          as: 'applicant',
        },
      },
      { $unwind: '$applicant' },
      { $sort: { date: 1, loginTime: 1 } },
      {
        $project: {
          fullName: '$applicant.fullName',
          phoneNumber: '$applicant.phoneNumber',
          email: '$applicant.email',
          city: '$applicant.city',
          status: '$applicant.status',
          date: 1,
          loginTime: 1,
          logoutTime: 1,
          hoursWorked: 1,
          notes: 1,
        },
      },
    ]);

    // Also get monthly summary per person
    const summary = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$applicantId',
          totalHours: { $sum: '$hoursWorked' },
          daysWorked: { $addToSet: { $dateToString: { format: '%Y-%m-%d', date: '$date' } } },
          totalSessions: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'applicants',
          localField: '_id',
          foreignField: '_id',
          as: 'applicant',
        },
      },
      { $unwind: '$applicant' },
      {
        $project: {
          fullName: '$applicant.fullName',
          phoneNumber: '$applicant.phoneNumber',
          email: '$applicant.email',
          city: '$applicant.city',
          status: '$applicant.status',
          totalHours: { $round: ['$totalHours', 2] },
          daysWorked: { $size: '$daysWorked' },
          totalSessions: 1,
        },
      },
      { $sort: { totalHours: -1 } },
    ]);

    const monthName = new Date(reportYear, reportMonth - 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });

    if (exportFormat === 'csv') {
      const monthStr = new Date(reportYear, reportMonth - 1).toLocaleString('en-IN', { month: 'long' });

      // ─── PER MONTH REPORT ───
      const monthlyHeaders = ['Name', 'Month', 'Total Hours'];
      const monthlyRows = summary.map((s: any) => {
        return [
          `"${s.fullName}"`,
          `"${monthStr}"`,
          `"${s.totalHours}"`
        ].join(',');
      });

      // ─── PER DAY REPORT ───
      const dailyHeaders = ['Name', 'Day', 'Month', 'Working Hours'];
      const dailyRows = records.map((r: any) => {
        const d = new Date(r.date);
        const day = d.getDate();
        return [
          `"${r.fullName}"`,
          `"${day}"`,
          `"${monthStr}"`,
          `"${r.hoursWorked.toFixed(2)}"`
        ].join(',');
      });

      const csv = [
        `UTTAM Business Consultancy - Performance Report - ${monthStr} ${reportYear}`,
        '',
        '=== PER MONTH REPORT ===',
        monthlyHeaders.join(','),
        ...monthlyRows,
        '',
        '=== PER DAY REPORT ===',
        dailyHeaders.join(','),
        ...dailyRows
      ].join('\n');

      // Add BOM for Excel compatibility
      const bom = '\uFEFF';
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="report_${reportYear}_${String(reportMonth).padStart(2, '0')}.csv"`);
      return res.status(200).end(bom + csv);

    } else {
      // JSON format (for programmatic use)
      return res.status(200).json({
        success: true,
        title: `UTTAM Business Consultancy - Performance Report - ${monthName}`,
        summary,
        records,
      });
    }
  } catch (error: any) {
    console.error('[export-report] Error:', error);
    return res.status(500).json({ error: `Failed to export report: ${error?.message}` });
  }
}
