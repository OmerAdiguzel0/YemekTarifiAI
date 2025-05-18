import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { updateCommunityRecipe } from '../services/api';

const EditCommunityRecipeScreen = ({ route, navigation }) => {
  const { recipe } = route.params;
  const [title, setTitle] = useState(recipe.title);
  const [description, setDescription] = useState(recipe.description);
  const [ingredients, setIngredients] = useState(recipe.ingredients.join('\n'));
  const [steps, setSteps] = useState(recipe.steps.join('\n'));
  const [preferences, setPreferences] = useState((recipe.preferences || []).join('\n'));
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!title || !description || !ingredients || !steps) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    setLoading(true);
    try {
      await updateCommunityRecipe(recipe._id, {
        title,
        description,
        ingredients: ingredients.split('\n').filter(i => i.trim()),
        steps: steps.split('\n').filter(s => s.trim()),
        preferences: preferences ? preferences.split('\n').filter(p => p.trim()) : []
      });
      Alert.alert('Başarılı', 'Tarif güncellendi!');
      navigation.navigate('MyCommunityRecipes', { updatedRecipe: {
        ...recipe,
        title,
        description,
        ingredients: ingredients.split('\n').filter(i => i.trim()),
        steps: steps.split('\n').filter(s => s.trim()),
        preferences: preferences ? preferences.split('\n').filter(p => p.trim()) : []
      }});
    } catch (err) {
      Alert.alert('Hata', err?.message || 'Tarif güncellenemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tarifi Düzenle</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Başlık"
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Açıklama"
      />
      <Text style={styles.label}>Malzemeler (her satıra bir malzeme)</Text>
      <TextInput
        style={[styles.input, { minHeight: 80 }]}
        value={ingredients}
        onChangeText={setIngredients}
        placeholder="Malzemeler"
        multiline
      />
      <Text style={styles.label}>Yapılış Adımları (her satıra bir adım)</Text>
      <TextInput
        style={[styles.input, { minHeight: 80 }]}
        value={steps}
        onChangeText={setSteps}
        placeholder="Yapılış Adımları"
        multiline
      />
      <Text style={styles.label}>Tercihler (her satıra bir tercih, opsiyonel)</Text>
      <TextInput
        style={[styles.input, { minHeight: 60 }]}
        value={preferences}
        onChangeText={setPreferences}
        placeholder="Tercihler"
        multiline
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Kaydediliyor...' : 'Kaydet'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a237e',
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#3949ab',
    marginBottom: 4,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditCommunityRecipeScreen; 