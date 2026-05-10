const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User2 = require('../models/User2');
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_key";

const issueAuthToken = (user = {}) =>
  jwt.sign(
    {
      email: String(user.email || "").trim().toLowerCase(),
      role: user.role || "hr",
      fullName: String(user.fullName || "").trim(),
    },
    JWT_SECRET,
    { expiresIn: "12h" }
  );

// Register
router.post('/reg', async (req, res) => {
  const fullName = (req.body.fullName || "").trim();
  const email = (req.body.email || "").trim().toLowerCase();
  const phone = (req.body.phone || "").trim();
  const password = req.body.password || "";

  if (!fullName || !email || !password) {
    return res.status(400).json({
      message: "Full name, email, and password are required",
    });
  }

  try {
    const existingUser = await User2.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "An HR account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User2.create({ fullName, email, phone, password: hashedPassword });
    res.json({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role || "hr",
      token: issueAuthToken(user),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: "An HR account with this email already exists",
      });
    }

    console.error("HR register error:", err);
    res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
});

// Login
router.post('/log', async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";
  const phone = (req.body.phone || "").trim();
  const user = await User2.findOne({ email });

  if (!user || (phone && user.phone !== phone) || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // ✅ Send all required fields including role
  res.json({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role || 'hr',
    token: issueAuthToken(user),
  });
});
router.get(
  "/candidate-dashboard",
  protect,
  authorizeRoles("candidate"),
  (req, res) => {
    res.json({ message: "Candidate data" });
  }
);

router.get(
  "/hr-dashboard",
  protect,
  authorizeRoles("hr", "admin"),
  (req, res) => {
    res.json({ message: "HR data" });
  }
);


module.exports = router;
