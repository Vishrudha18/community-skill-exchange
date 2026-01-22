const express = require("express");
const Skill = require("../models/Skill");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

/* GET skills */
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch skills" });
  }
});

/* POST skill */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, category, level, type } = req.body;

    if (!name || !category || !level || !type) {
      return res.status(400).json({ message: "All fields required" });
    }

    const skill = new Skill({
      name,
      category,
      level,
      type, // offer or learn
      user: req.user.id,
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add skill" });
  }
});


module.exports = router;
