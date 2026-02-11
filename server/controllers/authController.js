import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { jwtSecret, otpExpiry } from '../utils/config.js';
import { sendOtpEmail } from '../utils/email.js';

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const register = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    if (!username || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'Email already registered' });
    const user = await User.create({ username, email, phone, password, role: 'user' });
    const otp = generateOTP();
    user.otp = { code: otp, expiresAt: Date.now() + otpExpiry };
    await user.save();
    try {
      await sendOtpEmail(email, otp, 'register');
    } catch (emailErr) {
      return res.status(500).json({ error: 'Failed to send OTP email.' });
    }
    res.status(201).json({ message: 'User registered. OTP sent to email.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.otp || user.otp.code !== otp || user.otp.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    user.isVerified = true;
    user.otp = {};
    await user.save();
    res.json({ message: 'OTP verified. You can now log in.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) return res.status(400).json({ error: 'User not found or not verified' });
    if (user.status !== 'active') return res.status(403).json({ error: 'User not active' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  res.json({ message: 'Logged out' });
};

export const me = async (req, res) => {
  res.json(req.user);
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    const otp = generateOTP();
    user.otp = { code: otp, expiresAt: Date.now() + otpExpiry };
    await user.save();
    try {
      await sendOtpEmail(email, otp, 'reset');
    } catch (emailErr) {
      return res.status(500).json({ error: 'Failed to send OTP email.' });
    }
    res.json({ message: 'OTP sent to email.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.otp || user.otp.code !== otp || user.otp.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    user.password = newPassword;
    user.otp = {};
    await user.save();
    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
