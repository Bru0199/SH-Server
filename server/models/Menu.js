import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    addons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Addon' }],
    available: { type: Boolean, default: true },
    type: { type: String, enum: ['veg', 'non-veg'], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Menu || mongoose.model('Menu', menuSchema);
