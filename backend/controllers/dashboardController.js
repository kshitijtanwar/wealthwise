const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const Goal = require("../models/Goal");
const reportService = require("../services/reportService");

exports.getDashboard = async (req, res, next) => {
    try {
        // Placeholder for dashboard stats
        const stats = await reportService.getDashboardStats(req.user._id);
        res.json({ stats });
    } catch (error) {
        next(error);
    }
};
