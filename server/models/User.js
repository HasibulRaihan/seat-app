const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['admin','trainer','learner'], default: 'learner' },
  totalPoints: { type: Number, default: 0 },
  riskScore: { type: String, enum: ['low','medium','high'], default: 'high' },
  isActive:  { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);