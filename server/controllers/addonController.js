import Addon from '../models/Addon.js';
import Menu from '../models/Menu.js';

export const createAddon = async (req, res) => {
  try {
    const { name, price } = req.body;
    const addon = await Addon.create({ name, price });
    const io = req.app.get('io');
    if (io) {
      io.emit('addonsUpdated');
      io.emit('dataUpdated', { type: 'addons' });
    }
    res.status(201).json(addon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAddons = async (req, res) => {
  try {
    const addons = await Addon.find();
    res.json(addons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAddon = async (req, res) => {
  try {
    const { id } = req.params;
    const menuUsingAddon = await Menu.findOne({ addons: id });
    if (menuUsingAddon) {
      return res.status(400).json({ error: 'Addon is used in a menu item and cannot be deleted.' });
    }
    await Addon.findByIdAndDelete(id);
    const io = req.app.get('io');
    if (io) {
      io.emit('addonsUpdated');
      io.emit('dataUpdated', { type: 'addons' });
    }
    res.json({ message: 'Addon deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
