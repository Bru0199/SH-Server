import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    req.user.name = name || req.user.name;
    req.user.phone = phone || req.user.phone;
    await req.user.save();
    const io = req.app.get('io');
    if (io) {
      io.emit('usersUpdated');
      io.emit('dataUpdated', { type: 'users' });
    }
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
