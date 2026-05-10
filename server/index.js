const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");

const RoleModel = require("./models/Role");
const User = require("./models/User");
const candidate = require("./models/candidate");
const Progress = require("./models/Progress");
const answerRoute = require("./routes/answerRoute");
const submitAns = require("./routes/submitAns");
const authRoutes = require("./routes/auth");
const progressRoutes = require("./routes/progress");
const submit = require("./routes/submit");
const quizRoutes = require("./routes/quizRoutes");
const codingRoutes = require("./routes/codingRoutes");
const codeRunner = require("./routes/codeRunner");
const aiRoutes = require("./routes/aiRoutes");
const resultRoutes = require("./routes/resultRoutes");

function loadEnvFile(envFilePath) {
  if (!fs.existsSync(envFilePath)) {
    return;
  }

  const envLines = fs.readFileSync(envFilePath, "utf8").split(/\r?\n/);

  for (const rawLine of envLines) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) {
      continue;
    }

    let value = line.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadEnvFile(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT) || 3001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
const MONGODB_URI =
  process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_key";
const EMAIL_USER = process.env.EMAIL_USER || "";
const EMAIL_PASS = process.env.EMAIL_PASS || "";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function issueAuthToken(user = {}) {
  return jwt.sign(
    {
      email: normalizeEmail(user.email),
      role: user.role || "candidate",
      fullName: String(user.fullName || "").trim(),
    },
    JWT_SECRET,
    { expiresIn: "12h" }
  );
}

const app = express();


app.use(express.json());
app.use(
  cors({
    origin: [CLIENT_URL, "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api/quiz", quizRoutes);
app.use("/api/coding", codingRoutes);
app.use("/api/code", codeRunner);
app.use("/api/ai", aiRoutes);
app.use("/api/results", resultRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
  

app.post("/signup", async (req, res) => {
  const fullName = String(req.body.fullName || "").trim();
  const email = normalizeEmail(req.body.email);
  const phone = String(req.body.phone || "").trim();
  const password = String(req.body.password || "");
  console.log("Signup Request:", req.body);

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ fullName, email, phone, password: hashedPassword });

    await newUser.save();
    const token = issueAuthToken(newUser);

    res.status(200).json({
      message: "Signup successful",
      fullName,
      email,
      phone,
      role: newUser.role || "candidate",
      token,
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const phone = String(req.body.phone || "").trim();
  const password = String(req.body.password || "");

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (phone && user.phone !== phone) {
      return res.status(400).json({ message: "Phone number does not match" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = issueAuthToken(user);

    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role || 'candidate',
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
});

app.get("/candidates", async (req, res) => {
  try {
    const candidates = await candidate.find();
    const progresses = await Progress.find();
    const progressByEmail = progresses.reduce((acc, p) => {
      acc[normalizeEmail(p.email)] = p;
      return acc;
    }, {});

    const enriched = candidates.map((c) => {
      const progress = progressByEmail[normalizeEmail(c.email)];
      const candidateObj = c.toObject ? c.toObject() : c;

      return {
        ...candidateObj,
        status: progress?.hrApproval || candidateObj.status || "Pending",
        hrApproval: progress?.hrApproval || "Pending",
        interview: progress?.interview || "Not Scheduled",
        interviewDate: progress?.interviewDate || null,
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error("Error fetching candidates:", err);
    res.status(500).json({ error: "Error fetching candidates" });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.post("/register", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Resume file is required" });
  }

  const { firstname, lastname, contact, city, address, experience, role } = req.body;
  const email = normalizeEmail(req.body.email);

  try {
    // Check if candidate with this email already exists
    const existingCandidate = await candidate.findOne({ email });

    if (existingCandidate) {
      // Update existing candidate with new information
      existingCandidate.firstname = String(firstname || "").trim();
      existingCandidate.lastname = String(lastname || "").trim();
      existingCandidate.contact = String(contact || "").trim();
      existingCandidate.city = String(city || "").trim();
      existingCandidate.address = String(address || "").trim();
      existingCandidate.experience = String(experience || "").trim();
      existingCandidate.role = String(role || "").trim();
      existingCandidate.resume = `${SERVER_URL}/uploads/${req.file.filename}`;

      await existingCandidate.save();

      res.json({
        message: "Candidate updated successfully!",
        resumePath: `${SERVER_URL}/uploads/${req.file.filename}`,
      });
    } else {
      // Create new candidate
      const newCandidate = new candidate({
        firstname: String(firstname || "").trim(),
        lastname: String(lastname || "").trim(),
        email,
        contact: String(contact || "").trim(),
        city: String(city || "").trim(),
        address: String(address || "").trim(),
        experience: String(experience || "").trim(),
        role: String(role || "").trim(),
        resume: `${SERVER_URL}/uploads/${req.file.filename}`,
      });

      await newCandidate.save();

      res.json({
        message: "Candidate registered successfully!",
        resumePath: `${SERVER_URL}/uploads/${req.file.filename}`,
      });
    }
  } catch (error) {
    console.error("Error saving candidate:", error);
    res.status(500).json({ error: "Error saving candidate" });
  }
});

app.use("/", authRoutes);
app.use("/progress", progressRoutes);

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

app.use("/api", answerRoute);
app.use("/api", submitAns);
app.use("/api", submit);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.send({ status: "Success" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    if (!EMAIL_USER || !EMAIL_PASS) {
      return res.status(500).send({
        status: "Error",
        error:
          "Email service is not configured. Set EMAIL_USER and EMAIL_PASS in server/.env",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: user.email,
      subject: "Reset Password Link",
      text: `${CLIENT_URL}/reset_password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email Send Error:", error);
        return res.send({ status: "Email not sent", error: error.message });
      }

      console.log("Email sent:", info.response);
      return res.send({ status: "Success", link: mailOptions.text });
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).send({ status: "Error", error: err.message });
  }
});

app.post("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, JWT_SECRET, (err) => {
    if (err) {
      return res.json({ Status: "Error with token" });
    }

    bcrypt
      .hash(password, 10)
      .then((hash) => {
        User.findByIdAndUpdate({ _id: id }, { password: hash })
          .then(() => res.send({ Status: "Success" }))
          .catch((updateError) => res.send({ Status: updateError }));
      })
      .catch((hashError) => res.send({ Status: hashError }));
  });
});
