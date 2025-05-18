import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { saveCommunityRecipe } from '../services/api';

const CommunityRecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params;
  const [likeCount] = useState(recipe.likeCount || 0);
  const [liked] = useState(!!recipe.liked);

  const handleSave = async () => {
    try {
      await saveCommunityRecipe(recipe._id);
      Alert.alert('Başarılı', 'Tarif kaydedildi!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Hata', err?.message || 'Kaydetme işlemi başarısız');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{recipe.title}</Text>
      <Text style={styles.description}>{recipe.description}</Text>
      
      <Text style={styles.sectionTitle}>Malzemeler</Text>
      {recipe.ingredients.map((ingredient, index) => (
        <Text key={index} style={styles.listItem}>• {ingredient}</Text>
      ))}
      
      <Text style={styles.sectionTitle}>Yapılış Adımları</Text>
      {recipe.steps.map((step, index) => (
        <Text key={index} style={styles.listItem}>{index + 1}. {step}</Text>
      ))}
      
      {recipe.preferences && recipe.preferences.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Tercihler</Text>
          {recipe.preferences.map((pref, index) => (
            <Text key={index} style={styles.listItem}>• {pref}</Text>
          ))}
        </>
      )}
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
          <Text style={styles.buttonText}>Tarifi Kaydet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CommunityRecipeDetailScreen; 