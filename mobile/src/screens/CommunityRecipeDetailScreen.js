import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { saveCommunityRecipe, getComments, addComment, deleteComment, updateComment, likeComment } from '../services/api';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommunityRecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params;
  const [likeCount] = useState(recipe.likeCount || 0);
  const [liked] = useState(!!recipe.liked);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [commentFilter, setCommentFilter] = useState('latest'); // 'latest', 'owner', 'likes'

  useEffect(() => {
    loadComments();
    getCurrentUserId();
    // eslint-disable-next-line
  }, []);

  const getCurrentUserId = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
      // JWT token'dan userId'yi decode et
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(payload.userId || payload.id);
    } catch (e) {
      setCurrentUserId(null);
    }
  };

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const data = await getComments(recipe._id);
      setComments(data);
    } catch (err) {
      Alert.alert('Yorumlar yüklenemedi', err?.message || '');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setAdding(true);
    try {
      await addComment(recipe._id, commentText);
      setCommentText('');
      loadComments();
    } catch (err) {
      Alert.alert('Yorum eklenemedi', err?.message || '');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setDeleting(true);
    try {
      await deleteComment(commentId);
      loadComments();
    } catch (err) {
      Alert.alert('Yorum silinemedi', err?.message || '');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingId(comment._id);
    setEditingText(comment.text);
  };

  const handleUpdateComment = async () => {
    if (!editingText.trim()) return;
    setAdding(true);
    try {
      await updateComment(editingId, editingText);
      setEditingId(null);
      setEditingText('');
      loadComments();
    } catch (err) {
      Alert.alert('Yorum güncellenemedi', err?.message || '');
    } finally {
      setAdding(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveCommunityRecipe(recipe._id);
      Alert.alert('Başarılı', 'Tarif kaydedildi!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Hata', err?.message || 'Kaydetme işlemi başarısız');
    }
  };

  const handleAddReply = async (parentCommentId) => {
    if (!replyText.trim()) return;
    setAdding(true);
    try {
      await addComment(recipe._id, replyText, parentCommentId);
      setReplyText('');
      setReplyingTo(null);
      loadComments();
    } catch (err) {
      Alert.alert('Cevap eklenemedi', err?.message || '');
    } finally {
      setAdding(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await likeComment(commentId);
      loadComments();
    } catch (err) {
      Alert.alert('Beğenilemedi', err?.message || '');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now - date) / 1000;
    if (diff < 60) return 'şimdi';
    if (diff < 3600) return `${Math.floor(diff/60)} dk önce`;
    if (diff < 86400) return `${Math.floor(diff/3600)} sa önce`;
    return `${date.getDate().toString().padStart(2,'0')}.${(date.getMonth()+1).toString().padStart(2,'0')}.${date.getFullYear()} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;
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
      <Text style={styles.sharedBy}>
        Tarifi paylaşan: {recipe.username}
      </Text>
      <View style={styles.commentsContainer}>
        <Text style={styles.sectionTitle}>Yorumlar</Text>
        {/* Yorum filtreleri */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 8, gap: 8 }}>
          <TouchableOpacity style={[styles.filterButton, commentFilter === 'latest' && styles.filterButtonActive]} onPress={() => setCommentFilter('latest')}>
            <Text style={[styles.filterButtonText, commentFilter === 'latest' && styles.filterButtonTextActive]}>En Son</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, commentFilter === 'owner' && styles.filterButtonActive]} onPress={() => setCommentFilter('owner')}>
            <Text style={[styles.filterButtonText, commentFilter === 'owner' && styles.filterButtonTextActive]}>Tarif Sahibi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, commentFilter === 'likes' && styles.filterButtonActive]} onPress={() => setCommentFilter('likes')}>
            <Text style={[styles.filterButtonText, commentFilter === 'likes' && styles.filterButtonTextActive]}>Beğeni</Text>
          </TouchableOpacity>
        </View>
        {/* Yorumlar */}
        {loadingComments ? (
          <Text style={{ color: '#888', textAlign: 'center', marginVertical: 8 }}>Yorumlar yükleniyor...</Text>
        ) : comments.length === 0 ? (
          <Text style={{ color: '#888', textAlign: 'center', marginVertical: 8 }}>Henüz yorum yok.</Text>
        ) : (
          comments
            .filter(c => !c.parentCommentId)
            .filter(c => commentFilter !== 'owner' || c.userId === recipe.userId)
            .sort((a, b) => {
              if (commentFilter === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
              if (commentFilter === 'likes') return (b.likeCount || 0) - (a.likeCount || 0);
              return 0;
            })
            .map((c) => {
              const isOwner = c.userId === recipe.userId;
              const isMine = c.userId === currentUserId;
              const avatarLetter = c.username?.[0]?.toUpperCase() || '?';
              const isEdited = c.updatedAt && c.updatedAt !== c.createdAt;
              return (
                <View key={c._id} style={styles.commentItem}>
                  {/* Ana yorum içeriği */}
                  <View style={styles.commentHeader}>
                    <View style={[styles.avatar, isOwner && styles.avatarOwner, isMine && styles.avatarMine]}>
                      <Text style={styles.avatarText}>{avatarLetter}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.commentUser}>{c.username}
                        {isOwner && <Text style={styles.ownerBadge}>  Tarif Sahibi</Text>}
                        {isMine && <Text style={styles.mineBadge}>  Siz</Text>}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.commentDate}>{formatDate(c.createdAt)}</Text>
                        {isEdited && <Text style={styles.editedLabel}>düzenlendi</Text>}
                      </View>
                    </View>
                    {/* Kalp, düzenle ve sil ikonları en sağda yan yana */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                      <TouchableOpacity onPress={() => handleLikeComment(c._id)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 4 }}>
                        <MaterialIcons name={c.liked ? 'favorite' : 'favorite-border'} size={18} color={c.liked ? '#e53935' : '#888'} />
                        <Text style={{ color: c.liked ? '#e53935' : '#888', marginLeft: 2 }}>{c.likeCount || 0}</Text>
                      </TouchableOpacity>
                      {isMine && (
                        <TouchableOpacity disabled={deleting} onPress={() => handleEditComment(c)}>
                          <MaterialIcons name="edit" size={20} color="#1976d2" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>
                      )}
                      {isMine && (
                        <TouchableOpacity disabled={deleting} onPress={() => handleDeleteComment(c._id)}>
                          <MaterialIcons name="delete" size={20} color="#f44336" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  {editingId === c._id ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <TextInput
                        style={[styles.commentInput, { backgroundColor: '#f5f5f5' }]}
                        value={editingText}
                        onChangeText={setEditingText}
                        editable={!adding}
                        autoFocus
                      />
                      <TouchableOpacity style={[styles.addCommentButton, { marginLeft: 6 }]} onPress={handleUpdateComment} disabled={adding || !editingText.trim()}>
                        <Text style={styles.addCommentButtonText}>Kaydet</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginLeft: 6 }} onPress={() => { setEditingId(null); setEditingText(''); }}>
                        <MaterialIcons name="close" size={22} color="#888" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={styles.commentText}>{c.text}</Text>
                  )}
                  {/* Cevapla butonu */}
                  {replyingTo === c._id ? (
                    <View style={styles.replyBox}>
                      <TextInput
                        style={styles.replyInput}
                        placeholder="Cevabınızı yazın..."
                        value={replyText}
                        onChangeText={setReplyText}
                        editable={!adding}
                        autoFocus
                      />
                      <TouchableOpacity style={styles.addCommentButton} onPress={() => handleAddReply(c._id)} disabled={adding || !replyText.trim()}>
                        <Text style={styles.addCommentButtonText}>Gönder</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ marginLeft: 6 }} onPress={() => { setReplyingTo(null); setReplyText(''); }}>
                        <MaterialIcons name="close" size={22} color="#888" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => setReplyingTo(c._id)}>
                      <Text style={styles.replyButton}>Cevapla</Text>
                    </TouchableOpacity>
                  )}
                  {/* Cevaplar */}
                  {comments.filter(r => r.parentCommentId?.toString() === c._id?.toString()).map((r) => {
                    const isOwnerR = r.userId === recipe.userId;
                    const isMineR = r.userId === currentUserId;
                    const avatarLetterR = r.username?.[0]?.toUpperCase() || '?';
                    const isEditedR = r.updatedAt && r.updatedAt !== r.createdAt;
                    return (
                      <View key={r._id} style={styles.replyItem}>
                        <View style={styles.commentHeader}>
                          <View style={[styles.avatar, isOwnerR && styles.avatarOwner, isMineR && styles.avatarMine]}>
                            <Text style={styles.avatarText}>{avatarLetterR}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.commentUser}>{r.username}
                              {isOwnerR && <Text style={styles.ownerBadge}>  Tarif Sahibi</Text>}
                              {isMineR && <Text style={styles.mineBadge}>  Siz</Text>}
                            </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                              <Text style={styles.commentDate}>{formatDate(r.createdAt)}</Text>
                              {isEditedR && <Text style={styles.editedLabel}>düzenlendi</Text>}
                            </View>
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                            <TouchableOpacity onPress={() => handleLikeComment(r._id)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 4 }}>
                              <MaterialIcons name={r.liked ? 'favorite' : 'favorite-border'} size={18} color={r.liked ? '#e53935' : '#888'} />
                              <Text style={{ color: r.liked ? '#e53935' : '#888', marginLeft: 2 }}>{r.likeCount || 0}</Text>
                            </TouchableOpacity>
                            {isMineR && (
                              <TouchableOpacity disabled={deleting} onPress={() => handleEditComment(r)}>
                                <MaterialIcons name="edit" size={20} color="#1976d2" style={{ marginLeft: 8 }} />
                              </TouchableOpacity>
                            )}
                            {isMineR && (
                              <TouchableOpacity disabled={deleting} onPress={() => handleDeleteComment(r._id)}>
                                <MaterialIcons name="delete" size={20} color="#f44336" style={{ marginLeft: 8 }} />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                        {editingId === r._id ? (
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <TextInput
                              style={[styles.commentInput, { backgroundColor: '#f5f5f5' }]}
                              value={editingText}
                              onChangeText={setEditingText}
                              editable={!adding}
                              autoFocus
                            />
                            <TouchableOpacity style={[styles.addCommentButton, { marginLeft: 6 }]} onPress={handleUpdateComment} disabled={adding || !editingText.trim()}>
                              <Text style={styles.addCommentButtonText}>Kaydet</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginLeft: 6 }} onPress={() => { setEditingId(null); setEditingText(''); }}>
                              <MaterialIcons name="close" size={22} color="#888" />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <Text style={styles.commentText}>{r.text}</Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              );
            })
        )}
        <View style={styles.addCommentContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Yorumunuzu yazın..."
            value={commentText}
            onChangeText={setCommentText}
            editable={!adding}
          />
          <TouchableOpacity style={styles.addCommentButton} onPress={handleAddComment} disabled={adding || !commentText.trim()}>
            <Text style={styles.addCommentButtonText}>Gönder</Text>
          </TouchableOpacity>
        </View>
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
  sharedBy: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
    marginTop: -8
  },
  commentsContainer: {
    marginTop: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 12,
    marginBottom: 24
  },
  commentItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    justifyContent: 'space-between',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  avatarOwner: {
    backgroundColor: '#ffb300'
  },
  avatarMine: {
    borderWidth: 2,
    borderColor: '#3949ab'
  },
  avatarText: {
    color: '#3949ab',
    fontWeight: 'bold',
    fontSize: 18
  },
  ownerBadge: {
    backgroundColor: '#ffecb3',
    color: '#ff9800',
    fontSize: 12,
    borderRadius: 6,
    paddingHorizontal: 6,
    marginLeft: 4
  },
  mineBadge: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    fontSize: 12,
    borderRadius: 6,
    paddingHorizontal: 6,
    marginLeft: 4
  },
  commentDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 1
  },
  commentUser: {
    fontWeight: 'bold',
    color: '#3949ab',
    marginBottom: 2
  },
  commentText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 2
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 6
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    fontSize: 15,
    marginRight: 8,
    padding: 8
  },
  addCommentButton: {
    backgroundColor: '#3949ab',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16
  },
  addCommentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15
  },
  editedLabel: {
    color: '#aaa',
    fontSize: 12,
    fontStyle: 'italic',
    marginLeft: 8
  },
  replyButton: {
    color: '#1976d2',
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 2
  },
  replyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 6
  },
  replyInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 8,
    fontSize: 15,
    marginRight: 8,
    padding: 8
  },
  replyItem: {
    marginLeft: 36,
    marginTop: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#1976d2'
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bbb',
    backgroundColor: '#fff',
    marginHorizontal: 2,
  },
  filterButtonActive: {
    backgroundColor: '#3949ab',
    borderColor: '#3949ab',
  },
  filterButtonText: {
    color: '#3949ab',
    fontWeight: 'bold',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
});

export default CommunityRecipeDetailScreen; 