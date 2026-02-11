import jwt from 'jsonwebtoken';
import { jwtSecret } from '../utils/config.js';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findById(decoded.userId);
    if (!user || user.status !== 'active') {
      return res.status(401).json({ error: 'User not active or not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export { protect, isAdmin };
