const express = require("express");
const router = express.Router();

const CodingAnswer=require("../models/CodingAnswer")

const correctAnswers = {
  1: "HyperText Markup Language",
  2: "HTML",
  3: "8",
  4: "//",
  5: "1",
  6: "Stack",
  7: "Cascading Style Sheets",
  8: "def",
  9: "string",
  10: "SELECT",
};

router.post("/submit-answers", async (req, res) => {
  try {
    const { payload } = req.body;
    const { fullname, email, answers } = payload;

    if (!fullname || !email || !answers || typeof answers !== "object") {
      return res.status(400).json({ message: "Invalid submission data" });
    }

    let score = 0;
    for (let id in correctAnswers) {
      if (answers[id] === correctAnswers[id]) {
        score++;
      }
    }

    const updatedSubmission = await CodingAnswer.findOneAndUpdate(
      { email }, // uniquely identify by email
      {
        fullname,
        email,
        score,
        status: "Submitted",
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Answers submitted successfully!", score });
  } catch (error) {
    console.error("Error saving coding answers:", error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
