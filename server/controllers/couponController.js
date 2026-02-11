import Coupon from '../models/Coupon.js';

export const createCoupon = async (req, res) => {
  try {
    const { code, discount, expiresAt } = req.body;
    const coupon = await Coupon.create({ code, discount, expiresAt });
    const io = req.app.get('io');
    if (io) {
      io.emit('couponsUpdated');
      io.emit('dataUpdated', { type: 'coupons' });
    }
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code });
    if (!coupon || coupon.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired coupon' });
    }
    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({ error: 'Order amount too low for coupon' });
    }
    res.json({ valid: true, discount: coupon.discount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
