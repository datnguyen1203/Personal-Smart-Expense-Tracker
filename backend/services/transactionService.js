const Transaction = require('../models/transaction');

const getAllTransactions = async (userId) => {
    return await Transaction.find({ user: userId }).sort({ date: -1 });
}

const createTransaction = async (transactionData, userId) => {
    const transaction = new Transaction({ ...transactionData, user: userId });
    return await transaction.save();
}

const deleteTransaction = async (id, userId) => {
    return await Transaction.findOneAndDelete({ _id: id, user: userId });
}

module.exports = {
    getAllTransactions,
    createTransaction,
    deleteTransaction
}
