const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  uploadDocument,
  getSessionDocuments,
  deleteDocument,
  renameDocument,
} = require("../controllers/documentController");

// upload
router.post("/", auth, upload.single("file"), uploadDocument);

// get docs
router.get("/:sessionId", auth, getSessionDocuments);

// delete
router.delete("/:id", auth, deleteDocument);

// rename
router.put("/:id", auth, renameDocument);

module.exports = router;