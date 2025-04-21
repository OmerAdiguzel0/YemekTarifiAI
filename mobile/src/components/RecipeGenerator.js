import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Modal } from 'react-native';
import axios from 'axios';

// IP adresini güncelleyelim
const API_URL = 'http://192.168.1.101:5001'; // Doğru IP adresi

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('genel');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const dietaryOptions = [
    { label: 'Genel', value: 'genel' },
    { label: 'Vejetaryen', value: 'vejetaryen' },
    { label: 'Vegan', value: 'vegan' },
    { label: 'Glutensiz', value: 'glutensiz' },
    { label: 'Düşük Karbonhidrat', value: 'düşük karbonhidrat' },
  ];

  const handleGenerateRecipe = async () => {
    if (!ingredients) {
      setError('Lütfen en az bir malzeme girin');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_URL}/api/ai/generate-recipe`, {
        ingredients: ingredients.split(',').map(item => item.trim()),
        dietaryPreference
      });
      
      setRecipe(response.data.recipe);
    } catch (error) {
      console.error('Tarif oluşturma hatası:', error);
      setError('Tarif oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!recipe) return;
    
    try {
      // Tarifi parse et
      const lines = recipe.split('\n');
      const title = lines[0];
      
      // Malzemeler ve hazırlanışı bölümlerini bul
      let ingredientsSection = '';
      let instructionsSection = '';
      let aiNotesSection = '';
      
      let currentSection = '';
      for (const line of lines) {
        if (line.includes('Malzemeler')) {
          currentSection = 'ingredients';
          continue;
        } else if (line.includes('Hazırlanışı')) {
          currentSection = 'instructions';
          continue;
        } else if (line.includes('AI Notları')) {
          currentSection = 'aiNotes';
          continue;
        }
        
        if (currentSection === 'ingredients') {
          ingredientsSection += line + '\n';
        } else if (currentSection === 'instructions') {
          instructionsSection += line + '\n';
        } else if (currentSection === 'aiNotes') {
          aiNotesSection += line + '\n';
        }
      }
      
      const recipeData = {
        title,
        ingredients: ingredientsSection.trim(),
        instructions: instructionsSection.trim(),
        aiDescription: aiNotesSection.trim(),
        dietaryTags: [dietaryPreference],
        cookingTime: '30 dakika', // Varsayılan değer
        difficulty: 'Orta' // Varsayılan değer
      };
      
      await axios.post(`${API_URL}/api/recipes`, recipeData);
      alert('Tarif başarıyla kaydedildi!');
      setRecipe(null);
      setIngredients('');
    } catch (error) {
      console.error('Tarif kaydedilirken hata:', error);
      alert('Tarif kaydedilirken bir hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Malzemeler (virgülle ayırın)</Text>
        <TextInput
          style={styles.input}
          value={ingredients}
          onChangeText={setIngredients}
          placeholder="Örn: domates, soğan, zeytinyağı"
          multiline
          numberOfLines={4}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Beslenme Tercihi</Text>
        <TouchableOpacity 
          style={styles.dropdownButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dropdownButtonText}>
            {dietaryOptions.find(option => option.value === dietaryPreference)?.label || 'Seçiniz'}
          </Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </TouchableOpacity>
      </View>
      
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Beslenme Tercihi Seçin</Text>
            {dietaryOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionItem,
                  dietaryPreference === option.value && styles.selectedOption
                ]}
                onPress={() => {
                  setDietaryPreference(option.value);
                  setShowPicker(false);
                }}
              >
                <Text 
                  style={[
                    styles.optionText,
                    dietaryPreference === option.value && styles.selectedOptionText
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.disabledButton]} 
        onPress={handleGenerateRecipe}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Tarif Oluşturuluyor...' : 'Tarif Oluştur'}
        </Text>
        {loading && <ActivityIndicator color="white" style={styles.loader} />}
      </TouchableOpacity>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {recipe && (
        <View style={styles.recipeContainer}>
          <ScrollView style={styles.recipeContent}>
            {recipe.split('\n').map((line, index) => (
              <Text key={index} style={styles.recipeLine}>{line}</Text>
            ))}
          </ScrollView>
          
          <TouchableOpacity 
            style={[styles.button, styles.saveButton]} 
            onPress={handleSaveRecipe}
          >
            <Text style={styles.buttonText}>Tarifi Kaydet</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginLeft: 10,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  recipeContainer: {
    marginTop: 24,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    overflow: 'hidden',
  },
  recipeContent: {
    padding: 16,
    maxHeight: 300,
  },
  recipeLine: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: '#2196F3',
    borderRadius: 0,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    backgroundColor: 'white',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  optionItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#e8f5e9',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default RecipeGenerator;