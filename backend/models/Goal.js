const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: { type: String, required: true },
        targetAmount: { type: Number, required: true },
        targetDate: { type: Date },
        startAmount: { type: Number, default: 0.0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);
