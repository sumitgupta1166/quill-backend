import mongoose from 'mongoose';

const TenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    plan: { type: String, enum: ['free', 'pro'], default: 'free' }
  },
  { timestamps: true }
);

export default mongoose.model('Tenant', TenantSchema);