const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, required: true, unique: true },
  contact: String,
  city: String,
  address: String,
  experience: String,
  role: String,
  track: String,
  resume: String,
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Candidate", candidateSchema);
