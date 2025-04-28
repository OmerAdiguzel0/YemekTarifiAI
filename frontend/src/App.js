import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/HomePage';
import CreateRecipePage from './pages/recipes/CreateRecipePage';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    return isAuthenticated ? children : <Navigate to="/giris" />;
};

const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    return !isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route
                        path="/giris"
                        element={
                            <PublicRoute>
                                <LoginPage />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/kayit"
                        element={
                            <PublicRoute>
                                <RegisterPage />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <HomePage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/tarif-olustur"
                        element={
                            <PrivateRoute>
                                <CreateRecipePage />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
