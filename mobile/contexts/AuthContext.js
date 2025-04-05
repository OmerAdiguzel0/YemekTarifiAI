import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// API_URL'yi güncelleyin - localhost yerine gerçek IP adresinizi kullanın
const API_URL = 'http://192.168.1.61:5001'; // IP adresinizi buraya yazın

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Uygulama başladığında token kontrolü
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await fetchUserData(token);
      }
    } catch (error) {
      console.error('Token yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          'x-auth-token': token
        }
      });
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Kullanıcı bilgileri alınamadı:', error);
      await AsyncStorage.removeItem('token');
      setCurrentUser(null);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);
      setCurrentUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Giriş yapılırken bir hata oluştu');
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        username,
        email,
        password
      });
      
      const { token, user } = response.data;
      await AsyncStorage.setItem('token', token);
      setCurrentUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Kayıt olurken bir hata oluştu');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setCurrentUser(null);
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};