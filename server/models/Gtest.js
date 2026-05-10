const mongoose = require("mongoose");

const quantAnswerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  type: { type: String, default: "quantitative-aptitude" },
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    default: "Not Submitted",
  },
});

module.exports = mongoose.model("QuantAnswer", quantAnswerSchema);