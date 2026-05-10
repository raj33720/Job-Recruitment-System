const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: String,
  output: String,
});

const codingQuestionSchema = new mongoose.Schema({
  role: String, // e.g., "Frontend Developer"
  title: String,
  description: String,
  difficulty: String,
  starterCode: String,
  testCases: [testCaseSchema],
});

module.exports = mongoose.model("CodingQuestion", codingQuestionSchema);