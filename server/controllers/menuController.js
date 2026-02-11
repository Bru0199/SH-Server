import Menu from '../models/Menu.js';
import Category from '../models/Category.js';
import Addon from '../models/Addon.js';

export const getMenu = async (req, res) => {
  try {
    const menu = await Menu.find().populate('category').populate('addons');
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id).populate('category').populate('addons');
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    let { name, description, price, image, category, addons } = req.body;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
      // Only check extension for uploaded files
      const allowed = ['.png', '.jpg', '.jpeg'];
      const ext = image.split('.').pop().toLowerCase();
      if (!allowed.includes(`.${ext}`) && image !== "") {
        return res.status(400).json({ error: 'Only .png, .jpg and .jpeg formats allowed for uploaded image.' });
      }
    }
    // If not file upload, allow any direct URL (no extension check)
    if (!image) {
      image = null;
    }
    // Ensure addons is always an array of ObjectIds or empty array
    if (!addons) {
      addons = [];
    } else if (typeof addons === 'string') {
      try {
        const parsed = JSON.parse(addons);
        if (Array.isArray(parsed)) {
          addons = parsed;
        } else {
          addons = [];
        }
      } catch {
        addons = [];
      }
    }
    const { type } = req.body;
    if (!type || !['veg', 'non-veg'].includes(type)) {
      return res.status(400).json({ error: "Menu item 'type' (veg/non-veg) is required." });
    }
    const menuItem = await Menu.create({ name, description, price, image, category, addons, type });
    const io = req.app.get('io');
    if (io) {
      io.emit('menuUpdated');
      io.emit('dataUpdated', { type: 'menu' });
    }
    res.status(201).json(menuItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const update = { ...req.body };
    if (req.file) {
      update.image = `/uploads/${req.file.filename}`;
      // Only check extension for uploaded files
      const allowed = ['.png', '.jpg', '.jpeg'];
      const ext = update.image.split('.').pop().toLowerCase();
      if (!allowed.includes(`.${ext}`) && update.image !== "") {
        return res.status(400).json({ error: 'Only .png, .jpg and .jpeg formats allowed for uploaded image.' });
      }
    } else if (req.body.image && typeof req.body.image === 'string') {
      // Accept any direct URL (no extension check)
      update.image = req.body.image;
    }
    const menuItem = await Menu.findByIdAndUpdate(id, update, { new: true });
    const io = req.app.get('io');
    if (io) {
      io.emit('menuUpdated');
      io.emit('dataUpdated', { type: 'menu' });
    }
    res.json(menuItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    await Menu.findByIdAndDelete(id);
    const io = req.app.get('io');
    if (io) {
      io.emit('menuUpdated');
      io.emit('dataUpdated', { type: 'menu' });
    }
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
