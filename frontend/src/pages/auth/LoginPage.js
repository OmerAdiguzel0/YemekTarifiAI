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
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [sifre, setSifre] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !sifre) {
            setError('Lütfen tüm alanları doldurun');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            // Önce API'den token al
            const response = await authService.login({ email, sifre });
            
            if (response.token) {
                // Token başarıyla alındıysa, oturumu başlat
                await signIn();
                navigate('/');
            } else {
                throw new Error('Token alınamadı');
            }
        } catch (error) {
            console.error('Giriş hatası:', error);
            setError(error.message || 'Giriş yapılırken bir hata oluştu');
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
                        Giriş Yap
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            name="sifre"
                            label="Şifre"
                            type="password"
                            autoComplete="current-password"
                            value={sifre}
                            onChange={(e) => setSifre(e.target.value)}
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
                            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <RouterLink
                                to="/kayit"
                                style={{
                                    color: '#5c6bc0',
                                    textDecoration: 'none',
                                }}
                            >
                                Hesabınız yok mu? <span style={{ color: '#3949ab', fontWeight: 'bold' }}>Kayıt olun</span>
                            </RouterLink>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage; 