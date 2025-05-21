import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

const MyCommunityRecipesPage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/giris');
        return;
      }
      const response = await fetch(`${API_URL}/community/recipes/mine`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 403) {
        localStorage.removeItem('token');
        navigate('/giris');
        return;
      }
      if (!response.ok) {
        throw new Error('Tarifler yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setPendingDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/community/recipes/${pendingDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Tarif silinemedi');
      }
      setRecipes(prev => prev.filter(r => r._id !== pendingDeleteId));
      setDeleteDialogOpen(false);
      setPendingDeleteId(null);
    } catch (error) {
      alert(error.message || 'Tarif silinemedi');
      setDeleteDialogOpen(false);
      setPendingDeleteId(null);
    }
  };

  const handleEdit = (recipe) => {
    navigate(`/topluluk-tariflerim/duzenle/${recipe._id}`, { state: { recipe } });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate('/topluluk-tarifleri')} sx={{ mr: 2, color: 'primary.main' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" color="primary.main" fontWeight="bold">
          Tariflerim
        </Typography>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {recipes.length === 0 ? (
        <Alert severity="info">Henüz topluluk tarifi paylaşmadınız.</Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {recipes.map((recipe) => (
            <Card key={recipe._id} elevation={3} sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <RestaurantIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" component="h2" color="primary.main" sx={{ flex: 1 }}>
                    {recipe.title}
                  </Typography>
                  <IconButton onClick={() => handleEdit(recipe)} color="primary" sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(recipe._id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Malzemeler:
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                    {recipe.ingredients.slice(0, 3).join(', ')}
                    {recipe.ingredients.length > 3 && '...'}
                  </Typography>
                </Box>
                {recipe.preferences && recipe.preferences.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {recipe.preferences.map((preference, index) => (
                      <Chip
                        key={index}
                        label={preference}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Tarifi Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>Bu tarifi silmek istediğinize emin misiniz?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Vazgeç</Button>
          <Button onClick={confirmDelete} color="error">Sil</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyCommunityRecipesPage; 