const express = require("express");
const router = express.Router();
const {
  setAvailability,
  getUserAvailability,
} = require("../controllers/availabilityController");

const auth = require("../middleware/authMiddleware");

router.post("/", auth, setAvailability);
router.get("/:userId", getUserAvailability);

module.exports = router;