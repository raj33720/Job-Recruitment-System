// models/Progress.js
const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hrApproval: {
    type: String,
    default: "Pending",
  },
  interview: {
    type: String,
    default: "Not Scheduled",
  },
  interviewDate: {
    type: String,
  },
});

module.exports = mongoose.model("Progress", progressSchema);
