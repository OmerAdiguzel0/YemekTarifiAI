import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../App';
import { API_URL } from '../config';

export default function HomeScreen({ navigation }) {
    const { signOut } = useAuth();

    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                await signOut();
                return;
            }

            // Token'ın geçerliliğini kontrol et
            const response = await fetch(`${API_URL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 403) {
                await signOut();
                Alert.alert('Oturum Süresi Doldu', 'Lütfen tekrar giriş yapın.');
            }
        } catch (error) {
            console.error('Token kontrol hatası:', error);
        }
    };

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.welcomeText}>Hoş Geldiniz!</Text>
                <Text style={styles.subtitle}>
                    Yapay zeka destekli tarif asistanınız size yardımcı olmak için hazır.
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('CreateRecipe')}
                >
                    <Text style={styles.buttonText}>Yeni Tarif Oluştur</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.savedRecipesButton]}
                    onPress={() => navigation.navigate('SavedRecipes')}
                >
                    <Text style={styles.buttonText}>Kayıtlı Tariflerim</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.logoutButton]}
                    onPress={handleLogout}
                >
                    <Text style={styles.buttonText}>Çıkış Yap</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
        padding: 20,
        justifyContent: 'center'
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a237e',
        textAlign: 'center',
        marginBottom: 10
    },
    subtitle: {
        fontSize: 16,
        color: '#5c6bc0',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22
    },
    button: {
        backgroundColor: '#3949ab',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 15
    },
    logoutButton: {
        backgroundColor: '#f44336'
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600'
    },
    savedRecipesButton: {
        backgroundColor: '#4caf50'
    }
});