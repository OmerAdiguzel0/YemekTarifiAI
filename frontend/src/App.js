import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/HomePage';
import CreateRecipePage from './pages/recipes/CreateRecipePage';
import SavedRecipesPage from './pages/recipes/SavedRecipesPage';
import RecipeDetailPage from './pages/recipes/RecipeDetailPage';
import CommunityRecipesPage from './pages/recipes/CommunityRecipesPage';
import CommunityRecipeSharePage from './pages/recipes/CommunityRecipeSharePage';
import MyCommunityRecipesPage from './pages/recipes/MyCommunityRecipesPage';
import EditCommunityRecipePage from './pages/recipes/EditCommunityRecipePage';
import ProfilePage from './pages/ProfilePage';

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
                    <Route
                        path="/kaydedilen-tarifler"
                        element={
                            <PrivateRoute>
                                <SavedRecipesPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/tarif/:id"
                        element={
                            <PrivateRoute>
                                <RecipeDetailPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/topluluk-tarifleri"
                        element={
                            <PrivateRoute>
                                <CommunityRecipesPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/tarif-paylas"
                        element={
                            <PrivateRoute>
                                <CommunityRecipeSharePage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/topluluk-tariflerim"
                        element={
                            <PrivateRoute>
                                <MyCommunityRecipesPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/topluluk-tariflerim/duzenle/:id"
                        element={
                            <PrivateRoute>
                                <EditCommunityRecipePage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profil"
                        element={
                            <PrivateRoute>
                                <ProfilePage />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </Router>
  );
}

export default App;
