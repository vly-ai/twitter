import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosInstance;