const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Progress = require("../models/Progress"); // adjust path as needed
const Candidate = require("../models/candidate");

// POST /progress/by-email
// POST /progress/by-email
router.post("/by-email", async (req, res) => {
  try {
    const { email, hrApproval, interview, interviewDate } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const candidate = await Candidate.findOne({ email });

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    let progress = await Progress.findOne({ email });

    if (!progress) {
      progress = new Progress({
        email,
        candidateId: candidate._id, // ✅ insert this
      });
    }

    if (hrApproval) progress.hrApproval = hrApproval;
    if (interview) progress.interview = interview;
    if (interviewDate) progress.interviewDate = interviewDate;

    await progress.save();
    res.status(200).json(progress);
  } catch (err) {
    console.error("Error in /progress/by-email:", err);
    res.status(500).json({ error: "Failed to save progress" });
  }
});

router.get("/by-email/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const progress = await Progress.findOne({ email });

    if (!progress) {
      return res.status(404).json({ error: "No progress found for this email" });
    }

    res.status(200).json(progress);
  } catch (err) {
    console.error("Error in GET /progress/by-email:", err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});
module.exports = router;
