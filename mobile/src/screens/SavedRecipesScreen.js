import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../App';
import { API_URL } from '../config';
import { useFocusEffect } from '@react-navigation/native';

const showAlert = (title, message, buttons) => {
  if (Platform.OS === 'ios') {
    Alert.alert(title, message, buttons);
  } else {
    Alert.alert(
      title,
      message,
      buttons,
      { cancelable: true }
    );
  }
};

const SavedRecipesScreen = ({ navigation, route }) => {
  const { signOut } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchRecipes = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bulunamadı');
      }

      const response = await fetch(`${API_URL}/recipes/saved`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 403) {
        await signOut();
        Alert.alert('Oturum Süresi Doldu', 'Lütfen tekrar giriş yapın.');
        return;
      }

      if (!response.ok) {
        throw new Error('Tarifler alınamadı');
      }

      const data = await response.json();
      console.log('Received recipes:', JSON.stringify(data, null, 2));
      setRecipes(data);
    } catch (error) {
      Alert.alert('Hata', error.message || 'Tarifler yüklenirken bir hata oluştu');
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchRecipes();
  }, []);

  const handleDeleteRecipe = async (recipeId) => {
    console.log('handleDeleteRecipe called with ID:', recipeId);
    if (deleting) {
      console.log('Already deleting, returning...');
      return;
    }

    try {
      setDeleting(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      const deleteUrl = `${API_URL}/recipes/saved/${recipeId}`;
      console.log('Sending DELETE request to:', deleteUrl);
      console.log('Using token:', token);

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Delete response status:', response.status);
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (response.status === 403) {
        console.log('403 error, signing out...');
        await signOut();
        return;
      }

      if (!response.ok) {
        const errorData = JSON.parse(responseText);
        Alert.alert('Hata', errorData.error || 'Tarif silinirken bir hata oluştu');
        return;
      }

      console.log('Delete successful, updating recipes state');
      setRecipes(prevRecipes => {
        console.log('Previous recipes count:', prevRecipes.length);
        const newRecipes = prevRecipes.filter(recipe => recipe.savedRecipeId !== recipeId);
        console.log('New recipes count:', newRecipes.length);
        return newRecipes;
      });
      Alert.alert('Başarılı', 'Tarif başarıyla silindi');
    } catch (error) {
      console.error('Error in handleDeleteRecipe:', error);
    } finally {
      console.log('Setting deleting state to false');
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.refresh) {
        fetchRecipes();
        setTimeout(() => navigation.setParams({ refresh: false }), 0);
      }
    }, [route.params?.refresh])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3949ab" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.content}>
        {recipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz kaydedilmiş tarifiniz yok.</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('CreateRecipe')}
            >
              <Text style={styles.buttonText}>Yeni Tarif Oluştur</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: '#28a745', marginTop: 12 }]}
              onPress={() => navigation.navigate('CommunityRecipes')}
            >
              <Text style={styles.buttonText}>Topluluk Tariflerine Göz At</Text>
            </TouchableOpacity>
          </View>
        ) : (
          recipes.map((recipe, index) => {
            console.log('Rendering recipe:', JSON.stringify(recipe, null, 2));
            let recipeTitle = 'Başlıksız Tarif';
            let ingredients = recipe.ingredients || [];
            let preferences = recipe.preferences || [];
            if (recipe.type === 'ai') {
              try {
                if (typeof recipe.generatedRecipe === 'string') {
                  const parsed = JSON.parse(recipe.generatedRecipe);
                  recipeTitle = parsed.title;
                  ingredients = parsed.ingredients || recipe.ingredients || [];
                  preferences = recipe.preferences || [];
                } else if (recipe.generatedRecipe && recipe.generatedRecipe.title) {
                  recipeTitle = recipe.generatedRecipe.title;
                  ingredients = recipe.generatedRecipe.ingredients || recipe.ingredients || [];
                  preferences = recipe.preferences || [];
                }
              } catch (error) {
                console.error('Error parsing recipe:', error);
              }
            } else if (recipe.type === 'community') {
              recipeTitle = recipe.title || 'Başlıksız Tarif';
              ingredients = recipe.ingredients || [];
              preferences = recipe.preferences || [];
            }

            return (
              <View key={recipe._id || index} style={styles.recipeCard}>
                <Text style={styles.recipeTitle}>{recipeTitle}</Text>
                <Text style={styles.sectionTitle}>Malzemeler:</Text>
                {ingredients.map((ingredient, idx) => (
                  <Text key={idx} style={styles.ingredient}>• {ingredient}</Text>
                ))}
                <Text style={styles.sectionTitle}>Tercihler:</Text>
                <View style={styles.preferencesContainer}>
                  {preferences.map((preference, idx) => (
                    <View key={idx} style={styles.preferenceTag}>
                      <Text style={styles.preferenceText}>{preference}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => {
                      let recipeData;
                      try {
                        recipeData = {
                          ...recipe,
                          generatedRecipe: typeof recipe.generatedRecipe === 'string' 
                            ? JSON.parse(recipe.generatedRecipe) 
                            : recipe.generatedRecipe
                        };
                      } catch (error) {
                        console.error('Error preparing recipe data:', error);
                        recipeData = recipe;
                      }
                      navigation.navigate('RecipeDetail', { recipe: recipeData });
                    }}
                  >
                    <Text style={styles.buttonText}>Tarifi Görüntüle</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.deleteButton, { marginTop: 8 }]}
                    activeOpacity={0.7}
                    onPress={async () => {
                      console.log('Delete button pressed for recipe:', recipe.savedRecipeId);
                      try {
                        await handleDeleteRecipe(recipe.savedRecipeId);
                      } catch (error) {
                        console.error('Error in delete handler:', error);
                      }
                    }}
                  >
                    <Text style={styles.buttonText}>Tarifi Sil</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
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
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#3949ab',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  recipeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3949ab',
    marginTop: 12,
    marginBottom: 8,
  },
  ingredient: {
    fontSize: 14,
    color: '#1a237e',
    marginBottom: 4,
    paddingLeft: 8,
  },
  preferencesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  preferenceTag: {
    backgroundColor: '#e8eaf6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  preferenceText: {
    fontSize: 12,
    color: '#3949ab',
  },
  buttonContainer: {
    marginTop: 16,
  },
  viewButton: {
    backgroundColor: '#3949ab',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SavedRecipesScreen; 