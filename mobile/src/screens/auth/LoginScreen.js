import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { authService } from '../../services/api';
import { useAuth } from '../../../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [sifre, setSifre] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();

    const handleLogin = async () => {
        if (!email || !sifre) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password: sifre
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Giriş yapılırken bir hata oluştu');
            }

            // Token'ı sakla
            await AsyncStorage.setItem('token', data.token);
            
            // Auth context'i güncelle
            await signIn(data.token);

            console.log('Giriş başarılı:', data);
        } catch (error) {
            Alert.alert('Hata', error.message);
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>YemekTarifiAI</Text>
                    <Text style={styles.subtitle}>Yapay zeka ile yemek tarifleri</Text>
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Giriş Yap</Text>
                    
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email adresinizi girin"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#999"
                        />
                    </View>
                    
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Şifre</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Şifrenizi girin"
                            value={sifre}
                            onChangeText={setSifre}
                            secureTextEntry
                            placeholderTextColor="#999"
                        />
                    </View>
                    
                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.registerLink}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.registerText}>
                            Hesabınız yok mu? <Text style={styles.registerTextBold}>Kayıt olun</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5'
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a237e',
        marginBottom: 8
    },
    subtitle: {
        fontSize: 16,
        color: '#5c6bc0'
    },
    formContainer: {
        backgroundColor: '#ffffff',
        padding: 25,
        marginHorizontal: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a237e',
        marginBottom: 30,
        textAlign: 'center'
    },
    inputContainer: {
        marginBottom: 20
    },
    label: {
        fontSize: 14,
        color: '#1a237e',
        marginBottom: 8,
        fontWeight: '500'
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#f8f9fa',
        color: '#1a237e'
    },
    button: {
        backgroundColor: '#3949ab',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#3949ab',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5
    },
    buttonDisabled: {
        backgroundColor: '#b0bec5'
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    registerLink: {
        marginTop: 20,
        alignItems: 'center'
    },
    registerText: {
        color: '#5c6bc0',
        fontSize: 14
    },
    registerTextBold: {
        color: '#3949ab',
        fontWeight: 'bold'
    }
});

export default LoginScreen; 