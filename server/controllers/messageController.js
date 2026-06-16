const Message = require("../models/Message");
const Session = require("../models/Session");

/* ============================================
   HELPER — verify user is session participant
============================================ */
const isParticipant = (session, userId) => {
  return (
    session.teacher.toString() === userId ||
    session.learner.toString() === userId
  );
};

/* ============================================
   GET MESSAGE HISTORY
   GET /api/messages/:sessionId
============================================ */
exports.getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Verify session exists
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Verify requesting user is teacher or learner
    if (!isParticipant(session, req.user.id)) {
      return res.status(403).json({ message: "Not a session participant" });
    }

    const messages = await Message.find({
      session: sessionId,
      isDeleted: false,
    })
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();

    res.json(messages);
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

/* ============================================
   MARK SESSION MESSAGES AS READ
   PATCH /api/messages/:sessionId/read
   — Phase A stub: foundation for Phase B unread counts
============================================ */
exports.markSessionMessagesRead = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!isParticipant(session, req.user.id)) {
      return res.status(403).json({ message: "Not a session participant" });
    }

    // Phase A: simple acknowledgement — readBy tracking added in Phase B
    res.json({ message: "Read acknowledgement received" });
  } catch (error) {
    console.error("MARK READ ERROR:", error);
    res.status(500).json({ message: "Failed to mark messages as read" });
  }
};
