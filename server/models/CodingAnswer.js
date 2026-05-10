const mongoose = require("mongoose");

const codingAnswerSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  answers: {
    type: Object,
    default: {},
  },
  score: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  role: {
    type: String,
    default: "",
  },
  track: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "coding",
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Not Submitted",
  },
});

module.exports = mongoose.model("CodingAnswer", codingAnswerSchema);
