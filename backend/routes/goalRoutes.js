const express = require("express");
const router = express.Router();
const { setGoal, trackGoal } = require("../controllers/goalController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, setGoal);
router.get("/track", protect, trackGoal);

module.exports = router;
