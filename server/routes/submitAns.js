const express = require("express");
const router = express.Router();

const CodingAnswer=require("../models/CodingAnswer")

router.post("/submit-answers", async (req, res) => {
  try {
    const payload = req.body.payload || req.body;
    const { fullname, email, answers, score, total, role, track, type } = payload;

    if (!fullname || !email || !answers || typeof answers !== "object" || typeof score !== "number") {
      return res.status(400).json({ message: "Invalid submission data" });
    }

    const updatedSubmission = await CodingAnswer.findOneAndUpdate(
      { email }, // uniquely identify by email
      {
        fullname,
        email,
        answers,
        score,
        total: Number(total) || 0,
        role: String(role || ""),
        track: String(track || ""),
        type: String(type || "coding"),
        submittedAt: new Date(),
        status: "Submitted",
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "Answers submitted successfully!",
      score: updatedSubmission.score,
      total: updatedSubmission.total,
    });
  } catch (error) {
    console.error("Error saving coding answers:", error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
