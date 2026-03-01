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

const updateTransaction = async (id, transactionData, userId) => {
    return await Transaction.findOneAndUpdate(
        { _id: id, user: userId },
        transactionData,
        { new: true, runValidators: true }
    );
}

const getTransactionsByDateRange = async (userId, startDate, endDate) => {
    return await Transaction.find({
        user: userId,
        date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    }).sort({ date: -1 });
}

const getTransactionsByDate = async (userId, date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await Transaction.find({
        user: userId,
        date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    }).sort({ date: -1 });
}

module.exports = {
    getAllTransactions,
    createTransaction,
    deleteTransaction,
    updateTransaction,
    getTransactionsByDateRange,
    getTransactionsByDate
}
