require("dotenv").config();
const cookieParser = require("cookie-parser");

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dbConnect = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const goalRoutes = require("./routes/goalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Connect DB
dbConnect();

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/expenses", expenseRoutes);
app.use("/api/v1/budgets", budgetRoutes);
app.use("/api/v1/goals", goalRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
