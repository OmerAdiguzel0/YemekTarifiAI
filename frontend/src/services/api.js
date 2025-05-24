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

// Yorumları listele
export const getComments = async (recipeId) => {
    try {
        const response = await api.get(`/community/recipes/${recipeId}/comments`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Yorumlar alınamadı' };
    }
};

// Yorum ekle
export const addComment = async (recipeId, text, parentCommentId = null) => {
    try {
        const body = { text };
        if (parentCommentId) body.parentCommentId = parentCommentId;
        const response = await api.post(`/community/recipes/${recipeId}/comments`, body);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Yorum eklenemedi' };
    }
};

// Yorum sil
export const deleteComment = async (commentId) => {
    try {
        const response = await api.delete(`/community/recipes/comments/${commentId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Yorum silinemedi' };
    }
};

// Yorum güncelle
export const updateComment = async (commentId, text) => {
    try {
        const response = await api.put(`/community/recipes/comments/${commentId}`, { text });
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Yorum güncellenemedi' };
    }
};

// Yorum beğen veya beğeniyi kaldır
export const likeComment = async (commentId) => {
    try {
        const response = await api.post(`/community/recipes/comments/${commentId}/like`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { error: 'Yorum beğenilemedi' };
    }
};

export default api; 