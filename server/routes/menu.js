import express from 'express';
import { getMenu, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menuController.js';
import { protect, isAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
const router = express.Router();

router.get('/', getMenu);
router.get('/:id', getMenuItemById);
router.post('/', protect, isAdmin, upload.single('image'), createMenuItem);
router.put('/:id', protect, isAdmin, updateMenuItem);
router.delete('/:id', protect, isAdmin, deleteMenuItem);

export default router;
