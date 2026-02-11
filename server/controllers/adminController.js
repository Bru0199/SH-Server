export const createUser = async (req, res) => {
  try {
    const { username, email, phone, password, role, status } = req.body;
    if (!username || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'Email already registered' });
    const user = await User.create({
      username,
      email,
      phone,
      password,
      role: role || 'user',
      status: status || 'active',
      isVerified: true
    });
    const io = req.app.get('io');
    if (io) {
      io.emit('usersUpdated');
      io.emit('dataUpdated', { type: 'users' });
    }
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
import User from '../models/User.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import Addon from '../models/Addon.js';
import Menu from '../models/Menu.js';
import Coupon from '../models/Coupon.js';
import Review from '../models/Review.js';

export const getStats = async (req, res) => {
  const users = await User.countDocuments();
  const orders = await Order.countDocuments();
  const revenue = await Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]);
  res.json({ users, orders, revenue: revenue[0]?.total || 0 });
};

export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { status, role } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (status) user.status = status;
  if (role) user.role = role;
  await user.save();
  const io = req.app.get('io');
  if (io) {
    io.emit('usersUpdated');
    io.emit('dataUpdated', { type: 'users' });
  }
  res.json(user);
};

export const getOrders = async (req, res) => {
  const orders = await Order.find().populate('user').populate('items.menu');
  res.json(orders);
};

export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.create({ name, description });
  res.status(201).json(category);
};

export const createAddon = async (req, res) => {
  const { name, price } = req.body;
  const addon = await Addon.create({ name, price });
  res.status(201).json(addon);
};

export const createMenuItem = async (req, res) => {
  let { name, description, price, image, category, addons } = req.body;
  if (req.file) {
    image = `/uploads/${req.file.filename}`;
  }
  if (image) {
    const allowed = ['.png', '.jpg', '.jpeg'];
    const ext = image.split('.').pop().toLowerCase();
    if (!allowed.includes(`.${ext}`)) {
      return res.status(400).json({ error: 'Only .png, .jpg and .jpeg formats allowed for image.' });
    }
  }
  const menuItem = await Menu.create({ name, description, price, image, category, addons });
  res.status(201).json(menuItem);
};

export const toggleAvailability = async (req, res) => {
  const { type, id } = req.body;
  let doc;
  if (type === 'menu') {
    doc = await Menu.findById(id);
    doc.available = !doc.available;
    await doc.save();
  } else if (type === 'addon') {
    doc = await Addon.findById(id);
    doc.available = !doc.available;
    await doc.save();
  }
  res.json(doc);
};

export const createCoupon = async (req, res) => {
  const { code, discount, expiresAt } = req.body;
  const coupon = await Coupon.create({ code, discount, expiresAt });
  res.status(201).json(coupon);
};

export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
};

export const toggleReviewApproval = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  review.approved = !review.approved;
  await review.save();
  res.json(review);
};
