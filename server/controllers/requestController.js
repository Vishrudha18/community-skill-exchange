const SkillRequest = require("../models/SkillRequest");
const Notification = require("../models/Notification");
const Session = require("../models/Session");

/* =======================
   CREATE REQUEST
======================= */
exports.createRequest = async (req, res) => {
  try {
    const { providerId, skillId } = req.body;

    if (!providerId || !skillId) {
      return res.status(400).json({
        message: "Missing provider or skill",
      });
    }

    if (providerId === req.user.id) {
      return res.status(400).json({
        message: "You cannot request your own skill",
      });
    }

    const existingRequest = await SkillRequest.findOne({
      requester: req.user.id,
      provider: providerId,
      skill: skillId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    const request = await SkillRequest.create({
      requester: req.user.id,
      provider: providerId,
      skill: skillId,
    });

    await Notification.create({
      user: providerId,
      message: "You received a new skill request",
      link: "/requests",
    });

    const populatedRequest = await SkillRequest.findById(request._id)
      .populate("provider", "name email")
      .populate("requester", "name email")
      .populate("skill", "name level");

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error("CREATE REQUEST ERROR:", error);
    res.status(500).json({
      message: "Failed to create request",
    });
  }
};

/* =======================
   GET RECEIVED REQUESTS
======================= */
exports.getReceivedRequests = async (req, res) => {
  try {
    const requests = await SkillRequest.find({
      provider: req.user.id,
    })
      .populate("requester", "name email")
      .populate("provider", "name email")
      .populate("skill", "name level");

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch received requests",
    });
  }
};

/* =======================
   GET SENT REQUESTS
======================= */
exports.getSentRequests = async (req, res) => {
  try {
    const requests = await SkillRequest.find({
      requester: req.user.id,
    })
      .populate("provider", "name email")
      .populate("skill", "name level");

    res.json(requests);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch sent requests",
    });
  }
};

/* =======================
   ACCEPT REQUEST
======================= */
exports.acceptRequest = async (req, res) => {
  try {
    const request = await SkillRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.provider.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Request already processed",
      });
    }

    request.status = "accepted";
    await request.save();

    let session = await Session.findOne({
      request: request._id,
    });

    if (!session) {
      session = await Session.create({
        teacher: request.provider,
        learner: request.requester,
        skill: request.skill,
        request: request._id,
        title: "Skill Learning Session",
        meetingType: "video",
        status: "scheduled",
      });
    }

    await Notification.create({
      user: request.requester,
      message: "Your skill request was accepted 🎉",
      link: "/requests",
    });

    res.json({
      message: "Request accepted",
      request,
      session,
    });
  } catch (error) {
    console.error("ACCEPT REQUEST ERROR:", error);
    res.status(500).json({
      message: "Failed to accept request",
    });
  }
};

/* =======================
   REJECT REQUEST
======================= */
exports.rejectRequest = async (req, res) => {
  try {
    const request = await SkillRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.provider.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Request already processed",
      });
    }

    request.status = "rejected";
    await request.save();

    await Notification.create({
      user: request.requester,
      message: "Your skill request was rejected ❌",
      link: "/requests",
    });

    res.json({
      message: "Request rejected",
      request,
    });
  } catch (error) {
    console.error("REJECT REQUEST ERROR:", error);
    res.status(500).json({
      message: "Failed to reject request",
    });
  }
};

/* =======================
   CANCEL REQUEST
======================= */
exports.cancelRequest = async (req, res) => {
  try {
    const request = await SkillRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.requester.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Cannot cancel processed request",
      });
    }

    request.status = "cancelled";
    await request.save();

    res.json({
      message: "Request cancelled successfully",
    });
  } catch (error) {
    console.error("CANCEL REQUEST ERROR:", error);
    res.status(500).json({
      message: "Failed to cancel request",
    });
  }
};

/* =======================
   COUNT PENDING REQUESTS
======================= */
exports.getRequestCount = async (req, res) => {
  try {
    const count = await SkillRequest.countDocuments({
      provider: req.user.id,
      status: "pending",
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch count",
    });
  }
};