const Goal = require("../models/Goal");

// const User = require("../models/User"); // import User model

// Return rates in % numbers

const RETURN_RATES = {
    sip: 12,

    fd: 7,

    gold: 10,
};

// Create a new goal

exports.createGoal = async (req, res, next) => {
    try {
        const { name, targetAmount, durationYears, allocation } = req.body;

        if (!allocation) {
            return res.status(400).json({ message: "Allocation is required" });
        }

        // Fetch user from DB to get salary breakdown

        const user = req.user;

        console.log(user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get savings from salary breakdown

        const totalSavings = user.breakdown?.savings || 0;

        console.log(allocation.sip + allocation.fd + allocation.gold);

        if (allocation.sip + allocation.fd + allocation.gold > totalSavings) {
            const error = new Error(
                "Invested amount is more than your total savings"
            );

            error.status = 400;

            throw error;
        }

        // calculate expected returns

        const expectedReturns = {
            sip: (allocation.sip * RETURN_RATES.sip) / 100,

            fd: (allocation.fd * RETURN_RATES.fd) / 100,

            gold: (allocation.gold * RETURN_RATES.gold) / 100,
        };

        expectedReturns.total =
            expectedReturns.sip + expectedReturns.fd + expectedReturns.gold;

        const projectedValue =
            allocation.sip +
            allocation.fd +
            allocation.gold +
            expectedReturns.total;

        const newGoal = new Goal({
            user: req.user._id,

            name,

            targetAmount,

            durationYears,

            totalSavings,

            allocation,

            expectedReturns,

            projectedValue,
        });

        await newGoal.save();

        res.status(201).json({
            message: "Goal created successfully",
            goal: newGoal,
        });
    } catch (error) {
        console.error("Error creating goal:", error);

        next(error);
    }
};

// Get all goals for a user

exports.getGoals = async (req, res, next) => {
    try {
        const goals = await Goal.find({ user: req.user._id });

        res.status(200).json(goals);
    } catch (error) {
        console.error("Error fetching goals:", error);

        next(error);
    }
};

// Get a single goal

exports.getGoalById = async (req, res, next) => {
    try {
        const goal = await Goal.findOne({ _id: req.params.id });

        if (!goal) return res.status(404).json({ message: "Goal not found" });

        res.status(200).json(goal);
    } catch (error) {
        console.error("Error fetching goal:", error);

        next(error);
    }
};

// Update a goal (e.g., change allocation)

exports.updateGoal = async (req, res, next) => {
    try {
        const { allocation } = req.body;

        const goal = await Goal.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!goal) return res.status(404).json({ message: "Goal not found" });

        if (allocation) {
            goal.allocation = allocation;

            goal.expectedReturns = {
                sip: allocation.sip * RETURN_RATES.sip,

                fd: allocation.fd * RETURN_RATES.fd,

                gold: allocation.gold * RETURN_RATES.gold,
            };

            goal.expectedReturns.total =
                goal.expectedReturns.sip +
                goal.expectedReturns.fd +
                goal.expectedReturns.gold;

            goal.projectedValue =
                allocation.sip +
                allocation.fd +
                allocation.gold +
                goal.expectedReturns.total;
        }

        await goal.save();

        res.status(200).json({ message: "Goal updated", goal });
    } catch (error) {
        console.error("Error updating goal:", error);

        next(error);
    }
};

// Delete goal

exports.deleteGoal = async (req, res, next) => {
    try {
        const goal = await Goal.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!goal) return res.status(404).json({ message: "Goal not found" });

        res.status(200).json({ message: "Goal deleted" });
    } catch (error) {
        console.error("Error deleting goal:", error);

        next(error);
    }
};
