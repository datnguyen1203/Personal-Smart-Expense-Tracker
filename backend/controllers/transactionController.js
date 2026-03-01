const Transaction = require('../models/transaction');
const transactionService = require('../services/transactionService');

const getTransactions = async (req, res) => {
    try {
        const data = await transactionService.getAllTransactions(req.user.id);
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addTransaction = async (req, res) => {
    try {
        const savedData = await transactionService.createTransaction(req.body, req.user.id);
        res.status(201).json(savedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const removeTransaction = async (req, res) => {
    try {
        const deletedData = await transactionService.deleteTransaction(req.params.id, req.user.id);
        if (deletedData) {
            res.status(200).json({ message: 'Transaction deleted successfully' });
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateTransaction = async (req, res) => {
    try {
        const updatedData = await transactionService.updateTransaction(req.params.id, req.body, req.user.id);
        if (updatedData) {
            res.status(200).json(updatedData);
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getTransactionByRange = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        const data = await transactionService.getTransactionsByDateRange(req.user.id, startDate, endDate);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getTransactionByDate = async (req, res) => {
    const { date } = req.query;
    try {
        const data = await transactionService.getTransactionsByDate(req.user.id, date);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getTransactions,
    addTransaction,
    removeTransaction,
    updateTransaction,
    getTransactionByRange,
    getTransactionByDate
}
