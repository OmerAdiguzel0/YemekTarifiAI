import axios from 'axios';
import { API_URL } from '../config';

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
            
            console.log('API login response:', response.data);
            console.log('Response user data:', response.data.user);
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                
                // Kullanıcı bilgilerini kontrol et
                if (!response.data.user) {
                    console.error('Backend yanıtında kullanıcı bilgileri eksik');
                    throw new Error('Kullanıcı bilgileri alınamadı');
                }

                if (!response.data.user.id) {
                    console.error('Backend yanıtında kullanıcı ID eksik');
                    throw new Error('Kullanıcı ID bilgisi alınamadı');
                }
                
                const userData = {
                    token: response.data.token,
                    user: response.data.user
                };
                
                console.log('Processed login data:', userData);
                return userData;
            }
            
            throw new Error('Token alınamadı');
        } catch (error) {
            console.error('Login error:', error);
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