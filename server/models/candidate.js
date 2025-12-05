const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, required: true, unique: true },
  contact: String,
  role: String,
  resume: String, // Optional: store filename or link 
  status: { type: String, default: 'Pending' },
 

});

module.exports = mongoose.model('Candidate', candidateSchema);
