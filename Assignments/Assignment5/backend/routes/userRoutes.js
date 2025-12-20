const express = require('express');
const User = require('../models/User');

const router = express.Router();

// CREATE user
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    const saved = await user.save();
    console.log('Created user:', saved);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    console.log('All users:', users);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    console.log('Get user:', user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user
router.put('/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    console.log('Updated user:', updated);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    console.log('Deleted user:', deleted);
    res.json({ message: 'User deleted', deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
