import User from '../models/User.js';

const canResetPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.otp || !user.otp.code || !user.otp.expiresAt) {
    return res.status(403).json({ error: 'No valid OTP session' });
  }
  if (user.otp.expiresAt < Date.now()) {
    return res.status(403).json({ error: 'OTP expired' });
  }
  next();
};

export { canResetPassword };
