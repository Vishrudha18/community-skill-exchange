const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Skill = require("../models/Skill");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

// ================= PROTECTED PROFILE API =================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= MATCH USERS BY SKILLS =================
router.get("/match", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // placeholder response for now
    res.json({
      message: "Match route working",
      userId: user._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= REGISTER API =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, skillsOffered, skillsWanted } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword, // ✅ FIX
      skillsOffered,
      skillsWanted,
    });

    // 🔥 AUTO-CREATE OFFERED SKILLS
    if (skillsOffered && skillsOffered.length > 0) {
      const offeredSkills = skillsOffered.map(skill => ({
        name: skill,
        category: "General",
        level: "Intermediate",
        type: "offer",
        user: user._id,
      }));

      await Skill.insertMany(offeredSkills);
    }

    // 🔥 AUTO-CREATE WANTED SKILLS
    if (skillsWanted && skillsWanted.length > 0) {
      const wantedSkills = skillsWanted.map(skill => ({
        name: skill,
        category: "General",
        level: "Beginner",
        type: "learn",
        user: user._id,
      }));

      await Skill.insertMany(wantedSkills);
    }

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
});



// ================= LOGIN API =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ FIXED RESPONSE
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("🔥 LOGIN API ERROR 🔥", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* existing routes above */

// 🔐 PROTECTED ROUTE
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    userId: req.userId
  });
});


module.exports = router;
