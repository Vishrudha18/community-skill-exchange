const mongoose = require("mongoose");
const Document = require("../models/Document");
const fs = require("fs");
const path = require("path");

const Session = require("../models/Session");

// =====================================================
// HELPER: CHECK SESSION PARTICIPANT
// =====================================================

const isSessionParticipant = (session, userId) => {
  const user = userId.toString();

  return (
    session.teacher?.toString() === user ||
    session.learner?.toString() === user
  );
};

// =====================================================
// 📤 UPLOAD DOCUMENT
// Teacher only
// =====================================================

exports.uploadDocument = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // Check session ID
    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        message: "Invalid session ID",
      });
    }

    // Check file
    if (!req.file) {
      return res.status(400).json({
        message: "Please select a document to upload",
      });
    }

    // Find session
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // Only teacher can upload
    if (session.teacher.toString() !== req.user.id.toString()) {
      // Remove uploaded file because user is not authorized
      try {
        fs.unlinkSync(req.file.path);
      } catch (fileError) {
        console.error("Failed to remove unauthorized file:", fileError);
      }

      return res.status(403).json({
        message: "Only the teacher can upload class materials",
      });
    }

    // Prevent duplicate filename in same session
    const existing = await Document.findOne({
      session: session._id,
      fileName: req.file.originalname,
    });

    if (existing) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (fileError) {
        console.error("Failed to remove duplicate file:", fileError);
      }

      return res.status(400).json({
        message: "File already exists in this session",
      });
    }

    // Create document
    const doc = new Document({
      user: req.user.id,
      session: session._id,
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
    });

    await doc.save();

    res.status(201).json(doc);
  } catch (err) {
    console.error("Upload document error:", err);

    // Remove uploaded file if something fails
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (fileError) {
        console.error("Failed to remove file:", fileError);
      }
    }

    res.status(500).json({
      message: "Upload failed",
    });
  }
};

// =====================================================
// 📥 GET SESSION DOCUMENTS
// Teacher + Learner
// =====================================================

exports.getSessionDocuments = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(400).json({
        message: "Invalid session ID",
      });
    }

    // Find session
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // Only teacher or learner can view
    if (!isSessionParticipant(session, req.user.id)) {
      return res.status(403).json({
        message: "You are not allowed to access these materials",
      });
    }

    const docs = await Document.find({
      session: session._id,
    }).sort({
      createdAt: -1,
    });

    res.json(docs);
  } catch (err) {
    console.error("Get session documents error:", err);

    res.status(500).json({
      message: "Failed to fetch documents",
    });
  }
};

// =====================================================
// 🗑 DELETE DOCUMENT
// Teacher only
// =====================================================

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const session = await Session.findById(doc.session);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // Only teacher can delete
    if (session.teacher.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Only the teacher can delete class materials",
      });
    }

    // Delete physical file
    if (doc.fileUrl) {
      const filePath = path.join(
        __dirname,
        "..",
        doc.fileUrl.replace(/^\/+/, "")
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Document.findByIdAndDelete(req.params.id);

    res.json({
      message: "Document deleted successfully",
    });
  } catch (err) {
    console.error("Delete document error:", err);

    res.status(500).json({
      message: "Delete failed",
    });
  }
};

// =====================================================
// ✏ RENAME DOCUMENT
// Teacher only
// =====================================================

exports.renameDocument = async (req, res) => {
  try {
    const { fileName } = req.body;

    if (!fileName || !fileName.trim()) {
      return res.status(400).json({
        message: "File name is required",
      });
    }

    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const session = await Session.findById(doc.session);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    // Only teacher can rename
    if (session.teacher.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Only the teacher can rename class materials",
      });
    }

    const normalizedName = fileName.trim();

    // Check duplicate in same session
    const existing = await Document.findOne({
      session: doc.session,
      fileName: {
        $regex: new RegExp(
          `^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
          "i"
        ),
      },
    });

    if (
      existing &&
      existing._id.toString() !== doc._id.toString()
    ) {
      return res.status(400).json({
        message: "File name already exists",
      });
    }

    doc.fileName = normalizedName;

    await doc.save();

    res.json(doc);
  } catch (err) {
    console.error("Rename document error:", err);

    res.status(500).json({
      message: "Rename failed",
    });
  }
};