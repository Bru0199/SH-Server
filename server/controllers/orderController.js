import Order from '../models/Order.js';
import Menu from '../models/Menu.js';
import Coupon from '../models/Coupon.js';
import { calculateOrderTotals } from '../utils/orderTotals.js';

export const placeOrder = async (req, res) => {
  try {
    const { items, deliveryDetails, coupon, paymentMethod } = req.body;
    if (req.user.status === 'banned') {
      return res.status(403).json({ error: 'Banned users cannot place orders.' });
    }
    const totals = await calculateOrderTotals(items, coupon);
    if (!['COD', 'Online'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }
    let orderID = req.body.orderID || req.body.order_id;
    if (!orderID && paymentMethod === 'COD') {
      // Generate unique orderID for COD
      orderID = `COD-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    }
    let orderData = {
      user: req.user._id,
      items,
      deliveryDetails,
      status: paymentMethod === 'COD' ? 'Order Received' : 'Pending',
      coupon: coupon || undefined,
      couponCode: totals.couponCode,
      subTotal: totals.subTotal,
      discountAmount: totals.discountAmount,
      total: totals.total,
      paymentMethod,
      paymentStatus: 'Pending',
      orderID,
    };
    const order = await Order.create(orderData);
    if (paymentMethod === 'COD') {
      const io = req.app.get('io');
      if (io) {
        io.emit('orderStatus', { orderId: order._id, status: order.status });
      }
    }
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.menu').populate('items.addons').populate('coupon');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('items.menu').populate('items.addons').populate('coupon');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status === 'Cancelled') return res.status(400).json({ error: 'Order already cancelled' });
    order.status = 'Cancelled';
    await order.save();
    const io = req.app.get('io');
    if (io) {
      io.emit('orderStatus', { orderId: order._id, status: order.status });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    const update = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (paymentStatus === 'Paid' && order.paymentMethod === 'Online') {
      update.status = 'Order Received';
    }
    const updatedOrder = await Order.findByIdAndUpdate(id, update, { new: true });
    const io = req.app.get('io');
    if (io) {
      io.emit('orderStatus', { orderId: updatedOrder._id, status: updatedOrder.status });
    }
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
