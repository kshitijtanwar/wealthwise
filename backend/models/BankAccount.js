const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    category: { type: String },
    merchant: { type: String },
    bankTransactionId: { type: String, required: true },
});

const bankAccountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    accountNumber: { type: String, required: true, unique: true },
    transactions: [transactionSchema],
});

module.exports = mongoose.model("BankAccount", bankAccountSchema);
