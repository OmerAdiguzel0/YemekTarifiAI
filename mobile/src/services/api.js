import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token'ı header'a ekle
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    // Kullanıcı kaydı
    register: async (userData) => {
        try {
            console.log('API isteği gönderiliyor:', userData);
            const response = await api.post('/auth/register', userData);
            console.log('API yanıtı:', response.data);
            return response.data;
        } catch (error) {
            console.error('API hatası:', error.response?.data || error.message);
            if (error.response) {
                throw error.response.data;
            } else if (error.request) {
                throw { error: 'Sunucuya ulaşılamıyor' };
            } else {
                throw { error: error.message };
            }
        }
    },

    // Kullanıcı girişi
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            await AsyncStorage.setItem('token', response.data.token);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Giriş yapılırken bir hata oluştu' };
        }
    },

    // Kullanıcı çıkışı
    logout: async () => {
        try {
            await api.get('/auth/cikis');
            await AsyncStorage.removeItem('token');
        } catch (error) {
            throw error.response.data;
        }
    }
};

export const recipeService = {
    // Yeni tarif oluştur
    createRecipe: async (recipeData) => {
        try {
            const response = await api.post('/recipe/create', recipeData);
            return response.data;
        } catch (error) {
            console.error('Tarif oluşturma hatası:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Tarif oluşturulurken bir hata oluştu' };
        }
    },

    // Kullanıcının tariflerini getir
    getUserRecipes: async () => {
        try {
            const response = await api.get('/recipe/user-recipes');
            return response.data;
        } catch (error) {
            console.error('Tarifleri getirme hatası:', error.response?.data || error.message);
            throw error.response?.data || { error: 'Tarifler getirilirken bir hata oluştu' };
        }
    }
};

// Topluluk tariflerini listele
export const getCommunityRecipes = async () => {
    try {
        const response = await api.get('/community/recipes');
        return response.data;
    } catch (error) {
        console.error('getCommunityRecipes error:', error.response?.data || error.message);
        throw error.response?.data || { error: 'Topluluk tarifleri alınamadı' };
    }
};

// Yeni topluluk tarifi oluştur
export const createCommunityRecipe = async (recipeData) => {
    try {
        const response = await api.post('/community/recipes', recipeData);
        return response.data;
    } catch (error) {
        console.error('createCommunityRecipe error:', error.response?.data || error.message);
        throw error.response?.data || { error: 'Tarif oluşturulamadı' };
    }
};

// Tarifi beğen
export const likeCommunityRecipe = async (recipeId) => {
    try {
        const response = await api.post(`/community/recipes/${recipeId}/like`);
        return response.data;
    } catch (error) {
        console.error('likeCommunityRecipe error:', error.response?.data || error.message);
        throw error.response?.data || { error: 'Tarif beğenilemedi' };
    }
};

// Tarifi kaydet
export const saveCommunityRecipe = async (recipeId) => {
    try {
        const response = await api.post(`/community/recipes/${recipeId}/save`);
        return response.data;
    } catch (error) {
        console.error('saveCommunityRecipe error:', error.response?.data || error.message);
        throw error.response?.data || { error: 'Tarif kaydedilemedi' };
    }
};

// Kendi topluluk tariflerini getir
export const getMyCommunityRecipes = async () => {
    try {
        const response = await api.get('/community/recipes/mine');
        return response.data;
    } catch (error) {
        console.error('getMyCommunityRecipes error:', error.response?.data || error.message);
        throw error.response?.data || { error: 'Kendi topluluk tariflerin alınamadı' };
    }
};

// Topluluk tarifini güncelle
export const updateCommunityRecipe = async (id, data) => {
    try {
        const response = await api.put(`/community/recipes/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('updateCommunityRecipe error:', error.response?.data || error.message);
        throw error.response?.data || { error: 'Tarif güncellenemedi' };
    }
};

// Topluluk tarifini sil
export const deleteCommunityRecipe = async (id) => {
    try {
        console.log('deleteCommunityRecipe çağrıldı, ID:', id);
        console.log('API URL:', `${API_URL}/community/recipes/${id}`);
        const response = await api.delete(`/community/recipes/${id}`);
        console.log('API yanıtı:', response.data);
        return response.data;
    } catch (error) {
        console.error('deleteCommunityRecipe hatası:', error);
        console.error('Hata detayları:', {
            response: error.response?.data,
            status: error.response?.status,
            message: error.message
        });
        throw error.response?.data || { error: 'Tarif silinemedi' };
    }
}; 