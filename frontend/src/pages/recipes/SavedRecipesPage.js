import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { API_URL } from '../../config';

const SavedRecipesPage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/giris');
        return;
      }

      const response = await fetch(`${API_URL}/recipe/user-recipes`, {
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
        throw new Error('Kaydedilen tarifler yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      console.log('Saved recipes response:', data);
      setRecipes(data.recipes || []);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId, event) => {
    event.stopPropagation();
    if (deleting) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/giris');
        return;
      }

      const response = await fetch(`${API_URL}/recipe/${recipeId}`, {
        method: 'DELETE',
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
        throw new Error('Tarif silinirken bir hata oluştu');
      }

      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== recipeId));
    } catch (error) {
      setError(error.message);
      console.error('Error deleting recipe:', error);
    } finally {
      setDeleting(false);
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
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={() => navigate('/')}
          sx={{ mr: 2, color: 'primary.main' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" color="primary.main" fontWeight="bold">
          Kaydedilen Tarifler
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {recipes.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Henüz kaydedilmiş tarifiniz bulunmuyor.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/tarif-olustur')}
            sx={{ mt: 2 }}
          >
            Yeni Tarif Oluştur
          </Button>
        </Paper>
      ) : (
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
                    {recipe.generatedRecipe.title}
                  </Typography>
                  <IconButton
                    onClick={(e) => handleDeleteRecipe(recipe._id, e)}
                    disabled={deleting}
                    sx={{ 
                      color: 'error.main',
                      '&:hover': {
                        bgcolor: 'error.light',
                        color: 'error.dark'
                      },
                      '&.Mui-disabled': {
                        color: 'grey.400'
                      }
                    }}
                  >
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
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Recipe Detail Dialog */}
      {selectedRecipe && (
        <Paper
          elevation={4}
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            p: 4,
            bgcolor: 'background.paper',
            boxShadow: 24,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2" color="primary.main" fontWeight="bold">
              {selectedRecipe.title}
            </Typography>
            <IconButton onClick={() => setSelectedRecipe(null)} color="primary">
              <ArrowBackIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" color="primary.main" gutterBottom>
            Malzemeler
          </Typography>
          <List sx={{ mb: 3 }}>
            {(selectedRecipe.ingredients || []).map((ingredient, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <RestaurantIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={ingredient} />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" color="primary.main" gutterBottom>
            Hazırlanışı
          </Typography>
          <List>
            {(selectedRecipe.instructions || []).map((instruction, index) => (
              <ListItem key={index}>
                <ListItemText 
                  primary={`${index + 1}. ${instruction}`}
                  sx={{ '& .MuiListItemText-primary': { lineHeight: 1.8 } }}
                />
              </ListItem>
            ))}
          </List>

          {selectedRecipe.tips && selectedRecipe.tips.length > 0 && (
            <>
              <Typography variant="h6" color="primary.main" gutterBottom sx={{ mt: 3 }}>
                Püf Noktaları
              </Typography>
              <List>
                {(selectedRecipe.tips || []).map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={tip}
                      sx={{ 
                        '& .MuiListItemText-primary': { 
                          fontStyle: 'italic',
                          color: 'text.secondary'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default SavedRecipesPage; 