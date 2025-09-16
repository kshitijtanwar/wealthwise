const BankAccount = require("../models/BankAccount");
const Expense = require("../models/Expense");

exports.importExpenses = async (userId, data) => {
    // If bankAccountId is provided, import from BankAccount model
    if (data.bankAccountId) {
        const bankAccount = await BankAccount.findOne({
            accountNumber: data.bankAccountId,
            userId,
        });
        if (!bankAccount) {
            throw new Error("Bank account not found");
        }
        let importedCount = 0;
        for (const txn of bankAccount.transactions) {
            // Avoid duplicate import by bankTransactionId
            const exists = await Expense.findOne({
                bankTransactionId: txn.bankTransactionId,
                userId,
            });
            if (!exists) {
                await Expense.create({
                    userId,
                    amount: txn.amount,
                    date: txn.date,
                    description: txn.description,
                    category: txn.category,
                    merchant: txn.merchant,
                    source: "bank",
                    bankTransactionId: txn.bankTransactionId,
                    importedAt: new Date(),
                });
                importedCount++;
            }
        }
        return { importedCount };
    }
    // Fallback: import from provided transactions array
    if (Array.isArray(data.transactions)) {
        let importedCount = 0;
        for (const txn of data.transactions) {
            const exists = await Expense.findOne({
                bankTransactionId: txn.bankTransactionId,
                userId,
            });
            if (!exists) {
                await Expense.create({
                    userId,
                    amount: txn.amount,
                    date: txn.date,
                    description: txn.description,
                    category: txn.category,
                    merchant: txn.merchant,
                    source: data.source || "bank",
                    bankTransactionId: txn.bankTransactionId,
                    importedAt: new Date(),
                });
                importedCount++;
            }
        }
        return { importedCount };
    }
    return { importedCount: 0 };
};

exports.exportExpenses = async (userId) => {
    // Placeholder for export logic
    return [];
};
