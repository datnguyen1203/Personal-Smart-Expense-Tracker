import { Edit3 } from "lucide-react";
import { updateTransaction } from "../api/transactionApi";
import { useState } from "react";

const EditTransaction = ({ transaction, onEditedData, onClose }) => {
    const [formData, setFormData] = useState({
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateTransaction(transaction._id, {
                ...formData,
                amount: Number(formData.amount)
            });
            onEditedData();
            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error("Error updating transaction:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-5">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
                <Edit3 className="text-blue-600" size={28} /> Chỉnh sửa giao dịch
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">📝 Tên giao dịch</label>
                    <input type="text"
                        placeholder="VD: Mua cơm, Xăng xe..."
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">💰 Số tiền (VNĐ)</label>
                    <input type="number"
                        placeholder="0"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                        className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Loại</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        >
                            <option value="income">📈 Thu</option>
                            <option value="expense">📉 Chi</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Danh mục</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full border border-blue-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        >
                            <option value="Ăn uống">🍽️ Ăn uống</option>
                            <option value="Di chuyển">🚗 Di chuyển</option>
                            <option value="Mua sắm">🛍️ Mua sắm</option>
                            <option value="Lương/Thưởng">💵 Lương/Thưởng</option>
                            <option value="Khác">📌 Khác</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-700 hover:to-cyan-700 transition shadow-lg disabled:opacity-50"
                    >
                        {isLoading ? '⏳ Đang cập nhật...' : '✓ Cập nhật giao dịch'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditTransaction
