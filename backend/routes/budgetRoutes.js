const express = require("express");

const router = express.Router();

const { setBudget, getBudgets, setSalaryBreakdown } = require("../controllers/budgetController")

const { protect } = require("../middleware/authMiddleware")



 

router.get("/", protect, getBudgets);

router.post("/", protect, setBudget);

router.put("/update-breakdown", protect, setSalaryBreakdown)
module.exports = router;