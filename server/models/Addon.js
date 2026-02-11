import mongoose from 'mongoose';

const addonSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Addon || mongoose.model('Addon', addonSchema);
