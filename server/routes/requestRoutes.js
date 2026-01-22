const express = require("express");
const router = express.Router();
const SkillRequest = require("../models/SkillRequest");
const authMiddleware = require("../middleware/authMiddleware");


// =======================
// CREATE SKILL REQUEST
// Learner → sends request
// =======================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { providerId, skillId } = req.body;

    if (!providerId || !skillId) {
      return res.status(400).json({ message: "providerId and skillId required" });
    }

    const request = await SkillRequest.create({
      requester: req.user.id,
      provider: providerId,
      skill: skillId,
    });

    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create request" });
  }
});


// ==================================
// GET REQUESTS RECEIVED (PROVIDER)
// ==================================
router.get("/received", authMiddleware, async (req, res) => {
  try {
    const requests = await SkillRequest.find({
      provider: req.user.id,
    })
      .populate("requester", "name email")
      .populate("skill", "name level");

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch received requests" });
  }
});


// ==================================
// GET REQUESTS SENT (LEARNER)
// ==================================
router.get("/sent", authMiddleware, async (req, res) => {
  try {
    const requests = await SkillRequest.find({
      requester: req.user.id,
    })
      .populate("provider", "name email")
      .populate("skill", "name level");

    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch sent requests" });
  }
});


// ==================================
// ACCEPT / REJECT REQUEST (PROVIDER)
// ==================================
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await SkillRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Only provider can update
    if (request.provider.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update request" });
  }
});

router.get("/count", authMiddleware, async (req, res) => {
  const count = await SkillRequest.countDocuments({
    provider: req.user.id,
    status: "pending",
  });

  res.json({ count });
});



module.exports = router;
