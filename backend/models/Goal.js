const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
    },

    name: { type: String, required: true },

    targetAmount: { type: Number, required: true },

    durationYears: { type: Number, required: true },

    // allocation in numbers

    allocation: {
        sip: { type: Number, default: 0 },

        fd: { type: Number, default: 0 },

        gold: { type: Number, default: 0 },
    },

    // returns in absolute numbers

    expectedReturns: {
        sip: { type: Number, default: 0 },

        fd: { type: Number, default: 0 },

        gold: { type: Number, default: 0 },

        total: { type: Number, default: 0 },
    },

    projectedValue: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Goal", goalSchema);
