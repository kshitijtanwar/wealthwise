const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category: { type: String, required: true },
        amount: { type: Number, required: true },
        period: {
            type: String,
            enum: ["monthly", "weekly", "yearly"],
            default: "monthly",
        },
        startDate: { type: Date },
        endDate: { type: Date },
        notifyOn: { type: Number, default: 0.9 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Budget", budgetSchema);
