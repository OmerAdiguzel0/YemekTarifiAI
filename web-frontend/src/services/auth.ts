import { User } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const AuthService = {
  // Google ile giriş başlat
  loginWithGoogle: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  // Token ile kullanıcı bilgilerini getir
  getCurrentUser: async (token: string): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Kullanıcı bilgileri alınamadı');
    }

    return response.json();
  },

  // Çıkış yap
  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Çıkış yapılırken bir hata oluştu');
    }

    return response.json();
  },

  // Token'ı local storage'a kaydet
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  // Token'ı local storage'dan al
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  // Token'ı local storage'dan sil
  removeToken: () => {
    localStorage.removeItem('token');
  }
}; 