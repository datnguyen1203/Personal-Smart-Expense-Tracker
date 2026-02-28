const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true }, // Thu hay Chi
    category: { type: String, default: 'General' }, // Ăn uống, Xăng xe...
    date: { type: Date, default: Date.now },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);