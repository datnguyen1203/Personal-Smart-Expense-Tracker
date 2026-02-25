const transactionService = require('../services/transactionService');

const getTransactions = async (req, res) => {
    try {
        const data = await transactionService.getTransactions();
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addTransaction = async (req, res) => {
    try {
        const savedData = await transactionService.createTransaction(req.body);
        res.status(201).json(savedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const removeTransaction = async (req, res) => {
    try {
        const deletedData = await transactionService.deleteTransaction(req.params.id);
        if (deletedData) {
            res.status(200).json({ message: 'Transaction deleted successfully' });
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getTransactions,
    addTransaction,
    removeTransaction
}