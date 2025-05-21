import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CommunityRecipeSharePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleShare = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title || !description || !ingredients || !steps) {
      setError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const recipeData = {
        title,
        description,
        ingredients: ingredients.split('\n').filter(item => item.trim()),
        steps: steps.split('\n').filter(item => item.trim()),
        preferences: preferences ? preferences.split('\n').filter(item => item.trim()) : []
      };
      const response = await fetch(`${API_URL}/community/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(recipeData)
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error || err?.message || 'Tarif paylaşılırken bir hata oluştu.');
      }
      setSuccess('Tarif başarıyla paylaşıldı!');
      setTimeout(() => navigate('/topluluk-tarifleri', { state: { refresh: true } }), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate('/topluluk-tarifleri')} sx={{ mr: 2, color: 'primary.main' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1" color="primary.main" fontWeight="bold" gutterBottom sx={{ flex: 1 }}>
            Topluluk Tarifi Paylaş
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          * ile işaretli alanlar zorunludur.
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleShare} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Başlık *"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Açıklama *"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label="Malzemeler * (Her satıra bir malzeme yazın)"
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
            required
            fullWidth
            multiline
            minRows={4}
          />
          <TextField
            label="Yapılış Adımları * (Her satıra bir adım yazın)"
            value={steps}
            onChange={e => setSteps(e.target.value)}
            required
            fullWidth
            multiline
            minRows={4}
          />
          <TextField
            label="Tercihler (Her satıra bir tercih yazın, opsiyonel)"
            value={preferences}
            onChange={e => setPreferences(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Paylaşılıyor...' : 'Paylaş'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CommunityRecipeSharePage; 