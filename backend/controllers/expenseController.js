const Expense = require("../models/Expense");

const Budget = require("../models/Budget");

const expenseService = require("../services/expenseService");

const mapCategory = require("../utils/categoryMapper");


 

exports.getExpenses = async (req, res, next) => {

    try {

        const expenses = await Expense.find({ userId: req.user._id }).sort({

            date: -1,

        });

        res.json({ expenses });

    } catch (error) {

        next(error)

    }

};


 

exports.addExpense = async (req, res, next) => {

    try {

        const { amount, date, category, description, merchant } = req.body;


 

        const expense = await Expense.create({

            userId: req.user._id,

            amount,

            date,

            category,

            description,

            merchant,

        });



 

        const budget = await Budget.findOne({

            userId: req.user._id,

            category,

        });


 

        let alert = null;


 

        if (budget) {

            const total = await Expense.aggregate([

                {

                    $match: {

                        userId: req.user._id,

                        category,

                    },

                },

                {

                    $group: {

                        _id: null,

                        sum: { $sum: "$amount" },

                    },

                },

            ]);


 

            const spent = total[0]?.sum || 0;


 

            if (spent >= budget.amount) {

                alert = `⚠️ You have exceeded your budget of ${budget.amount} for '${category}'. Total spent: ${spent}`;

            } else if (spent >= budget.amount * budget.notifyOn) {

                alert = `Warning: You have reached ${Math.round(

                    (spent / budget.amount) * 100

                )}% of your '${category}' budget.`;

            }

        }


 

        res.status(201).json({

            message: "Expense added successfully",

            expense,

            alert,

        });

    } catch (error) {

        next(error);

    }

};


 

exports.importExpenses = async (req, res, next) => {

    try {

        const imported = await expenseService.importExpenses(

            req.user._id,

            req.body

        );

        res.json({ message: "Expense imported", imported });

    } catch (error) {

        next(error)

    }

};


 

exports.exportExpenses = async (req, res, next) => {

    try {

        const exported = await expenseService.exportExpenses(req.user._id);

        res.json({ message: "Expenses exported", exported });

    } catch (error) {

        next(error)

    }

};