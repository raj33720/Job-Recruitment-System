const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  email: String,
  score: Number,
  status: String,
  submittedAt: Date,
  type: String, // "quantitative-aptitude" or "coding-test"
});

module.exports = mongoose.model('Score', scoreSchema);
