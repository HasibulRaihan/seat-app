const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:       { type: String, required: true },
  tier:       { type: String, enum: ['bronze','silver','gold'], required: true },
  moduleType: { type: String, required: true },
  awardedAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Badge', badgeSchema);