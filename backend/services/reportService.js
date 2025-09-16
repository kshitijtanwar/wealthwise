const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const Goal = require("../models/Goal");

exports.getDashboardStats = async (userId) => {
    const totalExpenses = await Expense.countDocuments({ userId });
    const totalBudgets = await Budget.countDocuments({ userId });
    const totalGoals = await Goal.countDocuments({ userId });
    return {
        totalExpenses,
        totalBudgets,
        totalGoals,
    };
};
