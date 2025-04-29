import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            setIsAuthenticated(!!token);
            if (userData) {
                const parsedUserData = JSON.parse(userData);
                console.log('Loaded user data from localStorage:', parsedUserData);
                setUser(parsedUserData);
            }
        } catch (error) {
            console.error('Auth check error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (userData) => {
        console.log('Signing in with user data:', userData);
        
        if (!userData || !userData.id) {
            console.error('Geçersiz kullanıcı bilgileri:', userData);
            throw new Error('Geçersiz kullanıcı bilgileri');
        }
        
        const userDataWithId = {
            ...userData,
            _id: userData.id
        };
        
        console.log('Processed user data:', userDataWithId);
        
        setIsAuthenticated(true);
        setUser(userDataWithId);
        localStorage.setItem('user', JSON.stringify(userDataWithId));
        
        const savedUserData = localStorage.getItem('user');
        console.log('Saved user data in localStorage:', JSON.parse(savedUserData));
    };

    const signOut = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    };

    const value = {
        isAuthenticated,
        isLoading,
        user,
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