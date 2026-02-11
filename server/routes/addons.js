import express from 'express';
import { createAddon, getAddons, deleteAddon } from '../controllers/addonController.js';
import { protect, isAdmin } from '../middleware/auth.js';
const router = express.Router();

router.post('/', protect, isAdmin, createAddon);
router.get('/', getAddons);
router.delete('/:id', protect, isAdmin, deleteAddon);

export default router;
