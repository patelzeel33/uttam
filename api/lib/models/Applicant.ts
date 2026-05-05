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
  referral_code: string;       // unique auto-generated code like DB1023
  referred_by?: mongoose.Types.ObjectId; // referrer user id (nullable)
  referralCodeInput?: string;  // the raw referral code entered during signup (for records)
  ridersReferred: number;
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
    referral_code: { type: String, unique: true, sparse: true },
    referred_by: { type: Schema.Types.ObjectId, ref: 'Applicant', default: null },
    referralCodeInput: { type: String, trim: true },
    ridersReferred: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/**
 * Pre-save hook: auto-generate a short readable referral code if not set.
 * Format: DB + 4-digit number (e.g., DB1023, DB5847)
 */
ApplicantSchema.pre('save', async function () {
  if (!this.referral_code) {
    let code = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 20) {
      // Generate DB + random 4-digit number (1000-9999)
      const num = Math.floor(1000 + Math.random() * 9000);
      code = `DB${num}`;

      // Check uniqueness
      const existing = await mongoose.models.Applicant.findOne({ referral_code: code });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    // Fallback: append timestamp-based suffix if all attempts failed
    if (!isUnique) {
      code = `DB${Date.now().toString().slice(-6)}`;
    }

    this.referral_code = code;
  }
});

// Avoid OverwriteModelError on hot reload in serverless environment
export const Applicant: Model<IApplicant> =
  (mongoose.models.Applicant as Model<IApplicant>) ||
  mongoose.model<IApplicant>('Applicant', ApplicantSchema);
