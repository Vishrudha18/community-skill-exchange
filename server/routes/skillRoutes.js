const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllSkills,
  getMySkills,
  createSkill,
  deleteSkill,
} = require("../controllers/skillController");

/* ===========================
   GET ALL SKILLS (Browse)
=========================== */
// Excludes logged-in user + only "offer"
router.get("/", authMiddleware, getAllSkills);

/* ===========================
   CREATE SKILL
=========================== */
router.post("/", authMiddleware, createSkill);

/* ===========================
   GET MY SKILLS
=========================== */
router.get("/my", authMiddleware, getMySkills);

/* ===========================
   DELETE SKILL
=========================== */
router.delete("/:id", authMiddleware, deleteSkill);

module.exports = router;