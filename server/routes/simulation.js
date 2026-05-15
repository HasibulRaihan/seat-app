const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Result = require('../models/Result');
const Badge = require('../models/Badge');
const User = require('../models/User');

// ── PHISHING QUESTIONS BANK ──────────────────────────────────────
const phishingQuestions = [
  {
    id: 1,
    subject: "Urgent: Your PayPal account has been suspended",
    from: "security@paypa1-support.com",
    preview: "We detected suspicious activity...",
    body: "Dear Valued Customer, We have detected suspicious activity on your account. Your account will be permanently disabled within 24 hours unless you verify your identity immediately. Click here: http://paypa1-secure-verify.tk/login?ref=48291",
    suspiciousElements: [
      { id: 1, text: "paypa1-support.com (fake domain)", explanation: "PayPal's real domain is paypal.com — paypa1 uses number 1 instead of letter l" },
      { id: 2, text: "permanently disabled within 24 hours (urgency)", explanation: "Creating artificial urgency is a classic phishing tactic to stop you thinking clearly" },
      { id: 3, text: "paypa1-secure-verify.tk (malicious URL)", explanation: ".tk domains are free and commonly used by attackers. The real PayPal URL is paypal.com" }
    ]
  },
  {
    id: 2,
    subject: "Your Netflix password needs to be updated immediately",
    from: "no-reply@netflix-accounts-secure.com",
    preview: "Action required on your account...",
    body: "Hello Netflix Member, Your payment method has expired. Your account will be cancelled in 48 hours. Please update your billing information immediately to continue your subscription. Click here to update: http://netflix-billing-update.xyz/account",
    suspiciousElements: [
      { id: 1, text: "netflix-accounts-secure.com (fake domain)", explanation: "Netflix only sends emails from netflix.com — any other domain is fake" },
      { id: 2, text: "account will be cancelled in 48 hours (urgency)", explanation: "Urgency language is designed to make you act without thinking" },
      { id: 3, text: "netflix-billing-update.xyz (malicious URL)", explanation: "Netflix never uses .xyz domains. Always check the URL before clicking" }
    ]
  },
  {
    id: 3,
    subject: "Your Microsoft account: Unusual sign-in activity",
    from: "microsoft-security@hotmail-support.net",
    preview: "We noticed something unusual...",
    body: "Dear User, We noticed a sign-in to your Microsoft account from an unrecognised device in Russia. If this was not you, your account may be compromised. Verify your identity now to secure your account: http://microsoft-verify-login.info/secure",
    suspiciousElements: [
      { id: 1, text: "hotmail-support.net (fake domain)", explanation: "Microsoft emails come from microsoft.com or microsoftonline.com — never hotmail-support.net" },
      { id: 2, text: "from an unrecognised device in Russia (fear tactic)", explanation: "Mentioning foreign countries creates panic and rushes victims into clicking malicious links" },
      { id: 3, text: "microsoft-verify-login.info (malicious URL)", explanation: "Microsoft never uses .info domains for security alerts. Real URL would be microsoft.com" }
    ]
  }
];

// ── GET simulation intro ─────────────────────────────────────────
router.get('/phishing/intro', auth, (req, res) => {
  res.json({
    title: "Email Phishing Simulation",
    description: "In this simulation you will be shown realistic phishing emails. Your task is to identify all the suspicious elements in each email.",
    objectives: [
      "Identify fake sender email addresses",
      "Spot urgency language designed to panic you",
      "Recognise malicious URLs and links",
      "Understand common phishing tactics"
    ],
    totalQuestions: phishingQuestions.length,
    estimatedTime: "15 minutes",
    difficulty: "Beginner"
  });
});

// ── GET one phishing question ─────────────────────────────────────
router.get('/phishing/:questionId', auth, (req, res) => {
  const q = phishingQuestions.find(q => q.id === parseInt(req.params.questionId));
  if (!q) return res.status(404).json({ message: 'Question not found' });
  res.json({
    id: q.id,
    subject: q.subject,
    from: q.from,
    preview: q.preview,
    body: q.body,
    totalElements: q.suspiciousElements.length,
    suspiciousElements: q.suspiciousElements.map(e => ({
      id: e.id,
      text: e.text
    }))
  });
});

// ── SUBMIT one question answer ────────────────────────────────────
router.post('/phishing/:questionId/submit', auth, async (req, res) => {
  try {
    const { selectedIds } = req.body;
    const q = phishingQuestions.find(q => q.id === parseInt(req.params.questionId));
    if (!q) return res.status(404).json({ message: 'Question not found' });

    const correctIds = q.suspiciousElements.map(e => e.id);
    const correctSelected = selectedIds.filter(id => correctIds.includes(id));
    const score = Math.round((correctSelected.length / correctIds.length) * 100);

    const feedback = q.suspiciousElements.map(e => ({
      id: e.id,
      text: e.text,
      explanation: e.explanation,
      wasSelected: selectedIds.includes(e.id),
      isCorrect: true
    }));

    res.json({ score, feedback, correctCount: correctSelected.length, totalCount: correctIds.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── SUBMIT full simulation ────────────────────────────────────────
router.post('/phishing/complete', auth, async (req, res) => {
  try {
    const { totalScore, timeTaken } = req.body;
    const passed = totalScore >= 60;

    const result = new Result({
      userId: req.user.id,
      moduleType: 'phishing',
      score: totalScore,
      passed,
      timeTaken,
      feedback: passed
        ? 'Well done! You identified the phishing elements correctly.'
        : 'Keep practising — try to identify all suspicious elements.'
    });
    await result.save();

    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalPoints: Math.round(totalScore / 10) * 10 },
      riskScore: totalScore >= 80 ? 'low' : totalScore >= 60 ? 'medium' : 'high'
    });

    if (passed) {
      const existingBadge = await Badge.findOne({
        userId: req.user.id, moduleType: 'phishing'
      });
      if (!existingBadge) {
        await new Badge({
          userId: req.user.id,
          name: 'Phishing Defender',
          tier: totalScore === 100 ? 'gold' : totalScore >= 80 ? 'silver' : 'bronze',
          moduleType: 'phishing'
        }).save();
      }
    }

    res.json({
      score: totalScore,
      passed,
      feedback: result.feedback,
      pointsEarned: Math.round(totalScore / 10) * 10
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── GET user results ──────────────────────────────────────────────
router.get('/results', auth, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id }).sort({ completedAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ── GET leaderboard ───────────────────────────────────────────────
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('firstName lastName totalPoints riskScore')
      .sort({ totalPoints: -1 })
      .limit(20);

    const currentUser = await User.findById(req.user.id).select('totalPoints');
    const rank = await User.countDocuments({ totalPoints: { $gt: currentUser.totalPoints } }) + 1;

    res.json({ leaderboard: users, myRank: rank });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;