import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  IconButton,
  Button,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import { getComments, addComment, deleteComment, updateComment, likeComment } from '../../services/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';

const RecipeDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = location.state?.recipe;

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [loadingComments, setLoadingComments] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [commentFilter, setCommentFilter] = useState('latest');

  useEffect(() => {
    fetchComments();
    getCurrentUserId();
    // eslint-disable-next-line
  }, []);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const data = await getComments(recipe._id || recipe.id);
      setComments(data);
    } catch (err) {
      //
    } finally {
      setLoadingComments(false);
    }
  };

  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(payload.userId || payload.id);
    } catch {
      setCurrentUserId(null);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    try {
      await addComment(recipe._id || recipe.id, commentText);
      setCommentText('');
      fetchComments();
    } catch {}
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      fetchComments();
    } catch {}
  };

  const handleEditComment = (comment) => {
    setEditingId(comment._id);
    setEditingText(comment.text);
  };

  const handleUpdateComment = async () => {
    if (!editingText.trim()) return;
    try {
      await updateComment(editingId, editingText);
      setEditingId(null);
      setEditingText('');
      fetchComments();
    } catch {}
  };

  const handleAddReply = async (parentCommentId) => {
    if (!replyText.trim()) return;
    try {
      await addComment(recipe._id || recipe.id, replyText, parentCommentId);
      setReplyText('');
      setReplyingTo(null);
      fetchComments();
    } catch {}
  };

  const handleLikeComment = async (commentId) => {
    try {
      await likeComment(commentId);
      fetchComments();
    } catch (err) {
      // alert veya snackbar ile hata gösterilebilir
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

  const handleShare = async () => {
    try {
      const recipeText = `
${recipe.generatedRecipe.title}

Malzemeler:
${recipe.ingredients.map(ingredient => `• ${ingredient}`).join('\n')}

Hazırlanışı:
${recipe.generatedRecipe.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

${recipe.generatedRecipe.tips ? `\nPüf Noktaları:\n${recipe.generatedRecipe.tips.map(tip => `💡 ${tip}`).join('\n')}` : ''}
      `.trim();

      await navigator.clipboard.writeText(recipeText);
      alert('Tarif panoya kopyalandı!');
    } catch (error) {
      console.error('Error sharing recipe:', error);
      alert('Tarif paylaşılırken bir hata oluştu');
    }
  };

  if (!recipe) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Tarif bulunamadı. Lütfen tarifleri listesine dönüp tekrar deneyin.</Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/kaydedilen-tarifler')}
          sx={{ mt: 2 }}
        >
          Tariflere Dön
        </Button>
      </Container>
    );
  }

  let parsedRecipe = recipe;
  try {
    if (recipe.type === 'ai' && typeof recipe.generatedRecipe === 'string') {
      parsedRecipe = {
        ...recipe,
        generatedRecipe: JSON.parse(recipe.generatedRecipe)
      };
    }
  } catch (error) {
    console.error('Error parsing recipe:', error);
  }

  const isAIRecipe = recipe.type === 'ai' || !!parsedRecipe.generatedRecipe;

  let title, ingredients, instructions, tips, preferences;
  if (isAIRecipe) {
    const gen = parsedRecipe.generatedRecipe || {};
    title = gen.title || 'Başlıksız Tarif';
    ingredients = gen.ingredients || recipe.ingredients || [];
    instructions = gen.instructions || [];
    tips = gen.tips || [];
    preferences = recipe.preferences || [];
  } else {
    title = recipe.title || 'Başlıksız Tarif';
    ingredients = recipe.ingredients || [];
    instructions = recipe.instructions || recipe.steps || [];
    tips = [];
    preferences = recipe.preferences || [];
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
            {title}
          </Typography>
          <IconButton onClick={handleShare} color="primary">
            <ShareIcon />
          </IconButton>
        </Box>

        <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {preferences.map((preference, index) => (
            <Chip
              key={index}
              label={preference}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>

        <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
          Malzemeler
        </Typography>
        <List sx={{ mb: 4 }}>
          {ingredients.map((ingredient, index) => (
            <ListItem key={index}>
              <ListItemText primary={`• ${ingredient}`} />
            </ListItem>
          ))}
        </List>

        <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
          Hazırlanışı
        </Typography>
        <List sx={{ mb: 4 }}>
          {instructions.map((instruction, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${index + 1}. ${instruction}`} />
            </ListItem>
          ))}
        </List>

        {tips && tips.length > 0 && (
          <>
            <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
              Püf Noktaları
            </Typography>
            <List>
              {tips.map((tip, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={`💡 ${tip}`}
                    sx={{ fontStyle: 'italic' }}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {recipe.username && (
          <Typography variant="body2" sx={{ textAlign: 'center', color: '#888', mt: 2 }}>
            Tarifi paylaşan: {recipe.username}
          </Typography>
        )}
      </Paper>
      {/* Yorumlar Bölümü */}
      <Box sx={{ mt: 4, bgcolor: '#f8f8f8', borderRadius: 2, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>Yorumlar</Typography>
        {/* Yorum filtreleri */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant={commentFilter === 'latest' ? 'contained' : 'outlined'} onClick={() => setCommentFilter('latest')}>En Son</Button>
          <Button variant={commentFilter === 'owner' ? 'contained' : 'outlined'} onClick={() => setCommentFilter('owner')}>Tarif Sahibi</Button>
          <Button variant={commentFilter === 'likes' ? 'contained' : 'outlined'} onClick={() => setCommentFilter('likes')}>Beğeni</Button>
        </Box>
        {loadingComments ? (
          <Typography color="text.secondary">Yorumlar yükleniyor...</Typography>
        ) : comments.length === 0 ? (
          <Typography color="text.secondary">Henüz yorum yok.</Typography>
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
                <Box key={c._id} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, bgcolor: '#fff', borderRadius: 2, p: 2, boxShadow: 1 }}>
                  <Avatar sx={{ bgcolor: isOwner ? '#ffb300' : '#e0e0e0', color: '#3949ab', fontWeight: 'bold', mr: 2 }}>{avatarLetter}</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography fontWeight="bold" color="primary.main" fontSize={15}>{c.username}</Typography>
                      {isOwner && <Chip label="Tarif Sahibi" size="small" sx={{ bgcolor: '#ffecb3', color: '#ff9800', fontSize: 12, ml: 1 }} />}
                      {isMine && <Chip label="Siz" size="small" sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontSize: 12, ml: 1 }} />}
                      <Typography color="text.secondary" fontSize={12} sx={{ ml: 1 }}>{formatDate(c.createdAt)}</Typography>
                      {isEdited && <Typography color="#aaa" fontSize={12} fontStyle="italic" sx={{ ml: 1 }}>düzenlendi</Typography>}
                    </Box>
                    {editingId === c._id ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                        <TextField
                          value={editingText}
                          onChange={e => setEditingText(e.target.value)}
                          size="small"
                          fullWidth
                          sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}
                          autoFocus
                        />
                        <Button variant="contained" size="small" sx={{ ml: 1 }} onClick={handleUpdateComment} disabled={!editingText.trim()}>Kaydet</Button>
                        <IconButton sx={{ ml: 1 }} onClick={() => { setEditingId(null); setEditingText(''); }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <Typography fontSize={15} sx={{ mt: 0.5 }}>{c.text}</Typography>
                    )}
                    {/* Cevapla butonu ve kutusu */}
                    {replyingTo === c._id ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                        <TextField
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          size="small"
                          fullWidth
                          placeholder="Cevabınızı yazın..."
                          sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}
                          autoFocus
                        />
                        <Button variant="contained" size="small" sx={{ ml: 1 }} onClick={() => handleAddReply(c._id)} disabled={!replyText.trim()}>Gönder</Button>
                        <Button size="small" sx={{ ml: 1 }} onClick={() => { setReplyingTo(null); setReplyText(''); }}>İptal</Button>
                      </Box>
                    ) : (
                      <Button size="small" sx={{ mt: 1, color: '#1976d2', fontWeight: 'bold' }} onClick={() => setReplyingTo(c._id)}>Cevapla</Button>
                    )}
                    {/* Cevaplar */}
                    {comments.filter(r => r.parentCommentId?.toString() === c._id?.toString()).map((r) => {
                      const isOwnerR = r.userId === recipe.userId;
                      const isMineR = r.userId === currentUserId;
                      const avatarLetterR = r.username?.[0]?.toUpperCase() || '?';
                      const isEditedR = r.updatedAt && r.updatedAt !== r.createdAt;
                      return (
                        <Box key={r._id} sx={{ display: 'flex', alignItems: 'flex-start', mt: 2, ml: 5, bgcolor: '#f9f9f9', borderRadius: 2, p: 2, boxShadow: 0 }}>
                          <Avatar sx={{ bgcolor: isOwnerR ? '#ffb300' : '#e0e0e0', color: '#3949ab', fontWeight: 'bold', mr: 2 }}>{avatarLetterR}</Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography fontWeight="bold" color="primary.main" fontSize={15}>{r.username}</Typography>
                              {isOwnerR && <Chip label="Tarif Sahibi" size="small" sx={{ bgcolor: '#ffecb3', color: '#ff9800', fontSize: 12, ml: 1 }} />}
                              {isMineR && <Chip label="Siz" size="small" sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontSize: 12, ml: 1 }} />}
                              <Typography color="text.secondary" fontSize={12} sx={{ ml: 1 }}>{formatDate(r.createdAt)}</Typography>
                              {isEditedR && <Typography color="#aaa" fontSize={12} fontStyle="italic" sx={{ ml: 1 }}>düzenlendi</Typography>}
                            </Box>
                            {editingId === r._id ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                                <TextField
                                  value={editingText}
                                  onChange={e => setEditingText(e.target.value)}
                                  size="small"
                                  fullWidth
                                  sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}
                                  autoFocus
                                />
                                <Button variant="contained" size="small" sx={{ ml: 1 }} onClick={handleUpdateComment} disabled={!editingText.trim()}>Kaydet</Button>
                                <IconButton sx={{ ml: 1 }} onClick={() => { setEditingId(null); setEditingText(''); }}>
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            ) : (
                              <Typography fontSize={15} sx={{ mt: 0.5 }}>{r.text}</Typography>
                            )}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                            <IconButton onClick={() => handleLikeComment(r._id)}>
                              <span style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ color: r.liked ? '#e53935' : '#888', fontSize: 20, marginRight: 4 }}>
                                  {r.liked ? '❤️' : '🤍'}
                                </span>
                                <span style={{ color: r.liked ? '#e53935' : '#888', fontWeight: 600 }}>{r.likeCount || 0}</span>
                              </span>
                            </IconButton>
                            {isMineR && editingId !== r._id && (
                              <IconButton size="small" onClick={() => handleEditComment(r)}><EditIcon fontSize="small" /></IconButton>
                            )}
                            {isMineR && editingId !== r._id && (
                              <IconButton size="small" onClick={() => handleDeleteComment(r._id)}><DeleteIcon fontSize="small" /></IconButton>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <IconButton onClick={() => handleLikeComment(c._id)}>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: c.liked ? '#e53935' : '#888', fontSize: 20, marginRight: 4 }}>
                          {c.liked ? '❤️' : '🤍'}
                        </span>
                        <span style={{ color: c.liked ? '#e53935' : '#888', fontWeight: 600 }}>{c.likeCount || 0}</span>
                      </span>
                    </IconButton>
                    {isMine && editingId !== c._id && (
                      <IconButton size="small" onClick={() => handleEditComment(c)}><EditIcon fontSize="small" /></IconButton>
                    )}
                    {isMine && editingId !== c._id && (
                      <IconButton size="small" onClick={() => handleDeleteComment(c._id)}><DeleteIcon fontSize="small" /></IconButton>
                    )}
                  </Box>
                </Box>
              );
            })
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, bgcolor: '#fff', borderRadius: 1, p: 1 }}>
          <TextField
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Yorumunuzu yazın..."
            size="small"
            fullWidth
            sx={{ mr: 2 }}
          />
          <Button variant="contained" onClick={handleAddComment} disabled={!commentText.trim()}>Gönder</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default RecipeDetailPage; 