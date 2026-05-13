const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moduleType: { type: String, enum: ['phishing','pretexting','chatbot','quiz'], required: true },
  score:      { type: Number, required: true },
  passed:     { type: Boolean, required: true },
  timeTaken:  { type: Number },
  feedback:   { type: String },
  completedAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);