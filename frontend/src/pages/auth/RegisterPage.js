import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Alert
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        ad: '',
        soyad: '',
        email: '',
        sifre: '',
        sifreTekrar: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { ad, soyad, email, sifre, sifreTekrar } = formData;

        if (!ad || !soyad || !email || !sifre || !sifreTekrar) {
            setError('Lütfen tüm alanları doldurun');
            return;
        }

        if (sifre !== sifreTekrar) {
            setError('Şifreler eşleşmiyor');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await authService.register({
                username: ad + ' ' + soyad,
                email,
                password: sifre
            });
            navigate('/giris');
        } catch (error) {
            console.error('Kayıt hatası:', error);
            setError(error.response?.data?.error || 'Kayıt olurken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ mb: 5, textAlign: 'center' }}>
                    <Typography variant="h3" component="h1" sx={{ color: '#1a237e', fontWeight: 'bold', mb: 1 }}>
                        YemekTarifiAI
                    </Typography>
                    <Typography variant="subtitle1" sx={{ color: '#5c6bc0' }}>
                        Yapay zeka ile yemek tarifleri
                    </Typography>
                </Box>

                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        width: '100%',
                        borderRadius: 3,
                        bgcolor: 'white',
                    }}
                >
                    <Typography variant="h5" component="h2" sx={{ textAlign: 'center', mb: 3, color: '#1a237e', fontWeight: 'bold' }}>
                        Kayıt Ol
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Ad"
                            name="ad"
                            autoComplete="given-name"
                            value={formData.ad}
                            onChange={handleChange}
                            sx={{
                                mb: 2,
                                '& label': { color: '#1a237e' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#e0e0e0' },
                                    '&:hover fieldset': { borderColor: '#3949ab' },
                                    '&.Mui-focused fieldset': { borderColor: '#3949ab' },
                                },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Soyad"
                            name="soyad"
                            autoComplete="family-name"
                            value={formData.soyad}
                            onChange={handleChange}
                            sx={{
                                mb: 2,
                                '& label': { color: '#1a237e' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#e0e0e0' },
                                    '&:hover fieldset': { borderColor: '#3949ab' },
                                    '&.Mui-focused fieldset': { borderColor: '#3949ab' },
                                },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            autoComplete="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            sx={{
                                mb: 2,
                                '& label': { color: '#1a237e' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#e0e0e0' },
                                    '&:hover fieldset': { borderColor: '#3949ab' },
                                    '&.Mui-focused fieldset': { borderColor: '#3949ab' },
                                },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Şifre"
                            name="sifre"
                            type="password"
                            value={formData.sifre}
                            onChange={handleChange}
                            sx={{
                                mb: 2,
                                '& label': { color: '#1a237e' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#e0e0e0' },
                                    '&:hover fieldset': { borderColor: '#3949ab' },
                                    '&.Mui-focused fieldset': { borderColor: '#3949ab' },
                                },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Şifre Tekrar"
                            name="sifreTekrar"
                            type="password"
                            value={formData.sifreTekrar}
                            onChange={handleChange}
                            sx={{
                                mb: 3,
                                '& label': { color: '#1a237e' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#e0e0e0' },
                                    '&:hover fieldset': { borderColor: '#3949ab' },
                                    '&.Mui-focused fieldset': { borderColor: '#3949ab' },
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 2,
                                mb: 3,
                                py: 1.5,
                                bgcolor: '#3949ab',
                                '&:hover': { bgcolor: '#283593' },
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '1rem',
                            }}
                        >
                            {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <RouterLink
                                to="/giris"
                                style={{
                                    color: '#5c6bc0',
                                    textDecoration: 'none',
                                }}
                            >
                                Zaten hesabınız var mı? <span style={{ color: '#3949ab', fontWeight: 'bold' }}>Giriş yapın</span>
                            </RouterLink>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default RegisterPage; 