import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const otpSchema = new mongoose.Schema(
  {
    code: { type: String },
    expiresAt: { type: Number },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: {
      type: String,
      enum: ['active', 'inactive', 'banned'],
      default: 'active',
    },
    isVerified: { type: Boolean, default: false },
    otp: { type: otpSchema, default: {} },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);
