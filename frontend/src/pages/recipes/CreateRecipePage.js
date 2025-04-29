import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton
} from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { API_URL } from '../../config';
import { useAuth } from '../../contexts/AuthContext';

const PREFERENCES = [
  { value: 'Vegan', label: 'Vegan' },
  { value: 'Vejetaryen', label: 'Vejetaryen' },
  { value: 'Glutensiz', label: 'Glutensiz' },
  { value: 'Şekersiz', label: 'Şekersiz' },
  { value: 'Düşük Kalorili', label: 'Düşük Kalorili' },
  { value: 'Laktozsuz', label: 'Laktozsuz' }
];

const CreateRecipePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [error, setError] = useState('');

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) {
      setError('Lütfen malzemeleri giriniz.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/giris');
        return;
      }

      const response = await fetch(`${API_URL}/recipes/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ingredients: ingredients.split(',').map(item => item.trim()).filter(item => item),
          preferences: selectedPreferences.map(pref => pref.value)
        })
      });

      if (response.status === 403) {
        localStorage.removeItem('token');
        navigate('/giris');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Tarif oluşturulurken bir hata oluştu');
      }

      const data = await response.json();
      setGeneratedRecipe(data);
    } catch (error) {
      setError(error.message || 'Tarif oluşturulurken bir hata oluştu.');
      console.error('Error generating recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/giris');
        return;
      }

      if (!user || (!user._id && !user.id)) {
        console.error('User data is invalid:', user);
        setError('Kullanıcı bilgileri bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      const response = await fetch(`${API_URL}/recipe/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ingredients: ingredients.split(',').map(item => item.trim()).filter(item => item),
          preferences: selectedPreferences.map(pref => pref.value),
          generatedRecipe: generatedRecipe
        })
      });

      if (response.status === 403) {
        localStorage.removeItem('token');
        navigate('/giris');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Tarif kaydedilirken bir hata oluştu');
      }

      navigate('/kaydedilen-tarifler');
    } catch (error) {
      setError(error.message || 'Tarif kaydedilirken bir hata oluştu.');
      console.error('Error saving recipe:', error);
    }
  };

  const handleNewRecipe = () => {
    setGeneratedRecipe(null);
    setIngredients('');
    setSelectedPreferences([]);
    setError('');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/')}
          sx={{ 
            mr: 2,
            color: '#1a237e',
            '&:hover': { 
              bgcolor: 'rgba(26, 35, 126, 0.04)' 
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ color: '#1a237e', fontWeight: 'bold' }}>
          Yapay Zeka ile Tarif Oluştur
        </Typography>
      </Box>

      <Typography variant="subtitle1" sx={{ color: '#5c6bc0', textAlign: 'center', mb: 4 }}>
        Elinizde bulunan malzemeleri virgülle ayırarak yazın ve tercihlerinizi seçin.
        Size uygun bir tarif önerelim.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ color: '#1a237e', mb: 2 }}>
          Malzemeler
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Örn: domates, salatalık, zeytinyağı"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Typography variant="h6" sx={{ color: '#1a237e', mb: 2 }}>
          Tercihler
        </Typography>
        <Select
          isMulti
          options={PREFERENCES}
          value={selectedPreferences}
          onChange={setSelectedPreferences}
          placeholder="Tercihlerinizi seçin"
          styles={{
            control: (base) => ({
              ...base,
              marginBottom: '20px'
            })
          }}
        />

        <Button
          variant="contained"
          fullWidth
          disabled={loading}
          onClick={handleGenerateRecipe}
          sx={{
            mt: 2,
            bgcolor: '#3949ab',
            '&:hover': { bgcolor: '#283593' },
            py: 1.5,
            fontSize: '1rem'
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
              Tarif Oluşturuluyor...
            </Box>
          ) : (
            'Tarif Oluştur'
          )}
        </Button>
      </Paper>

      {generatedRecipe && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" sx={{ color: '#1a237e', textAlign: 'center', mb: 3, fontWeight: 'bold' }}>
            {generatedRecipe.title}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ color: '#3949ab', mb: 2, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
              Malzemeler
            </Typography>
            <List>
              {generatedRecipe.ingredients.map((ingredient, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <FiberManualRecordIcon sx={{ fontSize: 8, color: '#3949ab' }} />
                  </ListItemIcon>
                  <ListItemText primary={ingredient} sx={{ color: '#1a237e' }} />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ color: '#3949ab', mb: 2, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
              Hazırlanışı
            </Typography>
            <List>
              {generatedRecipe.instructions.map((instruction, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemText 
                    primary={instruction} 
                    sx={{ 
                      color: '#1a237e',
                      '& .MuiListItemText-primary': { lineHeight: 1.6 }
                    }} 
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {generatedRecipe.tips && generatedRecipe.tips.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ color: '#3949ab', mb: 2, pb: 1, borderBottom: 1, borderColor: 'divider' }}>
                Püf Noktaları
              </Typography>
              <List>
                {generatedRecipe.tips.map((tip, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <LightbulbIcon sx={{ color: '#ffc107' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={tip} 
                      sx={{ 
                        color: '#1a237e',
                        fontStyle: 'italic',
                        '& .MuiListItemText-primary': { fontStyle: 'italic' }
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleNewRecipe}
              sx={{
                bgcolor: '#4caf50',
                '&:hover': { bgcolor: '#388e3c' },
                py: 1.5,
                fontSize: '1rem'
              }}
            >
              Yeni Tarif Oluştur
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSaveRecipe}
              sx={{
                bgcolor: '#2196f3',
                '&:hover': { bgcolor: '#1976d2' },
                py: 1.5,
                fontSize: '1rem'
              }}
            >
              Tarifi Kaydet
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default CreateRecipePage; 