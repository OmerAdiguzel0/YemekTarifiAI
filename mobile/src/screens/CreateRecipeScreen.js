import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { useAuth } from '../../App';

const API_URL = 'http://192.168.1.101:5002/api';

const PREFERENCES = [
  { key: 'Vegan', value: 'Vegan' },
  { key: 'Vejetaryen', value: 'Vejetaryen' },
  { key: 'Glutensiz', value: 'Glutensiz' },
  { key: 'Şekersiz', value: 'Şekersiz' },
  { key: 'Düşük Kalorili', value: 'Düşük Kalorili' },
  { key: 'Laktozsuz', value: 'Laktozsuz' }
];

const CreateRecipeScreen = ({ navigation }) => {
  const { signOut } = useAuth();
  const [ingredients, setIngredients] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) {
      Alert.alert('Hata', 'Lütfen malzemeleri giriniz.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bulunamadı');
      }

      const generateResponse = await fetch(`${API_URL}/recipes/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ingredients: ingredients.split(',').map(item => item.trim()).filter(item => item),
          preferences: selectedPreferences || []
        })
      });

      if (generateResponse.status === 403) {
        await signOut();
        Alert.alert('Oturum Süresi Doldu', 'Lütfen tekrar giriş yapın.');
        return;
      }

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json();
        throw new Error(errorData.error || 'Tarif oluşturulurken bir hata oluştu');
      }

      const generatedData = await generateResponse.json();
      setGeneratedRecipe(generatedData);
    } catch (error) {
      Alert.alert('Hata', error.message || 'Tarif oluşturulurken bir hata oluştu.');
      console.error('Error generating recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bulunamadı');
      }

      const saveResponse = await fetch(`${API_URL}/recipe/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ingredients: ingredients.split(',').map(item => item.trim()).filter(item => item),
          preferences: selectedPreferences || [],
          generatedRecipe: generatedRecipe
        })
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        console.error('Tarif kaydetme hatası:', await saveResponse.text());
        throw new Error(errorData.error || 'Tarif kaydedilemedi');
      }

      Alert.alert('Başarılı', 'Tarif başarıyla kaydedildi!');
      navigation.navigate('SavedRecipes');
    } catch (error) {
      console.error('Error saving recipe:', error);
      Alert.alert('Hata', error.message || 'Tarif kaydedilirken bir hata oluştu.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Yapay Zeka ile Tarif Oluştur</Text>
        <Text style={styles.subtitle}>
          Elinizde bulunan malzemeleri virgülle ayırarak yazın ve tercihlerinizi seçin.
          Size uygun bir tarif önerelim.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Malzemeler</Text>
          <TextInput
            style={styles.input}
            placeholder="Örn: domates, salatalık, zeytinyağı"
            value={ingredients}
            onChangeText={setIngredients}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tercihler</Text>
          <MultipleSelectList
            setSelected={setSelectedPreferences}
            data={PREFERENCES}
            save="value"
            label="Tercihler"
            boxStyles={styles.dropdownBox}
            dropdownStyles={styles.dropdown}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleGenerateRecipe}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Tarif Oluştur</Text>
          )}
        </TouchableOpacity>

        {generatedRecipe && (
          <View style={styles.recipeContainer}>
            <Text style={styles.recipeTitle}>{generatedRecipe.title}</Text>
            
            <Text style={styles.sectionTitle}>Malzemeler:</Text>
            {generatedRecipe.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredient}>• {ingredient}</Text>
            ))}

            <Text style={styles.sectionTitle}>Hazırlanışı:</Text>
            {generatedRecipe.instructions.map((instruction, index) => (
              <Text key={index} style={styles.instruction}>{instruction}</Text>
            ))}

            {generatedRecipe.tips && generatedRecipe.tips.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Püf Noktaları:</Text>
                {generatedRecipe.tips.map((tip, index) => (
                  <Text key={index} style={styles.tip}>💡 {tip}</Text>
                ))}
              </>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveRecipe}
              >
                <Text style={styles.buttonText}>Tarifi Kaydet</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.newRecipeButton}
                onPress={() => {
                  setGeneratedRecipe(null);
                  setIngredients('');
                  setSelectedPreferences([]);
                }}
              >
                <Text style={styles.buttonText}>Yeni Tarif Oluştur</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#5c6bc0',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a237e',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1a237e',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  button: {
    backgroundColor: '#3949ab',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#b0bec5',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  recipeContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3949ab',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 5,
  },
  ingredient: {
    fontSize: 16,
    color: '#1a237e',
    marginBottom: 8,
    paddingLeft: 10,
    lineHeight: 22,
  },
  instruction: {
    fontSize: 16,
    color: '#1a237e',
    marginBottom: 12,
    lineHeight: 24,
    paddingLeft: 10,
  },
  tip: {
    fontSize: 16,
    color: '#1a237e',
    marginBottom: 10,
    lineHeight: 22,
    paddingLeft: 10,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 25,
    gap: 15,
  },
  saveButton: {
    backgroundColor: '#3949ab',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newRecipeButton: {
    backgroundColor: '#4caf50',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownBox: {
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  dropdown: {
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    borderRadius: 8,
  }
});

export default CreateRecipeScreen; 