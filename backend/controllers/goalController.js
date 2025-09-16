const Goal = require("../models/Goal");

exports.setGoal = async (req, res, next) => {
    try {
        const { goal, targetAmount } = req.body;
        const newGoal = await Goal.create({
            userId: req.user._id,
            goal,
            targetAmount,
        });
        res.status(201).json({ message: "Goal set successfully", newGoal });
    } catch (error) {
        next(error);
    }
};

exports.trackGoal = async (req, res, next) => {
    try {
        const goals = await Goal.find({ userId: req.user._id });
        res.json({ goals });
    } catch (error) {
        next(error);
    }
};
