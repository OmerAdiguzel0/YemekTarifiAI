import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { authService } from '../../services/api';

const RegisterScreen = ({ navigation }) => {
    const [kullaniciAdi, setKullaniciAdi] = useState('');
    const [email, setEmail] = useState('');
    const [sifre, setSifre] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!kullaniciAdi || !email || !sifre) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
            return;
        }

        try {
            setLoading(true);
            console.log('Kayıt isteği gönderiliyor:', { kullaniciAdi, email, sifre });
            const response = await authService.register({
                username: kullaniciAdi,
                email,
                password: sifre
            });
            console.log('Kayıt başarılı:', response);
            navigation.navigate('Login');
        } catch (error) {
            console.error('Kayıt hatası:', error);
            Alert.alert('Hata', error.error || 'Kayıt olurken bir hata oluştu');
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
                    <Text style={styles.title}>Kayıt Ol</Text>
                    
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Kullanıcı Adı</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Kullanıcı adınızı girin"
                            value={kullaniciAdi}
                            onChangeText={setKullaniciAdi}
                            autoCapitalize="none"
                            placeholderTextColor="#999"
                        />
                    </View>
                    
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
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.loginLink}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.loginText}>
                            Zaten hesabınız var mı? <Text style={styles.loginTextBold}>Giriş yapın</Text>
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
    loginLink: {
        marginTop: 20,
        alignItems: 'center'
    },
    loginText: {
        color: '#5c6bc0',
        fontSize: 14
    },
    loginTextBold: {
        color: '#3949ab',
        fontWeight: 'bold'
    }
});

export default RegisterScreen; 