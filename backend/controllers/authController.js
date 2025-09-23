const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResetEmail } = require("../utils/sendEmail");

exports.signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists)
            return res.status(400).json({ message: "User already exists" });
        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        const token = generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
};

exports.getMe = async (req, res, next) => {
    try {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        });
    } catch (error) {
        next(error);
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "15m",
        });
        const resetUrl = `http://localhost:5173/reset-password/${token}`;
        console.log(token);

        await sendResetEmail(user.email, resetUrl);
        res.json({ message: "Reset link sent to your email" });
    } catch (error) {
        console.log("Error in forgot password controller", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) return res.status(400).json({ message: "User not found" });

        // Set the plain password - the User model's pre-save middleware will hash it
        user.password = password;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.log("Reset password error", error);
        res.status(400).json({ message: "Invalid or expired token" });
    }
};
