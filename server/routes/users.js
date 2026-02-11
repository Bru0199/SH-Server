import express from 'express';
import { getUsers, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

router.get('/', protect, getUsers);
router.put('/profile', protect, updateProfile);

export default router;
