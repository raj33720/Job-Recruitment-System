const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
  role: { type: String, default: 'candidate', enum: ['candidate', 'hr', 'admin'] },
  resetToken: String,
  tokenExpiry: Date,
});

module.exports = mongoose.model('User', UserSchema);
