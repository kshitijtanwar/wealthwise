const mongoose = require("mongoose");
const BankAccount = require("../models/BankAccount");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const userId = "68c99575c246ee740aa25048";
const accountNumber = "1234567890";

const transactions = [
    {
        amount: 100.0,
        date: new Date("2024-09-01"),
        description: "Uber Ride",
        category: "Transportation",
        merchant: "Uber",
        bankTransactionId: "txn_001",
    },
    {
        amount: 50.0,
        date: new Date("2024-09-02"),
        description: "Groceries",
        category: "Food",
        merchant: "BigMart",
        bankTransactionId: "txn_002",
    },
    {
        amount: 200.0,
        date: new Date("2024-09-03"),
        description: "Flight Ticket",
        category: "Travel",
        merchant: "IndiGo",
        bankTransactionId: "txn_003",
    },
];

async function seed() {
    await mongoose.connect(MONGO_URI);
    const exists = await BankAccount.findOne({ accountNumber, userId });
    if (exists) {
        console.log("Bank account already exists. Updating transactions...");
        exists.transactions = transactions;
        await exists.save();
    } else {
        await BankAccount.create({ userId, accountNumber, transactions });
        console.log("Bank account seeded!");
    }
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
