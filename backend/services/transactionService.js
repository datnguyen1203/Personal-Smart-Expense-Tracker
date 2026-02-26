const Transaction = require('../models/transaction');

const getAllTransactions = async () => {
    return await Transaction.find().sort({ date: -1 });
}

const createTransaction = async (transactionData) => {
    const transaction = new Transaction(transactionData);
    return await transaction.save();
}

const deleteTransaction = async (id) => {
    return await Transaction.findByIdAndDelete(id);
}

module.exports = {
    getAllTransactions,
    createTransaction,
    deleteTransaction
}