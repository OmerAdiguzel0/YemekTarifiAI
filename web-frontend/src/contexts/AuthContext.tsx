'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth';
import { User, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = AuthService.getToken();
        
        if (token) {
          const user = await AuthService.getCurrentUser(token);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Kimlik doğrulama hatası'
        });
        AuthService.removeToken();
      }
    };

    initAuth();
  }, []);

  const login = () => {
    AuthService.loginWithGoogle();
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      AuthService.removeToken();
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      router.push('/giris');
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: 'Çıkış yapılırken bir hata oluştu'
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 