const bcrypt = require("bcryptjs");

const User = require("../models/User");

const jwt = require("jsonwebtoken")

const { sendResetEmail } = require("../utils/sendMail")

const generateToken = require("../utils/generateToken");


 

exports.signup = async (req, res, next) => {

    try {
        const { email, password } = req.body;
 

        if (!email || !password) return res.status(400).send("Invalid request body.")


 

        const userExists = await User.findOne({ email });


 

        if (userExists) {

            return res.status(400).json({ error: "User already exists" });

        }

        const user = await User.create({ email, password });


 

        const token = generateToken(user._id);


 

        res.cookie("token", token, {

            httpOnly: true,

            maxAge: 7 * 24 * 60 * 60 * 1000

        });


 

        res.status(201).json({

            _id: user.id,

            email: user.email

        });

    }

    catch (err) {

        next(err);

    }

};

exports.login = async (req, res, next) => {

    try {

        const { email, password } = req.body;


 

        const user = await User.findOne({ email });


 

        if (!user) return res.status(404).json({ error: "User doesn't exists" });


 

        const isMatch = await bcrypt.compare(password, user.password);


 

        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });


 

        const token = generateToken(user._id);


 

        res.cookie("token", token, {

            httpOnly: true,

            maxAge: 7 * 24 * 60 * 60 * 1000

        });


 

        res.status(200).json({

            _id: user.id,

            email: user.email,

        });

    }

    catch (error) {

        next(error);

    }

};

exports.logout = (req, res) => {

    res.clearCookie("token", {

        httpOnly: true,

    });

    res.status(200).json({ message: "Logged out succesfully" });

};


 

exports.getMe = async (req, res, next) => {

    try {

        res.json({

            _id: req.user._id,

            email: req.user.email,

            salary: req.user.salary,

            breakdown: req.user.breakdown

        })

    } catch (error) {

        next(error);

    }

}


 

exports.forgotPassword = async (req, res) => {

    const { email } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found." })


 

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {

            expiresIn: "15m"

        })

        const resetUrl = `http://localhost:5173/reset-password/${token}`

        console.log("Forgot password reset token", token);


 

        await sendResetEmail(user.email, resetUrl);

        res.json({ message: "Reset link sent to your mail" });

    } catch (error) {

        console.log("Error in forgot password controller", error);

        res.status(500).json({ message: "Something went wrong" })

    }

}


 

exports.resetPassword = async (req, res) => {

    const { password, token } = req.body;


 

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);


 

        const user = await User.findById(decoded.id);

        if (!user) return res.status(400).json({ message: "User not found" })


 

        user.password = password;

        await user.save()


 

        res.status(200).json({ message: "Password reset successful" })

    } catch (error) {

        console.log("Reset password error", error);

        res.status(400).json({ message: "Invalid or expired token" })

    }

}