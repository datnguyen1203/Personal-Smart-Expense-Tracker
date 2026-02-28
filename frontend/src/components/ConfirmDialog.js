import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, isLoading = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-red-100 animate-in">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-red-100">
                        <AlertTriangle className="text-red-600" size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{message}</p>
                    </div>
                </div>

                <div className="flex gap-3 mt-6 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '⏳ Đang xóa...' : '✓ Xóa'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
