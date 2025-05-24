import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform, TextInput, Modal } from 'react-native';
import { getCommunityRecipes, likeCommunityRecipe, saveCommunityRecipe } from '../services/api';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

// Basit Toast Component (sadece web için)
const WebToast = ({ message, visible }) => {
  if (Platform.OS !== 'web' || !visible) return null;
  return (
    <div style={{
      position: 'fixed',
      bottom: 40,
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#333',
      color: '#fff',
      padding: '16px 32px',
      borderRadius: 8,
      fontSize: 16,
      zIndex: 9999,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>{message}</div>
  );
};

const CommunityRecipesScreen = ({ navigation, route }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedRecipes, setLikedRecipes] = useState(new Set());
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeout = useRef(null);
  const [toastMessage, setToastMessage] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [ingredientFilter, setIngredientFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [pressedIndex, setPressedIndex] = useState(-1);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 16 }}>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Text style={{ fontSize: 28, color: '#fff', fontWeight: 'bold', paddingHorizontal: 8 }}>⋮</Text>
          </TouchableOpacity>
          <Modal
            visible={menuVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setMenuVisible(false)}
          >
            <TouchableOpacity
              style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}
              activeOpacity={1}
              onPressOut={() => setMenuVisible(false)}
            >
              <View style={{ position: 'absolute', top: 40, right: 10, minWidth: 160 }}>
                {/* Caret (üçgen) */}
                <View style={{ alignItems: 'flex-end', marginRight: 18, marginBottom: -6 }}>
                  <View style={{ width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 10, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#fff' }} />
                </View>
                <View style={{ backgroundColor: '#fff', borderRadius: 14, elevation: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, overflow: 'hidden' }}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: pressedIndex === 0 ? '#f5f5f5' : '#fff' }}
                    onPress={() => { setMenuVisible(false); navigation.navigate('CommunityRecipeShare'); }}
                    onPressIn={() => setPressedIndex(0)}
                    onPressOut={() => setPressedIndex(-1)}
                  >
                    <MaterialIcons name="edit" size={20} color="#3949ab" style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 16, color: '#333' }}>Tarif Paylaş</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: pressedIndex === 1 ? '#f5f5f5' : '#fff' }}
                    onPress={() => { setMenuVisible(false); navigation.navigate('MyCommunityRecipes'); }}
                    onPressIn={() => setPressedIndex(1)}
                    onPressOut={() => setPressedIndex(-1)}
                  >
                    <MaterialIcons name="book" size={20} color="#3949ab" style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 16, color: '#333' }}>Tariflerim</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      )
    });
  }, [navigation, menuVisible]);

  useEffect(() => {
    return () => {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (toastVisible) {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      toastTimeout.current = setTimeout(() => setToastVisible(false), 2000);
    }
  }, [toastVisible]);

  useEffect(() => {
    loadRecipes();
  }, [titleFilter, ingredientFilter]);

  useFocusEffect(
    React.useCallback(() => {
      loadRecipes();
    }, [])
  );

  const loadRecipes = async () => {
    try {
      const params = {};
      if (titleFilter) params.title = titleFilter;
      if (ingredientFilter) params.ingredient = ingredientFilter;
      const data = await getCommunityRecipes(params);
      setRecipes(data);
      setLikedRecipes(new Set(data.filter(r => r.liked).map(r => r._id)));
      setLoading(false);
    } catch (err) {
      setError('Tarifler yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const handleLike = async (recipeId) => {
    try {
      const response = await likeCommunityRecipe(recipeId);
      setLikedRecipes(prev => {
        const newSet = new Set(prev);
        if (response.liked) {
          newSet.add(recipeId);
        } else {
          newSet.delete(recipeId);
        }
        return newSet;
      });
      loadRecipes(); // Listeyi yenile
    } catch (err) {
      console.error('Beğenme hatası:', err);
    }
  };

  const handleSave = async (recipeId) => {
    try {
      await saveCommunityRecipe(recipeId);
      if (Platform.OS === 'web') {
        setToastMessage('Bu tarif kayıtlı tariflerime eklendi');
        setToastVisible(true);
      } else {
        Alert.alert('Başarılı', 'Bu tarif kayıtlı tariflerime eklendi');
      }
      navigation.navigate('SavedRecipes', { refresh: true });
    } catch (err) {
      const alreadyExists = err?.message?.includes('zaten kaydettiniz') || err?.error?.includes('zaten kaydettiniz') || err?.message?.includes('zaten kayıtlı') || err?.error?.includes('zaten kayıtlı');
      if (Platform.OS === 'web') {
        setToastMessage(alreadyExists ? 'Bu tarif zaten kayıtlı tariflerinizde mevcut' : 'Bir hata oluştu');
        setToastVisible(true);
      } else {
        Alert.alert('Uyarı', alreadyExists ? 'Bu tarif zaten kayıtlı tariflerinizde mevcut' : 'Bir hata oluştu');
      }
    }
  };

  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipeCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <TouchableOpacity
          onPress={() => handleLike(item._id)}
          style={styles.likeButtonContainer}
        >
          <Text style={[styles.likeButton, (item.liked || likedRecipes.has(item._id)) && styles.likedButton]}>
            {(item.liked || likedRecipes.has(item._id)) ? '❤️' : '🤍'} {item.likeCount}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Malzemeler:</Text>
      {(item.ingredients || []).slice(0, 3).map((ingredient, idx) => (
        <Text key={idx} style={styles.ingredient}>• {ingredient}</Text>
      ))}
      {item.ingredients && item.ingredients.length > 3 && (
        <Text style={styles.moreText}>+{item.ingredients.length - 3} daha...</Text>
      )}
      <Text style={styles.sectionTitle}>Tercihler:</Text>
      <View style={styles.preferencesContainer}>
        {(item.preferences || []).map((preference, idx) => (
          <View key={idx} style={styles.preferenceTag}>
            <Text style={styles.preferenceText}>{preference}</Text>
          </View>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('CommunityRecipeDetail', { recipe: item })}
        >
          <Text style={styles.buttonText}>Tarifi Görüntüle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, { marginTop: 8 }]}
          activeOpacity={0.7}
          onPress={() => handleSave(item._id)}
        >
          <Text style={styles.buttonText}>Tarifi Kaydet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <WebToast message={toastMessage} visible={toastVisible} />
      <TouchableOpacity
        style={{ backgroundColor: '#82877c', borderRadius: 8, padding: 10, marginBottom: 12, alignItems: 'center' }}
        onPress={() => setShowFilters(v => !v)}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Filtrele</Text>
      </TouchableOpacity>
      {showFilters && (
        <>
          <TextInput
            style={{ backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: '#ddd' }}
            placeholder="Tarif Başlığına Göre Ara"
            value={titleFilter}
            onChangeText={setTitleFilter}
            autoCorrect={false}
          />
          <TextInput
            style={{ backgroundColor: '#fff', borderRadius: 8, padding: 10, marginBottom: 16, borderWidth: 1, borderColor: '#ddd' }}
            placeholder="Malzemeye Göre Ara (malzemeler arasına virgül koyun)"
            value={ingredientFilter}
            onChangeText={setIngredientFilter}
            autoCorrect={false}
          />
        </>
      )}
      <FlatList
        data={recipes}
        renderItem={renderRecipeItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f2f5',
  },
  recipeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
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
  moreText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    paddingLeft: 8,
    fontStyle: 'italic',
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
  saveButton: {
    backgroundColor: '#4caf50',
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  likeButtonContainer: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  likeButton: {
    fontSize: 18,
    color: '#666',
  },
  likedButton: {
    color: '#e91e63',
  },
});

export default CommunityRecipesScreen; 