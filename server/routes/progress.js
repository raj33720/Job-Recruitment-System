const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Progress = require("../models/Progress"); // adjust path as needed
const Candidate = require("../models/candidate");
const {
  isEmailConfigured,
  sendInterviewScheduleEmail,
} = require("../utils/mailer");

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// POST /progress/by-email
// POST /progress/by-email
router.post("/by-email", async (req, res) => {
  try {
    const rawEmail = String(req.body.email || "");
    const email = rawEmail.trim().toLowerCase();
    const { hrApproval, interview, interviewDate } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (interview === "Scheduled" && !interviewDate) {
      return res.status(400).json({
        error: "Interview date and time are required when scheduling an interview",
      });
    }

    const emailMatcher = new RegExp(`^${escapeRegExp(email)}$`, "i");
    const candidate = await Candidate.findOne({ email: emailMatcher });

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    let progress = await Progress.findOne({ email: emailMatcher });

    if (!progress) {
      progress = new Progress({
        email,
        candidateId: candidate._id,
      });
    }

    const previousInterview = progress.interview;
    const previousInterviewDate = progress.interviewDate;

    if (hrApproval) {
      progress.hrApproval = hrApproval;
      candidate.status = hrApproval;
    }
    if (interview) {
      progress.interview = interview;
      if (interview === "Scheduled") {
        candidate.status = "Interview Scheduled";
      }
    }
    if (interviewDate) progress.interviewDate = interviewDate;
    progress.email = email;
    candidate.email = candidate.email ? candidate.email.toLowerCase() : email;

    await progress.save();
    await candidate.save();

    let emailStatus = "not_requested";
    let emailError = "";

    if (progress.interview === "Scheduled") {
      const interviewChanged =
        previousInterview !== "Scheduled" ||
        previousInterviewDate !== progress.interviewDate;

      if (interviewChanged) {
        if (!isEmailConfigured()) {
          emailStatus = "not_configured";
        } else {
          const candidateName = [candidate.firstname, candidate.lastname]
            .filter(Boolean)
            .join(" ")
            .trim() || candidate.email;

          try {
            await sendInterviewScheduleEmail({
              to: candidate.email,
              candidateName,
              role: candidate.role || "your applied role",
              interviewDate: progress.interviewDate,
            });
            emailStatus = "sent";
          } catch (mailError) {
            console.error("Error sending interview email:", mailError);
            emailStatus = "failed";
            emailError = mailError.message || "Unknown mail error";
          }
        }
      } else {
        emailStatus = "skipped";
      }
    }

    res.status(200).json({
      ...progress.toObject(),
      emailStatus,
      emailError,
    });
  } catch (err) {
    console.error("Error in /progress/by-email:", err);
    res.status(500).json({ error: "Failed to save progress" });
  }
});

router.get("/by-email/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email).trim().toLowerCase();
    const progress = await Progress.findOne({
      email: new RegExp(`^${escapeRegExp(email)}$`, "i"),
    });

    if (!progress) {
      return res.status(200).json({
        email,
        hrApproval: "Pending",
        interview: "Not Scheduled",
        interviewDate: null,
      });
    }

    res.status(200).json(progress);
  } catch (err) {
    console.error("Error in GET /progress/by-email:", err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});
module.exports = router;
