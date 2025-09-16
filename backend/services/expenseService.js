const BankAccount = require("../models/BankAccount");
const Expense = require("../models/Expense");

const createExpenseFromTransaction = async (userId, txn, source = "bank") => {
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
            source,
            bankTransactionId: txn.bankTransactionId,
            importedAt: new Date(),
        });
        return 1;
    }
    return 0;
};

exports.importExpenses = async (userId, data) => {
    let transactions = [];

    // Get transactions from bank account or request body
    if (data.bankAccountId) {
        const bankAccount = await BankAccount.findOne({
            accountNumber: data.bankAccountId,
            userId,
        });
        if (!bankAccount) {
            throw new Error("Bank account not found");
        }
        transactions = bankAccount.transactions;
    } else if (Array.isArray(data.transactions)) {
        transactions = data.transactions;
    }

    // Import all transactions
    let importedCount = 0;
    for (const txn of transactions) {
        importedCount += await createExpenseFromTransaction(
            userId,
            txn,
            data.source
        );
    }

    return { importedCount };
};

exports.exportExpenses = async (userId) => {
    // Placeholder for export logic
    return [];
};
