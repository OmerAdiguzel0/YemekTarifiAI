import { LogBox, ScrollView } from 'react-native';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import RecipeGenerator from '../src/components/RecipeGenerator';
import RecipeList from '../src/components/RecipeList';
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';

LogBox.ignoreLogs(['props.pointerEvents']);

export default function HomeScreen() {
  const { currentUser, loading, logout } = useAuth();
  const router = useRouter();

  // Yönlendirme mantığı AuthContext'e taşındı, burada sadece logout işlemi kalıyor
  const handleLogout = async () => {
    await logout();
    // router.replace('/login'); - Bu satırı kaldırıyoruz, AuthContext otomatik yönlendirecek
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  if (!currentUser) {
    return null; // AuthContext otomatik olarak login sayfasına yönlendirecek
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header'ı geçici olarak kaldırıyoruz */}
      
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tarif Oluşturucu</Text>
          <RecipeGenerator />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kaydedilmiş Tarifler</Text>
          <RecipeList />
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50', // Yeşil renk
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  welcomeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  }
});