import React, { useEffect, useState, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import CreateRecipeScreen from './src/screens/CreateRecipeScreen';
import SavedRecipesScreen from './src/screens/SavedRecipesScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import CommunityRecipesScreen from './src/screens/CommunityRecipesScreen';
import CommunityRecipeDetailScreen from './src/screens/CommunityRecipeDetailScreen';
import CommunityRecipeShareScreen from './src/screens/CommunityRecipeShareScreen';
import MyCommunityRecipesScreen from './src/screens/MyCommunityRecipesScreen';
import EditCommunityRecipeScreen from './src/screens/EditCommunityRecipeScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            setIsAuthenticated(!!token);
        } catch (error) {
            console.error('Error checking auth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const authContext = {
        signIn: async (token) => {
            try {
                await AsyncStorage.setItem('token', token);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Token saklama hatası:', error);
                Alert.alert('Hata', 'Giriş yapılırken bir hata oluştu');
            }
        },
        signOut: async () => {
            try {
                await AsyncStorage.removeItem('token');
                setIsAuthenticated(false);
            } catch (error) {
                console.error('Token silme hatası:', error);
            }
        }
    };

    if (isLoading) {
        return null;
    }

    const commonHeaderStyle = {
        headerStyle: {
            backgroundColor: '#3949ab',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    };

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {!isAuthenticated ? (
                        <>
                            <Stack.Screen name="Login" component={LoginScreen} />
                            <Stack.Screen name="Register" component={RegisterScreen} />
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="Home" component={HomeScreen} />
                            <Stack.Screen 
                                name="CreateRecipe" 
                                component={CreateRecipeScreen}
                                options={{
                                    headerShown: true,
                                    title: 'Yeni Tarif Oluştur',
                                    ...commonHeaderStyle
                                }}
                            />
                            <Stack.Screen 
                                name="SavedRecipes" 
                                component={SavedRecipesScreen}
                                options={{
                                    headerShown: true,
                                    title: 'Kayıtlı Tariflerim',
                                    ...commonHeaderStyle
                                }}
                            />
                            <Stack.Screen 
                                name="RecipeDetail" 
                                component={RecipeDetailScreen}
                                options={{
                                    headerShown: true,
                                    title: 'Tarif Detayı',
                                    ...commonHeaderStyle
                                }}
                            />
                            <Stack.Screen 
                                name="CommunityRecipes" 
                                component={CommunityRecipesScreen}
                                options={{
                                    headerShown: true,
                                    title: 'Topluluk Tarifleri',
                                    ...commonHeaderStyle
                                }}
                            />
                            <Stack.Screen 
                                name="CommunityRecipeDetail" 
                                component={CommunityRecipeDetailScreen}
                                options={{
                                    headerShown: true,
                                    title: 'Tarif Detayı',
                                    ...commonHeaderStyle
                                }}
                            />
                            <Stack.Screen 
                                name="CommunityRecipeShare" 
                                component={CommunityRecipeShareScreen}
                                options={{
                                    headerShown: true,
                                    title: 'Tarif Paylaş',
                                    ...commonHeaderStyle
                                }}
                            />
                            <Stack.Screen 
                                name="MyCommunityRecipes" 
                                component={MyCommunityRecipesScreen}
                                options={{
                                    headerShown: true,
                                    title: 'Tariflerim',
                                    ...commonHeaderStyle
                                }}
                            />
                            <Stack.Screen 
                                name="EditCommunityRecipe" 
                                component={EditCommunityRecipeScreen}
                                options={{
                                    headerShown: true,
                                    title: 'Tarifi Düzenle',
                                    ...commonHeaderStyle
                                }}
                            />
                            <Stack.Screen 
                                name="Profil" 
                                component={ProfileScreen}
                                options={{
                                    headerShown: true,
                                    title: 'Profil',
                                    ...commonHeaderStyle
                                }}
                            />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </AuthContext.Provider>
    );
} 