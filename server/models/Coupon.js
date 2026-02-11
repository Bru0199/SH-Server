import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    expiresAt: { type: Date },
    minOrderAmount: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
