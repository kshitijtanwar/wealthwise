const Budget = require("../models/Budget");

const User = require("../models/User");


 

exports.setBudget = async (req, res, next) => {

    try {

        const { category, amount, } =

            req.body;

        const budget = await Budget.updateOne({ category }, {

            userId: req.user._id,

            category,

            amount,

        }, { upsert: true });

        res.status(201).json({ message: "Budget set successfully", budget });

    }

    catch (error) {

        next(error);

    }

}


 

exports.getBudgets = async (req, res, next) => {

    try {

        const budgets = await Budget.find({ userId: req.user._id }).sort({

            startDate: -1,

        });

        res.json({ budgets })

    }

    catch (error) {

        next(error);

    }

};


 

exports.setSalaryBreakdown = async (req, res, next) => {

    try {

        let { salary, savings, expenses, misc } = req.body;

        salary = Number(salary);

        savings = Number(savings);

        expenses = Number(expenses);

        misc = Number(misc);


 

        if (savings + expenses + misc > salary) {

            const err = new Error("breakdown exceeding salary");

            err.status = 400;

            throw err;

        }

        const updatedUser = await User.updateOne({ _id: req.user._id }, {

            $set: {

                salary,

                breakdown: {

                    savings,

                    expenses,

                    misc

                }

            }

        });


 

        res.json({ updatedUser })

    }

    catch (error) {

        next(error);

    }

};

