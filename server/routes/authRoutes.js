const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, async (req, res) => {
  res.json({
    message: "Protected route accessed",
    userId: req.userId
  });
});


// ================= REGISTER API =================
router.post("/register", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { name, email, password, skillsOffered, skillsWanted } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      skillsOffered,
      skillsWanted
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id
    });

  } catch (error) {
    console.error("🔥 REGISTER API ERROR 🔥", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= LOGIN API =================
router.post("/login", async (req, res) => {
  
  try {
    const { email, password } = req.body;

    // 1️⃣ Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 3️⃣ Generate JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error("🔥 LOGIN API ERROR 🔥", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
