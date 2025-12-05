const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const RoleModel = require("./models/Role");
const { GTestModel, ResponseModel } = require("./models/Gtest");
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const answerRoute = require("./routes/answerRoute");
const submiteAns = require("./routes/submiteAns");
const authRoutes = require('./routes/auth');
const progressRoutes = require("./routes/progress");
const submite = require("./routes/submite")
const candidate=require("./models/candidate")

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ["GET", "POST","PUT","DELETE","PATCH"],
  allowedHeaders: ["Content-Type"]
}));

// ✅ FIXED Mongoose Connection Issue
mongoose.connect("mongodb://127.0.0.1:27017/employee", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/signup', async (req, res) => {
  const { fullName, email, phone, password } = req.body;
  console.log("Signup Request:", req.body);

  if (!fullName || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, phone, password: hashedPassword });

    await newUser.save();

    res.status(200).json({
      message: "Signup successful",
      fullName,
      email,
      phone,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔑 Login
app.post('/login', async (req, res) => {
  const { email, phone, password } = req.body;

  if (!email || !phone || !password) {
    return res.status(400).json({ message: "Email, phone, and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    // Check phone
    if (user.phone !== phone) {
      return res.status(400).json({ message: "Phone number does not match" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
});

app.get("/candidates", async (req, res) => {
  try {
    const candidates = await candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: "Error fetching candidates" });
  }
});
const multer = require('multer');
const path = require('path');

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage }); // ✅ THIS MUST BE DEFINED BEFORE /register

app.post('/register', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Resume file is required' });
  }

  const {
    firstname,
    lastname,
    email,
    contact,
    city,
    role,
  } = req.body;

  try {
    const newCandidate = new candidate({
      firstname,
      lastname,
      email,
      contact,
      city,
      role,
      resume: `http://localhost:3001/uploads/${req.file.filename}` // ✅ Saving resume path
    });

    await newCandidate.save();

    res.json({
      message: 'Candidate registered successfully!',
      resumePath: `http://localhost:3001/uploads/${req.file.filename}`
    });
  } catch (error) {
    console.error("Error saving candidate:", error);
    res.status(500).json({ error: "Error saving candidate" });
  }
});


//candidate 


//HR-Login
app.use('/', authRoutes);
app.use("/progress", progressRoutes);


// ✅ APPLY FOR JOB ROLE
app.post("/apply", async (req, res) => {
  const { applicantName, jobRole } = req.body;

  if (!applicantName || !jobRole) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const newApplication = new RoleModel({ applicantName, jobRole });
    await newApplication.save();
    res.status(200).json({ message: "Applied successfully" });
  } catch (err) {
    console.error("Apply Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.use("/api", require("./routes/answerRoute"));
app.use("/api", submiteAns);
app.use("/api",submite);

// ✅ START SERVER
app.listen(3001, () => {
  console.log("Server running");
});

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.send({ status: "Success" });
    }

    const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "1d" });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for 587
      auth: {
        user: 'khushikapatel2802@gmail.com',
        pass: 'aaqpwzdpwehievvx',
      },
    });

    const mailOptions = {
      from: 'khushikapatel2802@gmail.com',
      to: user.email,
      subject: 'Reset Password Link',
      text: `http://localhost:5173/reset_password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email Send Error:", error); // More specific error
        return res.send({ status: "Email not sent", error: error.message });
      } else {
        console.log("Email sent: " + info.response); // Log success
        return res.send({ status: "Success", link: mailOptions.text });
      }
    });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).send({ status: "Error", error: err.message });
  }
});

app.post('/reset-password/:id/:token', (req, res) => {
  const { id, token } = req.params
  const { password } = req.body

  jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token" })
    } else {
      bcrypt.hash(password, 10)
        .then(hash => {
          UserModel.findByIdAndUpdate({ _id: id }, { password: hash })
            .then(u => res.send({ Status: "Success" }))
            .catch(err => res.send({ Status: err }))
        })
        .catch(err => res.send({ Status: err }))
    }
  })
})