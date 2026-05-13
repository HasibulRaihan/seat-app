const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Result = require('../models/Result');
const Badge = require('../models/Badge');

// Middleware — admin only
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// GET all users
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET dashboard stats
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalResults = await Result.countDocuments();
    const passedResults = await Result.countDocuments({ passed: true });
    const completionRate = totalResults > 0
      ? Math.round((passedResults / totalResults) * 100)
      : 0;
    const highRiskUsers = await User.countDocuments({ riskScore: 'high' });

    res.json({
      totalUsers,
      activeUsers,
      completionRate,
      highRiskUsers,
      totalResults
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE user role
router.put('/users/:id/role', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;