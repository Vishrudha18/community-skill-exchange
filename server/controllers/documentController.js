const Document = require("../models/Document");

// ========================
// 📤 UPLOAD DOCUMENT
// ========================
exports.uploadDocument = async (req, res) => {
  try {
    const { sessionId } = req.body;

    // 🔥 Prevent duplicate
    const existing = await Document.findOne({
      session: sessionId,
      fileName: req.file.originalname,
    });

    if (existing) {
      return res.status(400).json({
        message: "File already exists",
      });
    }

    const doc = new Document({
      user: req.user.id,
      session: new mongoose.Types.ObjectId(sessionId), // ✅ FORCE FIX
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
    });

    await doc.save();

    res.status(201).json(doc);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
};

// ========================
// 📥 GET DOCUMENTS
// ========================
exports.getSessionDocuments = async (req, res) => {
  try {
    const docs = await Document.find({
      session: new mongoose.Types.ObjectId(req.params.sessionId), // ✅ FILTER
    }).sort({ createdAt: -1 });

    res.json(docs);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

// ========================
// 🗑 DELETE
// ========================
exports.deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// ========================
// ✏ RENAME
// ========================
exports.renameDocument = async (req, res) => {
  try {
    let { fileName } = req.body;

    // 🔥 normalize
    const normalizedName = fileName.toLowerCase().trim();

    const doc = await Document.findById(req.params.id);

    // 🔥 check duplicate in same session
    const existing = await Document.findOne({
      session: doc.session,
      fileName: { $regex: new RegExp(`^${normalizedName}$`, "i") }, // case-insensitive
    });

    if (existing && existing._id.toString() !== doc._id.toString()) {
      return res.status(400).json({
        message: "File name already exists",
      });
    }

    doc.fileName = fileName.trim();
    await doc.save();

    res.json(doc);

  } catch (err) {
    res.status(500).json({ message: "Rename failed" });
  }
};