import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import { getMyCommunityRecipes, deleteCommunityRecipe } from '../services/api';

const MyCommunityRecipesScreen = ({ navigation, route }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    if (route.params && route.params.updatedRecipe) {
      setRecipes(prev => prev.map(r => r._id === route.params.updatedRecipe._id ? route.params.updatedRecipe : r));
      navigation.setParams({ updatedRecipe: undefined });
    }
  }, [route.params?.updatedRecipe]);

  const loadRecipes = async () => {
    try {
      const data = await getMyCommunityRecipes();
      setRecipes(data);
      setLoading(false);
    } catch (err) {
      alert(err?.message || 'Tarifler yüklenemedi');
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setPendingDeleteId(id);
    setModalVisible(true);
  };

  const actuallyDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      console.log('actuallyDelete fonksiyonu çağrıldı, ID:', pendingDeleteId);
      console.log('Silme API çağrısı yapılıyor...');
      const response = await deleteCommunityRecipe(pendingDeleteId);
      console.log('Silme API yanıtı:', response);
      setRecipes(prev => {
        const newRecipes = prev.filter(r => r._id !== pendingDeleteId);
        console.log('Yeni tarif listesi:', newRecipes);
        return newRecipes;
      });
      setModalVisible(false);
      setPendingDeleteId(null);
      alert('Tarif başarıyla silindi');
    } catch (err) {
      console.error('Silme hatası:', err);
      setModalVisible(false);
      setPendingDeleteId(null);
      alert(err?.message || 'Tarif silinemedi');
    }
  };

  const handleEdit = (recipe) => {
    navigation.navigate('EditCommunityRecipe', { recipe });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#3949ab" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      {/* Custom Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Emin misin?</Text>
            <Text style={styles.modalText}>Bu tarifi silmek istediğine emin misin?</Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => { setModalVisible(false); setPendingDeleteId(null); }}>
                <Text style={styles.modalButtonText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalDeleteButton} onPress={actuallyDelete}>
                <Text style={styles.modalButtonText}>Sil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* /Custom Modal */}
      {recipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Henüz tarif oluşturmadınız.</Text>
        </View>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.recipeCard}>
              <Text style={styles.recipeTitle}>{item.title}</Text>
              <Text style={styles.sectionTitle}>Malzemeler:</Text>
              {(item.ingredients || []).slice(0, 3).map((ingredient, idx) => (
                <Text key={idx} style={styles.ingredient}>• {ingredient}</Text>
              ))}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                  <Text style={styles.buttonText}>Düzenle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item._id)}>
                  <Text style={styles.buttonText}>Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    padding: 16,
  },
  recipeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
  buttonContainer: {
    marginTop: 16,
  },
  editButton: {
    backgroundColor: '#3949ab',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#b0bec5',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  modalDeleteButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default MyCommunityRecipesScreen; 