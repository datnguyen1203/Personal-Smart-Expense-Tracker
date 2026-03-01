import API from './axiosInstance';

export const fetchTransactions = () => API.get('/transactions');
export const addTransaction = (data) => API.post('/transactions', data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);
export const updateTransaction = (id, data) => API.put(`/transactions/${id}`, data);
export const fetchTransactionsByDate = (date) =>
    API.get('/transactions/by-date', { params: { date } });