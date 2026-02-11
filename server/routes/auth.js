import express from 'express';
import { register, verifyOtp, login, logout, me, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { canResetPassword } from '../middleware/canResetPassword.js';
const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/me', protect, me);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', canResetPassword, resetPassword);

export default router;
