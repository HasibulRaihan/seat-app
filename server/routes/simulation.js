const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Result = require('../models/Result');
const Badge = require('../models/Badge');
const User = require('../models/User');

// GET phishing simulation content
router.get('/phishing', auth, (req, res) => {
  res.json({
    id: 'phishing-001',
    type: 'phishing',
    subject: 'Urgent: Your account has been suspended',
    from: 'security@paypa1-support.com',
    body: `Dear Valued Customer,
    We have detected suspicious activity on your account.
    Your account will be permanently disabled within 24 hours
    unless you verify your identity immediately.
    Click here: http://paypa1-secure-verify.tk/login`,
    suspiciousElements: [
      { id: 1, text: 'paypa1-support.com', type: 'fake-domain' },
      { id: 2, text: 'permanently disabled within 24 hours', type: 'urgency' },
      { id: 3, text: 'paypa1-secure-verify.tk', type: 'malicious-url' }
    ]
  });
});

// SUBMIT simulation result
router.post('/submit', auth, async (req, res) => {
  try {
    const { moduleType, selectedElements, timeTaken } = req.body;

    // Simple scoring — 33 points per correct element found (3 elements = 100%)
    const score = Math.min(100, selectedElements.length * 33);
    const passed = score >= 60;

    // Save result
    const result = new Result({
      userId: req.user.id,
      moduleType,
      score,
      passed,
      timeTaken,
      feedback: passed
        ? 'Well done! You identified the suspicious elements correctly.'
        : 'Keep practising — try to identify all suspicious elements.'
    });
    await result.save();

    // Award points to user
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalPoints: score }
    });

    // Award badge if passed
    if (passed) {
      const badge = new Badge({
        userId: req.user.id,
        name: `${moduleType} Defender`,
        tier: score === 100 ? 'gold' : score >= 80 ? 'silver' : 'bronze',
        moduleType
      });
      await badge.save();
    }

    res.json({ score, passed, feedback: result.feedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET user results history
router.get('/results', auth, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id })
      .sort({ completedAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;