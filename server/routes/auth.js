const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User2 = require('../models/User2');

// Register
router.post('/reg', async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User2.create({ fullName, email, phone, password: hashedPassword });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

// Login

// Login
router.post('/log', async (req, res) => {
  const { email, password, phone } = req.body;
  const user = await User2.findOne({ email, phone });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // ✅ Send all required fields
  res.json({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone
  });
});



module.exports = router;
