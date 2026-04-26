import axios from 'axios';
import { useAuth } from '../store/authStore';

const api = axios.create({
    baseURL: window.location.href.includes('localhost')
        ? 'http://localhost:8000'
        : '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});
let isRefreshing = false;
let failedQueue: any = [];
const processQueue = (error: any) => {
    failedQueue.forEach((prom: any) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};


const handleLogout = () => {
    useAuth.getState().logOut();
    window.location.href = '/admin-login';
}
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (!error.response) {
            console.error('Network error - no response from server: ', error.message);
            return Promise.reject(error)
        }

        if (originalRequest.url?.includes('/auth/refresh')) {
            const errorCode = error.response?.data?.code;
            const unrecoverableError = ['NO_TOKEN', 'REFRESH_TOKEN_EXPIRED', 'INVALID_REFRESH_TOKEN'];

            if (unrecoverableError.includes(errorCode)) {
                console.log('Unrecoverable auth error from refresh:', errorCode);
                handleLogout();
            }

            return Promise.reject(error);
        }

        const errorCode = error.response?.data?.code
        // const status = error.response?.status
        const unrecoverableError = ['NO_TOKEN', 'REFRESH_TOKEN_EXPIRED', 'INVALID_REFRESH_TOKEN'];
        if (unrecoverableError.includes(errorCode)) {
            console.log('Unrecoverable auth error: ', errorCode);
            handleLogout();
            return Promise.reject(error)
        }


        const recoverableError = ['NO_ACCESS_TOKEN']

        if (recoverableError.includes(errorCode) && !originalRequest._retry) {
            originalRequest._retry = true;
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            isRefreshing = true;
            try {
                console.log('Attempting to refresh access token...');

                // Call refresh endpoint - it sets new httpOnly cookie
                await api.get('/auth/refresh');

                console.log('Token refreshed successfully');

                // Process queued requests
                processQueue(null);
                isRefreshing = false;

                // Retry original request with new cookie
                return api(originalRequest);

            } catch (refreshError) {
                console.error('Refresh failed:', refreshError);

                // Reject all queued requests
                processQueue(refreshError);
                isRefreshing = false;

                // Handle logout
                handleLogout();

                return Promise.reject(refreshError);
            }
        }



        return Promise.reject(error);

    }
)

export default api;