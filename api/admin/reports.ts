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

    // Aggregate performance by applicant (fetch all active applicants + anyone with attendance in this period)
    const matchApplicant: any = {
      $or: [ { status: 'active' } ]
    };
    if (applicantId && mongoose.Types.ObjectId.isValid(applicantId)) {
      matchApplicant._id = new mongoose.Types.ObjectId(applicantId);
    }

    const performance = await Applicant.aggregate([
      { $match: matchApplicant },
      {
        $lookup: {
          from: 'attendances',
          let: { appId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$applicantId', '$$appId'] },
                date: { $gte: startDate, $lte: endDate }
              }
            }
          ],
          as: 'attendanceRecords'
        }
      },
      {
        $project: {
          applicantId: '$_id',
          fullName: 1,
          phoneNumber: 1,
          email: 1,
          city: 1,
          status: 1,
          attendanceRecords: 1,
          // Extract specific data to calculate days worked etc.
          totalHours: { $round: [{ $sum: '$attendanceRecords.hoursWorked' }, 2] },
          totalSessions: { $size: '$attendanceRecords' },
          daysWorked: {
            $size: {
              $setUnion: {
                $map: {
                  input: '$attendanceRecords',
                  as: 'record',
                  in: { $dateToString: { format: '%Y-%m-%d', date: '$$record.date' } }
                }
              }
            }
          },
          avgHoursPerDay: {
            $round: [
              { $cond: [ { $gt: [{ $size: '$attendanceRecords' }, 0] }, { $avg: '$attendanceRecords.hoursWorked' }, 0 ] },
              2
            ]
          },
          maxHoursInDay: {
            $round: [
              { $cond: [ { $gt: [{ $size: '$attendanceRecords' }, 0] }, { $max: '$attendanceRecords.hoursWorked' }, 0 ] },
              2
            ]
          },
          minHoursInDay: {
            $round: [
              { $cond: [ { $gt: [{ $size: '$attendanceRecords' }, 0] }, { $min: '$attendanceRecords.hoursWorked' }, 0 ] },
              2
            ]
          },
          firstLogin: { $min: '$attendanceRecords.loginTime' },
          lastLogout: { $max: '$attendanceRecords.logoutTime' }
        }
      },
      {
        $addFields: {
          attendancePercentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$daysWorked', Math.max(totalWorkingDays, 1)] },
                  100
                ]
              },
              1
            ]
          }
        }
      },
      { $sort: { totalHours: -1 } }
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
