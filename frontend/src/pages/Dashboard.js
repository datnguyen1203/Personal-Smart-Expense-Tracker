import React, { useCallback, useEffect, useState } from 'react';
import { fetchTransactions, deleteTransaction } from '../api/transactionApi';
import { PlusCircle, Trash2, Wallet } from 'lucide-react';
import AddTransaction from '../components/addTransaction';
import ConfirmDialog from '../components/ConfirmDialog';
import { CategoryHorizontalBar, WeeklyLineChart, WeekStrip } from '../components/Charts';

const Dashboard = ({ user, onLogout }) => {
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const itemsPerPage = 5;

    // Default to today's day of week (0=T2, 1=T3, ..., 6=CN)
    const getTodayWeekDay = () => {
        const today = new Date().getDay();
        return today === 0 ? 6 : today - 1;
    };
    const [selectedWeekDay, setSelectedWeekDay] = useState(getTodayWeekDay());

    const loadData = useCallback(async () => {
        try {
            const res = await fetchTransactions();
            setTransactions(res.data);
            setCurrentPage(1); // Reset pagination on data reload
        } catch (error) {
            if (error?.response?.status === 401 && onLogout) {
                onLogout();
            }
        }
    }, [onLogout]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const showFormAdd = () => setIsModalOpen(true);
    const closeFormAdd = () => setIsModalOpen(false);

    const handleSelectDay = (dayIndex) => {
        setSelectedWeekDay(dayIndex); // Always select, never deselect
        setCurrentPage(1); // Reset page when changing day
    };

    // Filter transactions by selected day (always)
    const filteredTransactions = transactions.filter(t => {
        const txDay = new Date(t.date).getDay();
        const adjustedDay = txDay === 0 ? 6 : txDay - 1; // Convert: 0=CN→6, 1=T2→0, etc.
        return adjustedDay === selectedWeekDay;
    });

    // Pagination
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1));
    };

    const handleDeleteClick = (id) => {
        setItemToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        try {
            await deleteTransaction(itemToDelete);
            loadData();
            setIsDeleteConfirmOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error("Error deleting transaction:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteConfirmOpen(false);
        setItemToDelete(null);
    };

    // Tính toán tổng số dư
    const totalBalance = transactions.reduce((acc, item) =>
        item.type === 'income' ? acc + item.amount : acc - item.amount, 0);

    // Tính toán tổng chi tiêu của ngày được chọn
    const totalDaySpending = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 min-h-screen p-3 sm:p-4 md:p-6">
            {/* Header với tiêu đề và nút thêm */}
            <div className="flex items-center justify-between flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2 sm:gap-3">
                    <div className='bg-gradient-to-br from-green-600 to-emerald-600 p-2 sm:p-3 rounded-full shadow-lg'>
                        <Wallet className="text-white" size={24} />
                    </div>
                    Quản lý chi tiêu
                </h1>
                <div className="flex items-center gap-2">
                    {user?.name && (
                        <span className="text-xs sm:text-sm text-gray-700 font-medium bg-white px-3 py-2 rounded-lg shadow-sm">👋 {user.name}</span>
                    )}
                    <button onClick={showFormAdd} className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition text-sm sm:text-base whitespace-nowrap font-semibold">
                        <PlusCircle size={16} className="sm:w-[18px]" /> Thêm
                    </button>
                    <button onClick={onLogout} className="flex items-center gap-1 sm:gap-2 bg-red-100 text-red-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-200 transition text-sm sm:text-base whitespace-nowrap font-semibold">
                        Đăng xuất
                    </button>
                </div>
            </div>

            {/* Thẻ tổng kết */}
            <div className="md:w-fit bg-gradient-to-br from-green-600 to-emerald-600 text-white p-4 sm:p-6 rounded-2xl shadow-2xl mb-4 sm:mb-6 border border-green-400">
                <p className="text-xs sm:text-sm opacity-90 uppercase tracking-wider font-semibold">💰 Tổng số dư</p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1">{totalBalance.toLocaleString()} VNĐ</h2>
            </div>

            {/* Biểu đồ */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6'>
                <div className='p-4 sm:p-5 rounded-xl shadow-md border border-green-100 bg-white hover:shadow-lg transition'>
                    <h4 className="font-bold text-sm sm:text-base mb-3 text-green-700">📊 Chi tiêu theo danh mục</h4>
                    <div className=''>
                        <CategoryHorizontalBar transactions={transactions} />
                    </div>
                </div>
                <div className='p-4 sm:p-5 rounded-xl shadow-md border border-green-100 bg-white hover:shadow-lg transition'>
                    <h4 className="font-bold text-sm sm:text-base mb-3 text-green-700">📈 Xu hướng trong tuần</h4>
                    <div className=''>
                        <WeeklyLineChart transactions={transactions} />
                    </div>
                </div>

            </div>

            {/* Danh sách giao dịch */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border border-green-100">
                <div className="p-3 sm:p-4 border-b border-green-100 font-bold text-xs sm:text-sm bg-gradient-to-r from-green-50 to-emerald-50 flex justify-between items-center text-green-700">
                    <span>📅 Giao dịch {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][selectedWeekDay]}</span>
                </div>
                {/* Lịch tuần */}
                <div className='p-3 sm:p-4 border-b border-green-100 bg-green-50'>
                    <h4 className="font-bold text-xs sm:text-sm mb-2 text-green-700">📆 Lịch chi tiêu trong tuần</h4>
                    <WeekStrip transactions={transactions} selectedDay={selectedWeekDay} onSelectDay={handleSelectDay} />
                </div>

                {/* Tổng tiền chi tiêu trong ngày */}
                <div className="p-3 sm:p-4 border-b border-green-100 bg-gradient-to-r from-red-50 to-red-100">
                    <p className="font-semibold md:text-xl sm:text-sm text-red-700">💸 Tổng chi tiêu hôm nay: <span className="font-bold text-2xl text-red-600">{totalDaySpending.toLocaleString()} VNĐ</span></p>
                </div>

                {/* Danh sách scrollable với chiều cao cố định */}
                <ul className="overflow-y-auto ">
                    {paginatedTransactions.length > 0 ? paginatedTransactions.map((t) => (
                        <li key={t._id} className="p-2 sm:p-3 border-b flex justify-between items-start sm:items-center hover:bg-gray-50 transition text-xs sm:text-sm gap-2">
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 truncate">{t.title}</p>
                                <p className="text-xs text-gray-500 truncate">{t.category} • {new Date(t.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`font-bold text-xs sm:text-sm whitespace-nowrap ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
                                </span>
                                <button onClick={() => handleDeleteClick(t._id)} className="text-gray-400 hover:text-red-500 transition">
                                    <Trash2 size={14} className="sm:w-4" />
                                </button>
                            </div>
                        </li>
                    )) : (
                        <li className="p-3 sm:p-4 text-center text-gray-500 text-xs sm:text-sm">Không có giao dịch</li>
                    )}
                </ul>

                {/* Phân trang */}
                <div className="p-2 sm:p-4 border-t border-green-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm bg-gradient-to-r from-green-50 to-emerald-50">
                    <span className="text-gray-600 order-2 sm:order-1">
                        {filteredTransactions.length > 0
                            ? `${startIndex + 1}-${Math.min(endIndex, filteredTransactions.length)} / ${filteredTransactions.length}`
                            : '0 / 0'
                        }
                    </span>
                    <div className="flex gap-1 sm:gap-2 order-1 sm:order-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="px-2 sm:px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs sm:text-base"
                        >
                            ← <span className="hidden sm:inline">Trước</span>
                        </button>
                        <span className="px-2 sm:px-3 py-1 text-gray-700 text-xs sm:text-base">
                            {totalPages > 0 ? `T${currentPage}/${totalPages}` : '0/0'}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-2 sm:px-3 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition text-xs sm:text-base"
                        >
                            <span className="hidden sm:inline">Sau</span> →
                        </button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <AddTransaction
                            onAddedData={loadData}
                            onClose={closeFormAdd}
                        />
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={isDeleteConfirmOpen}
                title="Xóa giao dịch"
                message="Bạn có chắc chắn muốn xóa giao dịch này? Hành động này không thể hoàn tác."
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default Dashboard;