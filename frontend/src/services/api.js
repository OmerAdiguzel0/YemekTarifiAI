import axios from 'axios';

const API_URL = 'http://192.168.1.101:5002/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token'ı request header'larına ekle
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (credentials) => {
        try {
            const { sifre, ...rest } = credentials;
            const response = await api.post('/auth/login', {
                ...rest,
                password: sifre
            });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'Giriş yapılırken bir hata oluştu');
            }
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'Kayıt olurken bir hata oluştu');
            }
            throw error;
        }
    },

    logout: async () => {
        localStorage.removeItem('token');
    }
};

export default api; 