const express = require("express");
const Skill = require("../models/Skill");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
MATCH LOGIC:
- Current user has skills with type = "learn"
- Find other users who have same skill name with type = "offer"
*/

router.get("/", authMiddleware, async (req, res) => {
  try {
    // 1. Skills current user wants to learn
    const learningSkills = await Skill.find({
      user: req.user.id,
      type: "learn",
    });

    if (learningSkills.length === 0) {
      return res.json({ matches: [] });
    }

    // 2. Get skill names
    const skillNames = learningSkills.map(skill => skill.name);

    // 3. Find matching offered skills from other users
    const matches = await Skill.find({
      name: { $in: skillNames },
      type: "offer",
      user: { $ne: req.user.id }, // not same user
    }).populate("user", "name email");

    res.json({
      totalMatches: matches.length,
      matches,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Match failed" });
  }
});

module.exports = router;
