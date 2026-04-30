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

    const { month, year, applicantId } = req.query as any;

    // Default to current month/year
    const reportYear = parseInt(year) || new Date().getFullYear();
    const reportMonth = parseInt(month) || new Date().getMonth() + 1; // 1-indexed

    const startDate = new Date(reportYear, reportMonth - 1, 1);
    const endDate = new Date(reportYear, reportMonth, 0, 23, 59, 59); // Last day of month

    // Calculate total working days in the month (Mon-Sat)
    const totalWorkingDays = countWorkingDays(startDate, endDate);

    // Build match filter
    const matchFilter: any = {
      date: { $gte: startDate, $lte: endDate },
    };
    if (applicantId && mongoose.Types.ObjectId.isValid(applicantId)) {
      matchFilter.applicantId = new mongoose.Types.ObjectId(applicantId);
    }

    // Aggregate performance by applicant
    const performance = await Attendance.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$applicantId',
          totalHours: { $sum: '$hoursWorked' },
          daysWorked: { $addToSet: { $dateToString: { format: '%Y-%m-%d', date: '$date' } } },
          totalSessions: { $sum: 1 },
          avgHoursPerDay: { $avg: '$hoursWorked' },
          maxHoursInDay: { $max: '$hoursWorked' },
          minHoursInDay: { $min: '$hoursWorked' },
          firstLogin: { $min: '$loginTime' },
          lastLogout: { $max: '$logoutTime' },
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
          applicantId: '$_id',
          fullName: '$applicant.fullName',
          phoneNumber: '$applicant.phoneNumber',
          email: '$applicant.email',
          city: '$applicant.city',
          status: '$applicant.status',
          totalHours: { $round: ['$totalHours', 2] },
          daysWorked: { $size: '$daysWorked' },
          totalSessions: 1,
          avgHoursPerDay: { $round: ['$avgHoursPerDay', 2] },
          maxHoursInDay: { $round: ['$maxHoursInDay', 2] },
          minHoursInDay: { $round: ['$minHoursInDay', 2] },
          firstLogin: 1,
          lastLogout: 1,
          attendancePercentage: {
            $round: [
              { $multiply: [{ $divide: [{ $size: '$daysWorked' }, Math.max(totalWorkingDays, 1)] }, 100] },
              1,
            ],
          },
        },
      },
      { $sort: { totalHours: -1 } },
    ]);

    // Summary stats
    const totalActive = await Applicant.countDocuments({ status: 'active' });
    const totalAttendees = performance.length;
    const overallHours = performance.reduce((sum: number, p: any) => sum + p.totalHours, 0);
    const avgAttendance = totalAttendees > 0
      ? Math.round(performance.reduce((sum: number, p: any) => sum + p.attendancePercentage, 0) / totalAttendees * 10) / 10
      : 0;

    // Daily breakdown for charts
    const dailyBreakdown = await Attendance.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalHours: { $sum: '$hoursWorked' },
          uniqueWorkers: { $addToSet: '$applicantId' },
          sessions: { $sum: 1 },
        },
      },
      {
        $project: {
          date: '$_id',
          totalHours: { $round: ['$totalHours', 2] },
          workerCount: { $size: '$uniqueWorkers' },
          sessions: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      report: {
        month: reportMonth,
        year: reportYear,
        totalWorkingDays,
        summary: {
          totalActiveEmployees: totalActive,
          employeesWithAttendance: totalAttendees,
          totalHoursWorked: Math.round(overallHours * 100) / 100,
          avgAttendancePercentage: avgAttendance,
        },
        performance,
        dailyBreakdown,
      },
    });
  } catch (error: any) {
    console.error('[reports] Error:', error);
    return res.status(500).json({ error: `Failed to generate report: ${error?.message}` });
  }
}

/**
 * Count working days (Monday through Saturday) in a date range.
 */
function countWorkingDays(start: Date, end: Date): number {
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0) count++; // 0 = Sunday
    current.setDate(current.getDate() + 1);
  }
  return count;
}
