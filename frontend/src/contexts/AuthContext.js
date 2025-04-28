import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            setIsAuthenticated(!!token);
        } catch (error) {
            console.error('Auth check error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async () => {
        setIsAuthenticated(true);
    };

    const signOut = async () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    const value = {
        isAuthenticated,
        isLoading,
        signIn,
        signOut
    };

    if (isLoading) {
        return null;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 