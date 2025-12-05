const mongoose = require('mongoose');

const HRSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, unique: true, required: true },
  phone: String,
  password: { type: String, required: true },
});

module.exports = mongoose.model('HR', HRSchema);
