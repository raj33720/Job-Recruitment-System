const express = require("express");
const router = express.Router();

const QuantAnswer = require("../models/Gtest"); // Quant schema
const CodingAnswer = require("../models/CodingAnswer"); // Coding schema

// Unified fetch for both test scores
router.get("/submit-answers/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);

    const quant = await QuantAnswer.findOne({ email });
    const coding = await CodingAnswer.findOne({ email });

    res.json({
      quantScore: quant ? quant.score : null,
      codingScore: coding ? coding.score : null,
    });
  } catch (err) {
    console.error("Submit Answers Fetch Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
