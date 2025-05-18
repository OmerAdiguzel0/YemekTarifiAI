import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createCommunityRecipe } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommunityRecipeShareScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [preferences, setPreferences] = useState('');

  const handleShare = async () => {
    if (!title || !description || !ingredients || !steps) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }

    const username = await AsyncStorage.getItem('username');
    const recipeData = {
      title,
      description,
      ingredients: ingredients.split('\n').filter(item => item.trim()),
      steps: steps.split('\n').filter(item => item.trim()),
      preferences: preferences ? preferences.split('\n').filter(item => item.trim()) : [],
      username: username || ''
    };

    try {
      await createCommunityRecipe(recipeData);
      Alert.alert('Başarılı', 'Tarif başarıyla paylaşıldı!');
      navigation.navigate('CommunityRecipes', { refresh: true });
    } catch (err) {
      Alert.alert('Hata', 'Tarif paylaşılırken bir hata oluştu.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Başlık *</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Tarif başlığı"
      />

      <Text style={styles.label}>Açıklama *</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Tarif açıklaması"
        multiline
      />

      <Text style={styles.label}>Malzemeler *</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="Her satıra bir malzeme yazın"
        multiline
      />

      <Text style={styles.label}>Yapılış Adımları *</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={steps}
        onChangeText={setSteps}
        placeholder="Her satıra bir adım yazın"
        multiline
      />

      <Text style={styles.label}>Tercihler (Opsiyonel)</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={preferences}
        onChangeText={setPreferences}
        placeholder="Her satıra bir tercih yazın"
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <Text style={styles.buttonText}>Paylaş</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CommunityRecipeShareScreen; 