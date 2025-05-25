import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import { useAuth } from '../../App';

const ProfileScreen = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1]));
      setEmail(payload.email);
      setUsername(payload.username);
      setNewUsername(payload.username);
    } catch (e) {
      setEmail('');
      setUsername('');
      setNewUsername('');
    }
  };

  const handleChangeUsername = async () => {
    if (!newUsername) {
      Alert.alert('Hata', 'Lütfen yeni kullanıcı adını girin');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('change-username newUsername:', newUsername);
      console.log('change-username Authorization:', `Bearer ${token}`);
      const res = await fetch(`${API_URL}/auth/change-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newUsername })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Kullanıcı adı değiştirilemedi');
      
      // Yeni token'ı kaydet
      await signIn(data.token);
      
      Alert.alert(
        'Başarılı',
        'Kullanıcı adınız başarıyla değiştirildi',
        [
          {
            text: 'Tamam',
            onPress: () => {
              setNewUsername('');
              getUserInfo();
            }
          }
        ]
      );
    } catch (err) {
      Alert.alert('Hata', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !newPasswordRepeat) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }
    if (newPassword !== newPasswordRepeat) {
      Alert.alert('Hata', 'Yeni şifreler aynı değil');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Şifre değiştirilemedi');
      
      Alert.alert(
        'Başarılı',
        'Şifreniz başarıyla değiştirildi',
        [
          {
            text: 'Tamam',
            onPress: () => {
              setCurrentPassword('');
              setNewPassword('');
              setNewPasswordRepeat('');
            }
          }
        ]
      );
    } catch (err) {
      Alert.alert('Hata', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{email}</Text>

      <Text style={styles.sectionTitle}>Kullanıcı Adı Değiştir</Text>
      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı"
        value={newUsername}
        onChangeText={setNewUsername}
        autoCapitalize="none"
      />
      <TouchableOpacity 
        style={[styles.button, styles.usernameButton]} 
        onPress={handleChangeUsername} 
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Değiştiriliyor...' : 'Kullanıcı Adını Değiştir'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Şifre Değiştir</Text>
      <TextInput
        style={styles.input}
        placeholder="Mevcut Şifre"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Yeni Şifre"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Yeni Şifre (Tekrar)"
        secureTextEntry
        value={newPasswordRepeat}
        onChangeText={setNewPasswordRepeat}
      />
      <TouchableOpacity 
        style={[styles.button, styles.passwordButton]} 
        onPress={handleChangePassword} 
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#3949ab',
  },
  label: {
    fontSize: 16,
    color: '#888',
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#3949ab',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    color: '#3949ab',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  usernameButton: {
    backgroundColor: '#0089df',
  },
  passwordButton: {
    backgroundColor: '#3949ab',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen; 