import axios from 'axios';

const API = axios.create({
    // baseURL: 'http://localhost:5000/', // URL của Backend Node.js
    baseURL: 'https://personal-smart-expense-tracker.onrender.com/', // URL của Backend Node.js
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;