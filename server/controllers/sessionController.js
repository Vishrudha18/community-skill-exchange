const Session = require("../models/Session");

/* =======================
   GET MY SESSIONS
======================= */
exports.getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [
        { teacher: req.user.id },
        { learner: req.user.id }
      ]
    })
      .populate("teacher", "name email")
      .populate("learner", "name email")
      .populate("skill", "name level")
      .sort({ createdAt: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

/* =======================
   GET SESSION BY ID
======================= */
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("teacher", "name email")
      .populate("learner", "name email")
      .populate("skill", "name level");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch session" });
  }
};

/* =======================
   ✅ NEW: BOOK SESSION FROM SLOT
======================= */
exports.bookSession = async (req, res) => {
  try {
    const { teacherId, day, slotStart, slotEnd, date } = req.body;

    // 🚨 prevent double booking
    const existing = await Session.findOne({
      teacher: teacherId,
      scheduledAt: new Date(date),
      slotStart,
      slotEnd,
      status: { $ne: "cancelled" },
    });

    if (existing) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const scheduledAt = new Date(`${date}T${slotStart}`);

    const session = new Session({
      teacher: teacherId,
      learner: req.user.id,

      type: "booking", // 🔥 IMPORTANT

      day,
      slotStart,
      slotEnd,

      scheduledAt,
      duration: 60,

      meetingLink: `/live/${Date.now()}`,
      status: "scheduled",
    });

    await session.save();

    res.status(201).json(session);

  } catch (error) {
    res.status(500).json({ message: "Booking failed" });
  }
};

/* =======================
   SCHEDULE SESSION (EXISTING FLOW)
======================= */
exports.scheduleSession = async (req, res) => {
  try {
    const { scheduledAt, duration } = req.body;

    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status === "cancelled") {
      return res.status(400).json({ message: "Cannot schedule a cancelled session" });
    }

    if (session.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only teacher can schedule" });
    }

    session.scheduledAt = scheduledAt;
    session.duration = duration;
    session.status = "scheduled";
    session.meetingLink = `/live/${session._id}`;

    await session.save();

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Failed to schedule session" });
  }
};

/* =======================
   CANCEL SESSION
======================= */
exports.cancelSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status === "cancelled") {
      return res.status(400).json({ message: "Already cancelled" });
    }

    if (
      session.teacher.toString() !== req.user.id &&
      session.learner.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    session.status = "cancelled";
    await session.save();

    res.json({ message: "Session cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel session" });
  }
};

/* =======================
   GET BOOKED SLOTS
======================= */
exports.getBookedSlots = async (req, res) => {
  try {
    const { teacherId, date } = req.query;

    const sessions = await Session.find({
      teacher: teacherId,
      scheduledAt: new Date(date),
      status: { $ne: "cancelled" },
    });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booked slots" });
  }
};