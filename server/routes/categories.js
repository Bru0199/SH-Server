import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect, isAdmin } from '../middleware/auth.js';
const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, isAdmin, createCategory);
router.put('/:id', protect, isAdmin, updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

export default router;
