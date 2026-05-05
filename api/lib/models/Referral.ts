import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReferral extends Document {
  referrer_id: mongoose.Types.ObjectId;
  referred_user_id: mongoose.Types.ObjectId;
  created_at: Date;
}

const ReferralSchema = new Schema<IReferral>(
  {
    referrer_id: { type: Schema.Types.ObjectId, ref: 'Applicant', required: true },
    referred_user_id: { type: Schema.Types.ObjectId, ref: 'Applicant', required: true, unique: true },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Each referred user can only appear once (they can only be referred by one person)
ReferralSchema.index({ referred_user_id: 1 }, { unique: true });
// Index for fast lookup of who a referrer has referred
ReferralSchema.index({ referrer_id: 1 });

// Avoid OverwriteModelError on hot reload in serverless environment
export const Referral: Model<IReferral> =
  (mongoose.models.Referral as Model<IReferral>) ||
  mongoose.model<IReferral>('Referral', ReferralSchema);
