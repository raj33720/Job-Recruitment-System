const express = require("express");
const CodingQuestion = require("../models/CodingQuestion");

const router = express.Router();

const defaultCodingQuestions = [
  {
    _id: "default-reverse-string",
    role: "Frontend Developer",
    title: "Reverse a String",
    description:
      "Write a function that receives a string and returns the string in reverse order.",
    difficulty: "Easy",
    starterCode: `function reverseString(str) {
  // write code here
}`,
    testCases: [
      { input: "hello", output: "olleh" },
      { input: "coding", output: "gnidoc" },
    ],
  },
  {
    _id: "default-factorial",
    role: "Backend Developer",
    title: "Factorial",
    description:
      "Write a function that receives a number and returns its factorial.",
    difficulty: "Easy",
    starterCode: `function factorial(n) {
  // write code here
}`,
    testCases: [
      { input: "5", output: "120" },
      { input: "3", output: "6" },
    ],
  },
];

// GET coding questions by role
router.get("/", async (req, res) => {
  try {
    const role = String(req.query.role || "").trim();

    let questions = [];

    if (role) {
      questions = await CodingQuestion.find({ role });
    }

    if (!questions.length) {
      questions = await CodingQuestion.find();
    }

    res.json(questions.length ? questions : defaultCodingQuestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching coding questions" });
  }
});

module.exports = router;
