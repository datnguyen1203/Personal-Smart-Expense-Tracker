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
                category: 'General',
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
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <PlusCircle className="text-green-600" /> Nhập chi tiêu
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text"
                    placeholder="Tên giao dịch mới"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input type="number"
                    placeholder="Số tiền"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="income">Thu</option>
                    <option value="expense">Chi</option>
                </select>
                <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="Food">Ăn uống</option>
                    <option value="Transport">Di chuyển</option>
                    <option value="Shopping">Mua sắm</option>
                    <option value="Salary">Lương/Thưởng</option>
                    <option value="Other">Khác</option>
                </select>

                <div className="flex justify-end gap-2 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                    >
                        Thêm giao dịch
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddTransaction