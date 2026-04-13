import axios from 'axios';

const api = axios.create({
    baseURL: window.location.href.includes('localhost')
        ? 'http://localhost:8000'
        : 'https://bookish-server-s0os.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;