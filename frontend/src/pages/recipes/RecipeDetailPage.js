import React from 'react';
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

const RecipeDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recipe = location.state?.recipe;

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
    if (typeof recipe.generatedRecipe === 'string') {
      parsedRecipe = {
        ...recipe,
        generatedRecipe: JSON.parse(recipe.generatedRecipe)
      };
    }
  } catch (error) {
    console.error('Error parsing recipe:', error);
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
            {parsedRecipe.generatedRecipe.title}
          </Typography>
          <IconButton onClick={handleShare} color="primary">
            <ShareIcon />
          </IconButton>
        </Box>

        <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {parsedRecipe.preferences.map((preference, index) => (
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
          {parsedRecipe.ingredients.map((ingredient, index) => (
            <ListItem key={index}>
              <ListItemText primary={`• ${ingredient}`} />
            </ListItem>
          ))}
        </List>

        <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
          Hazırlanışı
        </Typography>
        <List sx={{ mb: 4 }}>
          {parsedRecipe.generatedRecipe.instructions.map((instruction, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${index + 1}. ${instruction}`} />
            </ListItem>
          ))}
        </List>

        {parsedRecipe.generatedRecipe.tips && parsedRecipe.generatedRecipe.tips.length > 0 && (
          <>
            <Typography variant="h5" sx={{ mb: 2, color: 'primary.main' }}>
              Püf Noktaları
            </Typography>
            <List>
              {parsedRecipe.generatedRecipe.tips.map((tip, index) => (
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
      </Paper>
    </Container>
  );
};

export default RecipeDetailPage; 