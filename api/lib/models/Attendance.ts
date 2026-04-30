import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttendance extends Document {
  applicantId: mongoose.Types.ObjectId;
  date: Date;          // The calendar date (time portion stripped)
  loginTime: Date;     // Exact login timestamp
  logoutTime?: Date;   // Exact logout timestamp (null if still clocked in)
  hoursWorked: number; // Calculated hours for this session
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: 'Applicant',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    loginTime: {
      type: Date,
      required: true,
    },
    logoutTime: {
      type: Date,
      default: null,
    },
    hoursWorked: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient queries
AttendanceSchema.index({ applicantId: 1, date: 1 });
AttendanceSchema.index({ date: 1, applicantId: 1 });

// Avoid OverwriteModelError on hot reload
export const Attendance: Model<IAttendance> =
  (mongoose.models.Attendance as Model<IAttendance>) ||
  mongoose.model<IAttendance>('Attendance', AttendanceSchema);
