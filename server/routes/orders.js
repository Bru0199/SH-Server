import express from 'express';
import { placeOrder, getOrders, getOrderById, cancelOrder, updateOrderStatus } from '../controllers/orderController.js';
import { protect, isAdmin } from '../middleware/auth.js';
const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);

export default router;
