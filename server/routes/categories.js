import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect, isAdmin } from '../middleware/auth.js';
const router = express.Router();

router.get('/', getCategories);
import upload from '../middleware/upload.js';
router.post('/', protect, isAdmin, upload.single('image'), createCategory);
router.put('/:id', protect, isAdmin, upload.single('image'), updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

export default router;
