import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.101:5002/api'; // Backend API URL'si - IP adresinize göre değiştirin

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