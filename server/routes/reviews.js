import express from 'express';
import { createReview, getReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

router.post('/', protect, createReview);
router.get('/', getReviews);

export default router;
