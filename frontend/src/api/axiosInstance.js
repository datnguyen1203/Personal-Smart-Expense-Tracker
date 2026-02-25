import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/', // URL của Backend Node.js
});

export default API;