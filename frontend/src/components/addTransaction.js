import { PlusCircle } from "lucide-react";
import { addTransaction } from "../api/transactionApi";
import { useState } from "react";

const AddTransaction = ({ onAddedData, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Ăn uống',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gọi API để thêm giao dịch mới
            await addTransaction({ ...formData, amount: Number(formData.amount) });

            // Reset form data
            setFormData({
                title: '',
                amount: '',
                type: 'expense',
                category: 'Ăn uống',
            });

            onAddedData(); // Gọi callback để reload dữ liệu
            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error("Error adding transaction:", error);
        }
    }

    return (
        <div className="space-y-5">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
                <PlusCircle className="text-green-600" size={28} /> Thêm giao dịch mới
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">📝 Tên giao dịch</label>
                    <input type="text"
                        placeholder="VD: Mua cơm, Xăng xe..."
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="w-full border border-green-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">💰 Số tiền (VNĐ)</label>
                    <input type="number"
                        placeholder="0"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                        className="w-full border border-green-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Loại</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full border border-green-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                            className="w-full border border-green-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                        className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-lg"
                    >
                        ✓ Thêm giao dịch
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddTransaction