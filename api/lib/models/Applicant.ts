import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IApplicant extends Document {
  fullName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  city?: string;
  experience?: string;
  hasLicense?: string;
  status: 'pending' | 'interview' | 'active' | 'rejected';
  hoursLogged: number;
  submittedAt: Date;
  referralCode?: string;
  ridersReferred?: number;
}

const ApplicantSchema = new Schema<IApplicant>(
  {
    fullName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true, unique: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    experience: { type: String, default: 'none' },
    hasLicense: { type: String },
    status: {
      type: String,
      enum: ['pending', 'interview', 'active', 'rejected'],
      default: 'pending',
    },
    hoursLogged: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
    referralCode: { type: String, trim: true },
    ridersReferred: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Avoid OverwriteModelError on hot reload in serverless environment
export const Applicant: Model<IApplicant> =
  (mongoose.models.Applicant as Model<IApplicant>) ||
  mongoose.model<IApplicant>('Applicant', ApplicantSchema);
