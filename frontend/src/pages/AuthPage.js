import { useState } from 'react';
import { loginUser, registerUser } from '../api/authApi';

const AuthPage = ({ onAuthSuccess }) => {
    const [mode, setMode] = useState('login');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleMode = () => {
        setError('');
        setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const payload = {
                email: formData.email.trim(),
                password: formData.password
            };
            if (mode === 'register') {
                payload.name = formData.name.trim();
            }

            const res = mode === 'register'
                ? await registerUser(payload)
                : await loginUser(payload);

            onAuthSuccess(res.data);
        } catch (err) {
            const message = err?.response?.data?.message || 'Xảy ra lỗi, vui lòng thử lại.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-green-100">
                <div className="text-center mb-6">
                    <div className="inline-block p-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-3">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                        {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                    </h1>
                    <p className="text-sm text-gray-600">
                        {mode === 'login'
                            ? 'Chào mừng bạn quay lại!'
                            : 'Tạo tài khoản để quản lý chi tiêu.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <input
                                type="text"
                                placeholder="Nhập họ và tên"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            placeholder="Nhập email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            minLength={6}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg flex items-start gap-2">
                            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {isLoading
                            ? '⏳ Đang xử lý...'
                            : mode === 'login' ? '✓ Đăng nhập' : '✓ Đăng ký'}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-200 text-sm text-gray-600 text-center">
                    {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                    <button
                        onClick={toggleMode}
                        className="ml-2 text-green-600 hover:text-green-700 font-semibold transition hover:underline"
                    >
                        {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
