import Category from '../models/Category.js';
import Menu from '../models/Menu.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Category name is required.' });
    }
    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ error: 'Category already exists.' });
    }
    const category = await Category.create({ name, description });
    const io = req.app.get('io');
    if (io) {
      io.emit('categoriesUpdated');
      io.emit('dataUpdated', { type: 'categories' });
    }
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    const io = req.app.get('io');
    if (io) {
      io.emit('categoriesUpdated');
      io.emit('dataUpdated', { type: 'categories' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const menuUsingCategory = await Menu.findOne({ category: id });
    if (menuUsingCategory) {
      return res.status(400).json({ error: 'Category is used in a menu item and cannot be deleted.' });
    }
    await Category.findByIdAndDelete(id);
    const io = req.app.get('io');
    if (io) {
      io.emit('categoriesUpdated');
      io.emit('dataUpdated', { type: 'categories' });
    }
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
