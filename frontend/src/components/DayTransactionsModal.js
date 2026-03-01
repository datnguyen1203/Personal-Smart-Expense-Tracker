import { X, Edit3, Trash2 } from 'lucide-react';

const DayTransactionsModal = ({ isOpen, selectedDate, transactions, onClose, onEdit, onDelete }) => {
    if (!isOpen) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b-2 border-blue-100">
                    <h2 className="text-2xl font-bold text-blue-700">
                        {formatDate(selectedDate)}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-xs text-green-700 font-semibold uppercase mb-1">Thu nhập</p>
                        <p className="text-xl font-bold text-green-600">+{totalIncome.toLocaleString()} VNĐ</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <p className="text-xs text-red-700 font-semibold uppercase mb-1">Chi tiêu</p>
                        <p className="text-xl font-bold text-red-600">-{totalExpense.toLocaleString()} VNĐ</p>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-2">
                    {transactions.length > 0 ? (
                        transactions.map(t => (
                            <div
                                key={t._id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                            >
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{t.title}</p>
                                    <div className="flex gap-3 text-xs text-gray-600 mt-1">
                                        <span className="bg-gray-100 px-2 py-1 rounded">{t.category}</span>
                                        <span className="bg-gray-100 px-2 py-1 rounded">
                                            {new Date(t.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 ml-4">
                                    <span className={`font-bold text-lg whitespace-nowrap ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
                                    </span>
                                    <button
                                        onClick={() => onEdit(t)}
                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                                    >
                                        <Edit3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(t._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">Không có giao dịch trong ngày này</p>
                        </div>
                    )}
                </div>

                {/* Close Button */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DayTransactionsModal;
