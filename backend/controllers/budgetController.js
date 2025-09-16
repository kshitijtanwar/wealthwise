const Budget = require("../models/Budget");

exports.setBudget = async (req, res, next) => {
    try {
        const { category, amount, period, startDate, endDate, notifyOn } =
            req.body;
        const budget = await Budget.create({
            userId: req.user._id,
            category,
            amount,
            period,
            startDate,
            endDate,
            notifyOn,
        });
        res.status(201).json({ message: "Budget set successfully", budget });
    } catch (error) {
        next(error);
    }
};

exports.getBudgets = async (req, res, next) => {
    try {
        const budgets = await Budget.find({ userId: req.user._id }).sort({
            startDate: -1,
        });
        res.json({ budgets });
    } catch (error) {
        next(error);
    }
};