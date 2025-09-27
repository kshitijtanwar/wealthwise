const mongoose = require("mongoose");


 

const expenseSchema = new mongoose.Schema({

    userId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    },

    amount: { type: Number, required: true },

    date: { type: Date, required: true },

    description: { type: String },

    category: { type: String, required: true },

    merchant: { type: String },

    source: {

        type: String,

        enum: ["manual", "bank", "file"],

        default: "manual",

    },

    bankTransactionId: { type: String },

    importedAt: { type: Date },

}, { timestamps: true });


 

module.exports = mongoose.model("Expense", expenseSchema)