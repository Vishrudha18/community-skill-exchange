const express = require("express");
const multer = require("multer");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadDocument,
  getSessionDocuments,
  deleteDocument,
  renameDocument,
} = require("../controllers/documentController");

// =====================================================
// 📤 UPLOAD DOCUMENT
// Handles Multer errors before controller
// =====================================================

router.post(
  "/",
  auth,
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File is too large. Maximum file size is 25 MB.",
          });
        }

        return res.status(400).json({
          message: err.message || "File upload failed.",
        });
      }

      if (err) {
        return res.status(400).json({
          message: err.message || "Invalid file upload.",
        });
      }

      next();
    });
  },
  uploadDocument,
);

// =====================================================
// 📥 GET SESSION DOCUMENTS
// =====================================================

router.get("/:sessionId", auth, getSessionDocuments);

// =====================================================
// 🗑 DELETE DOCUMENT
// =====================================================

router.delete("/:id", auth, deleteDocument);

// =====================================================
// ✏ RENAME DOCUMENT
// =====================================================

router.put("/:id", auth, renameDocument);

module.exports = router;
