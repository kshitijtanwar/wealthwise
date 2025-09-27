const goal = require("../models/Goal");


 

exports.setGoal = async(req, res, next) => {

    try {

        const {title, targetAmount, targetDate, startAmount} = req.body;

        const newGoal = await goal.create({

            userId:req.user._id,

            title,

            targetAmount,

            targetDate,

            startAmount,

        });

        res.status(201).json({message:"Goal set successfully", newGoal});


 

    } catch (error) {

        next(error)

    }

}


 

exports.trackGoal = async (req, res, next) =>{

    try {

        const goals = await goal.find({userId:req.user._id});

        res.json({goals});

    } catch (error) {

        next(error)

    }

}
