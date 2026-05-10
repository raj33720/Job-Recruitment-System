const express = require("express")
const router = express.Router();
const QuantAnswer = require("../models/Gtest");


// Correct answers
const correctAnswers = {
  1: "7.2 days",
  2: "2/3",
  3: "10 years",
  4: "10 years",
  5: "4 km",
  6: "South",
  7: "2:21.8",
  8: "6:30 pm",
  9: "₹600",
  10: "₹1080",
};

// POST route
router.post("/submit-quant-answers", async (req, res) => {
  try {
    const { email, answers } = req.body;

    if (!email || !answers || typeof answers !== "object") {
      return res.status(400).json({ message: "Invalid submission data" });
    }

    // Score calculation
    let score = 0;
    for (let id in correctAnswers) {
      if (answers[id] === correctAnswers[id]) {
        score++;
      }
    }

    // Save or update
    const updatedSubmission = await QuantAnswer.findOneAndUpdate(
      { email },
      {
        email,
        answers,
        score,
        status: "Submitted",
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "Answers submitted successfully!",
      score: updatedSubmission.score,
      status: updatedSubmission.status,
    });
  } catch (error) {
    console.error("Error saving quant answers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET route


module.exports = router;