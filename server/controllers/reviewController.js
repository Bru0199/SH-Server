import Review from '../models/Review.js';

export const createReview = async (req, res) => {
  try {
    const { menu, rating, comment, order } = req.body;
    if (!order) {
      return res.status(400).json({ error: 'Order is required for review.' });
    }
    // Check if this user already reviewed this order
    const existing = await Review.findOne({ user: req.user._id, order });
    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this order.' });
    }
    const review = await Review.create({ user: req.user._id, menu, rating, comment, order });
    const io = req.app.get('io');
    if (io) {
      io.emit('reviewsUpdated');
      io.emit('dataUpdated', { type: 'reviews' });
    }
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user').populate('menu');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
