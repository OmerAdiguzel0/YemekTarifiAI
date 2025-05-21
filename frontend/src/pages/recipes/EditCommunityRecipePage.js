import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { API_URL } from '../../config';

const EditCommunityRecipePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [preferences, setPreferences] = useState('');

  useEffect(() => {
    if (location.state && location.state.recipe) {
      const r = location.state.recipe;
      setTitle(r.title || '');
      setDescription(r.description || '');
      setIngredients((r.ingredients || []).join('\n'));
      setSteps((r.steps || []).join('\n'));
      setPreferences((r.preferences || []).join('\n'));
      setLoading(false);
    } else {
      fetchRecipe();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchRecipe = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/giris');
        return;
      }
      const response = await fetch(`${API_URL}/community/recipes/${id}`, {
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
        throw new Error('Tarif getirilemedi');
      }
      const data = await response.json();
      setTitle(data.title || '');
      setDescription(data.description || '');
      setIngredients((data.ingredients || []).join('\n'));
      setSteps((data.steps || []).join('\n'));
      setPreferences((data.preferences || []).join('\n'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title || !description || !ingredients || !steps) {
      setError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const recipeData = {
        title,
        description,
        ingredients: ingredients.split('\n').filter(i => i.trim()),
        steps: steps.split('\n').filter(s => s.trim()),
        preferences: preferences ? preferences.split('\n').filter(p => p.trim()) : []
      };
      const response = await fetch(`${API_URL}/community/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(recipeData)
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error || err?.message || 'Tarif güncellenemedi.');
      }
      setSuccess('Tarif başarıyla güncellendi!');
      setTimeout(() => navigate('/topluluk-tariflerim'), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
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
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate('/topluluk-tariflerim')} sx={{ mr: 2, color: 'primary.main' }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1" color="primary.main" fontWeight="bold" gutterBottom sx={{ flex: 1 }}>
            Tarifi Düzenle
          </Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <Box component="form" onSubmit={handleUpdate} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            disabled={saving}
            sx={{ mt: 2 }}
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditCommunityRecipePage; 