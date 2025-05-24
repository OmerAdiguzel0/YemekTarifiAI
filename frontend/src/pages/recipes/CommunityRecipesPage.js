import React, { useState, useEffect } from 'react';
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
  Grid,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { API_URL } from '../../config';

const CommunityRecipesPage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likedRecipes, setLikedRecipes] = useState(new Set());
  const [savedRecipes, setSavedRecipes] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [titleFilter, setTitleFilter] = useState('');
  const [ingredientFilter, setIngredientFilter] = useState('');

  useEffect(() => {
    fetchRecipes();
    // eslint-disable-next-line
  }, [titleFilter, ingredientFilter]);

  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/giris');
        return;
      }
      let url = `${API_URL}/community/recipes`;
      const params = [];
      if (titleFilter) params.push(`title=${encodeURIComponent(titleFilter)}`);
      if (ingredientFilter) params.push(`ingredient=${encodeURIComponent(ingredientFilter)}`);
      if (params.length) url += `?${params.join('&')}`;
      const response = await fetch(url, {
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
      setLikedRecipes(new Set(data.filter(r => r.liked).map(r => r._id)));
      setSavedRecipes(new Set(data.filter(r => r.saved).map(r => r._id)));
    } catch (error) {
      setError(error.message);
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (recipeId, event) => {
    event.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/community/recipes/${recipeId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Tarif beğenilemedi');
      }

      const data = await response.json();
      setLikedRecipes(prev => {
        const newSet = new Set(prev);
        if (data.liked) {
          newSet.add(recipeId);
        } else {
          newSet.delete(recipeId);
        }
        return newSet;
      });
      fetchRecipes();
    } catch (error) {
      console.error('Error liking recipe:', error);
    }
  };

  const handleSave = async (recipeId, event) => {
    event.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/community/recipes/${recipeId}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        let errorMsg = 'Tarif kaydedilemedi';
        try {
          const error = await response.json();
          const errText = error?.error || error?.message || '';
          if (errText.includes('zaten kaydettiniz') || errText.includes('zaten kayıtlı')) {
            alert('Bu tarif zaten kayıtlı!');
            return;
          }
          errorMsg = errText || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      alert('Tarif başarıyla kaydedildi');
      navigate('/kaydedilen-tarifler', { state: { refresh: true } });
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert(error.message || 'Tarif kaydedilirken bir hata oluştu');
    }
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
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() => navigate('/')}
            sx={{ mr: 2, color: 'primary.main' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" color="primary.main" fontWeight="bold">
            Topluluk Tarifleri
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setShowFilters(v => !v)}
          >
            Filtrele
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/tarif-paylas')}
          >
            Tarif Paylaş
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/topluluk-tariflerim')}
          >
            Tariflerim
          </Button>
        </Box>
      </Box>

      {showFilters && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label="Tarif Başlığına Göre Ara"
            variant="outlined"
            value={titleFilter}
            onChange={e => setTitleFilter(e.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            label="Malzemeye Göre Ara (malzemeler arasına virgül koyun)"
            variant="outlined"
            value={ingredientFilter}
            onChange={e => setIngredientFilter(e.target.value)}
            size="small"
            fullWidth
          />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {recipes.map((recipe) => (
          <Card 
            key={recipe._id}
            elevation={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
            onClick={() => navigate(`/tarif/${recipe._id}`, { state: { recipe } })}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RestaurantIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h2" color="primary.main" sx={{ flex: 1 }}>
                  {recipe.title}
                </Typography>
                <IconButton
                  onClick={(e) => handleLike(recipe._id, e)}
                  color={likedRecipes.has(recipe._id) ? 'error' : 'default'}
                  sx={{ mr: 1 }}
                >
                  {likedRecipes.has(recipe._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                    {recipe.likeCount || 0}
                  </Typography>
                </IconButton>
                {savedRecipes.has(recipe._id) ? (
                  <Chip
                    label="Tarif Kayıtlı"
                    color="success"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={(e) => handleSave(recipe._id, e)}
                    size="small"
                  >
                    Tarifi Kaydet
                  </Button>
                )}
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
    </Container>
  );
};

export default CommunityRecipesPage; 