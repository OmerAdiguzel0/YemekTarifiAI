import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState('');
  const [diet, setDiet] = useState('vegan');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      alert('Lütfen en az bir malzeme girin');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://192.168.1.61:5001/api/ai/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ingredients: ingredients.split(','),
          dietaryPreference: diet
        })
      });
      
      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      alert('Tarif oluşturma hatası: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!recipe) {
      alert('Önce bir tarif oluşturun');
      return;
    }
    
    try {
      const response = await fetch('http://192.168.1.61:5001/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: "AI Tarifi: " + ingredients.split(',')[0],
          ingredients: ingredients.split(','),
          instructions: recipe.split('\n'),
          aiDescription: recipe,
          dietaryTags: [diet],
          cookingTime: 30,
          difficulty: 'Orta'
        })
      });
      const data = await response.json();
      alert('Tarif kaydedildi!');
    } catch (error) {
      alert('Kaydetme hatası: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tarif Oluşturucu</Text>
      
      <Text style={styles.label}>Malzemeler</Text>
      <TextInput
        placeholder="Malzemeleri virgülle ayırın"
        value={ingredients}
        onChangeText={setIngredients}
        style={styles.input}
        multiline
      />
      
      <Text style={styles.label}>Diyet Tercihi</Text>
      <View style={styles.dietButtonsContainer}>
        <TouchableOpacity 
          style={[styles.dietButton, diet === 'vegan' && styles.dietButtonActive]}
          onPress={() => setDiet('vegan')}>
          <Text style={[styles.dietButtonEmoji, diet === 'vegan' && styles.dietButtonEmojiActive]}>🥗</Text>
          <Text style={[styles.dietButtonText, diet === 'vegan' && styles.dietButtonTextActive]}>Vegan</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.dietButton, diet === 'gluten-free' && styles.dietButtonActive]}
          onPress={() => setDiet('gluten-free')}>
          <Text style={[styles.dietButtonEmoji, diet === 'gluten-free' && styles.dietButtonEmojiActive]}>🌾</Text>
          <Text style={[styles.dietButtonText, diet === 'gluten-free' && styles.dietButtonTextActive]}>Glutensiz</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.dietButton, diet === 'protein' && styles.dietButtonActive]}
          onPress={() => setDiet('protein')}>
          <Text style={[styles.dietButtonEmoji, diet === 'protein' && styles.dietButtonEmojiActive]}>💪</Text>
          <Text style={[styles.dietButtonText, diet === 'protein' && styles.dietButtonTextActive]}>Yüksek Protein</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Tarif Oluştur" 
          onPress={generateRecipe} 
          color="#4a90e2"
          disabled={loading}
        />
      </View>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Tarif oluşturuluyor...</Text>
        </View>
      )}
      
      {recipe ? (
        <View style={styles.recipeContainer}>
          <Text style={styles.recipeTitle}>Oluşturulan Tarif</Text>
          <Text style={styles.recipeText}>{recipe}</Text>
          <View style={styles.saveButtonContainer}>
            <Button 
              title="Tarifi Kaydet" 
              onPress={handleSave} 
              color="#28a745"
            />
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 150,  // iOS için yüksekliği artırdım
    width: '100%'
  },
  pickerAndroid: {
    height: 50,
    width: '100%'
  },
  buttonContainer: {
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  recipeContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  recipeText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444',
  },
  saveButtonContainer: {
    marginTop: 16,
  },
  dietButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dietButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  dietButtonActive: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  dietButtonText: {
    color: '#555',
    fontWeight: '500',
  },
  dietButtonTextActive: {
    color: 'white',
  },
});

export default RecipeGenerator;