const Skill = require("../models/Skill");

/* ===========================
   GET ALL SKILLS (Browse)
=========================== */
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      user: { $ne: req.user.id }, // exclude self
      type: "offer",
    }).populate("user", "name email");

    res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch skills" });
  }
};

/* ===========================
   GET MY SKILLS
=========================== */
exports.getMySkills = async (req, res) => {
  try {
    const skills = await Skill.find({
      user: req.user.id,
      type: "offer",
    }).sort({ createdAt: -1 });

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch skills" });
  }
};

/* ===========================
   CREATE SKILL
=========================== */
exports.createSkill = async (req, res) => {
  try {
    const { name, category, level, type } = req.body;

    if (!name || !category || !level || !type) {
      return res.status(400).json({ message: "All fields required" });
    }

    const skill = new Skill({
      name,
      category,
      level,
      type,
      user: req.user.id,
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add skill" });
  }
};

/* ===========================
   DELETE SKILL
=========================== */
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skill.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await skill.deleteOne();
    res.json({ message: "Skill removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete skill" });
  }
};