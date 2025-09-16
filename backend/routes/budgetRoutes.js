const express = require("express");
const router = express.Router();
const { setBudget } = require("../controllers/budgetController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, setBudget);

module.exports = router;
