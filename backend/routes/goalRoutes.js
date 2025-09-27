const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    getGoalById,
    updateGoal,
    deleteGoal,
    getGoals,
    createGoal,
} = require("../controllers/goalController");

// Create a new goal

router.post("/create-goal", protect, createGoal);

// Get all goals for the logged-in user

router.get("/", protect, getGoals);

// Get a single goal by ID

router
    .route("/:id")

    .get(protect, getGoalById)

    .patch(protect, updateGoal)

    .delete(protect, deleteGoal);

module.exports = router;
