const express = require("express");
const Result = require("../models/Result");

const router = express.Router();

const toNumber = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

router.post("/", async (req, res) => {
  try {
    const payload = req.body || {};
    const email = String(payload.email || "")
      .trim()
      .toLowerCase();
    const name = String(payload.name || "").trim();

    if (!email || !name) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const doc = await Result.findOneAndUpdate(
      { email },
      {
        name,
        email,
        role: String(payload.role || "").trim(),
        mcqScore: toNumber(payload.mcqScore),
        codingScore: toNumber(payload.codingScore),
        aiRating: toNumber(payload.aiRating),
        weightedScore: toNumber(payload.weightedScore),
        finalScore: toNumber(payload.finalScore),
        feedback: String(payload.feedback || ""),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(doc);
  } catch (err) {
    console.error("Result save error:", err.message);
    res.status(500).json({ message: "Failed to save result" });
  }
});

router.get("/:email", async (req, res) => {
  try {
    const email = String(req.params.email || "")
      .trim()
      .toLowerCase();
    const result = await Result.findOne({ email });

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(result);
  } catch (err) {
    console.error("Result fetch error:", err.message);
    res.status(500).json({ message: "Failed to fetch result" });
  }
});

module.exports = router;
