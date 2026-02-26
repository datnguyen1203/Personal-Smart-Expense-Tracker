import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/', // URL của Backend Node.js
    // baseURL: 'https://personal-smart-expense-tracker.onrender.com/', // URL của Backend Node.js
});

export default API;