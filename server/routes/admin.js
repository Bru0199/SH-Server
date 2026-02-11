
import express from 'express';
import { getStats, getUsers, updateUser, getOrders, createCategory, createAddon, createMenuItem, toggleAvailability, createCoupon, getCoupons, toggleReviewApproval, createUser } from '../controllers/adminController.js';
import upload from '../middleware/upload.js';
import { protect, isAdmin } from '../middleware/auth.js';
const router = express.Router();
router.post('/users', protect, isAdmin, createUser);

router.get('/stats', protect, isAdmin, getStats);
router.get('/users', protect, isAdmin, getUsers);
router.put('/users/:userId', protect, isAdmin, updateUser);
router.get('/orders', protect, isAdmin, getOrders);
router.post('/category', protect, isAdmin, createCategory);
router.post('/addon', protect, isAdmin, createAddon);
router.post('/menu-item', protect, isAdmin, upload.single('image'), createMenuItem);
router.patch('/toggle-availability', protect, isAdmin, toggleAvailability);
router.post('/coupons', protect, isAdmin, createCoupon);
router.get('/coupons', protect, isAdmin, getCoupons);
router.patch('/reviews/:id/toggle', protect, isAdmin, toggleReviewApproval);

export default router;
