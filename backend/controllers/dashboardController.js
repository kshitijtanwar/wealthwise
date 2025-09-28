const Expense = require("../models/Expense");

const Budget = require("../models/Budget");

const goal = require("../models/Goal");

const reportService = require("../services/reportService");

exports.getDashboard = async (req, res, next) => {
    try {
        //placeholder for dashboard stats

        const stats = await reportService.getDashboardStats(req.user._id);

        res.json({ stats });
    } catch (error) {
        next(error);
    }
};
