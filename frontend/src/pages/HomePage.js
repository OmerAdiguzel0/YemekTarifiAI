import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    AppBar,
    Toolbar,
    Card,
    CardContent,
    CardActions
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/giris');
        } catch (error) {
            console.error('Çıkış hatası:', error);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ bgcolor: '#1a237e' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        YemekTarifiAI
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/profil')} sx={{ mr: 2 }}>
                        Profil
                    </Button>
                    <Button color="inherit" onClick={handleLogout}>
                        Çıkış Yap
                    </Button>
                </Toolbar>
            </AppBar>
            
            <Container maxWidth="md" sx={{ mt: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1a237e', textAlign: 'center' }}>
                    Hoş Geldiniz!
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#5c6bc0', textAlign: 'center', mt: 2, mb: 6 }}>
                    Yapay zeka destekli yemek tarifleri için hazırız.
                </Typography>

                <Card sx={{ maxWidth: 600, mx: 'auto', bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h5" component="h2" sx={{ color: '#1a237e', mb: 2 }}>
                            Yeni Tarif Oluştur
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#5c6bc0', mb: 2 }}>
                            Elinizdeki malzemelerle nefis tarifler oluşturun. Yapay zeka size en uygun tarifleri önerecek.
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2 }}>
                        <Button 
                            variant="contained" 
                            fullWidth
                            sx={{ 
                                bgcolor: '#3949ab',
                                '&:hover': {
                                    bgcolor: '#283593'
                                }
                            }}
                            onClick={() => navigate('/tarif-olustur')}
                        >
                            Tarif Oluşturmaya Başla
                        </Button>
                    </CardActions>
                </Card>

                <Card sx={{ maxWidth: 600, mx: 'auto', bgcolor: 'white', borderRadius: 2, boxShadow: 3, mt: 4 }}>
                    <CardContent>
                        <Typography variant="h5" component="h2" sx={{ color: '#1a237e', mb: 2 }}>
                            Topluluk Tarifleri
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#5c6bc0', mb: 2 }}>
                            Diğer kullanıcıların paylaştığı tarifleri keşfedin ve kendi tariflerinizi toplulukla paylaşın.
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2 }}>
                        <Button 
                            variant="contained" 
                            fullWidth
                            sx={{ 
                                bgcolor: '#4caf50',
                                '&:hover': {
                                    bgcolor: '#388e3c'
                                }
                            }}
                            onClick={() => navigate('/topluluk-tarifleri')}
                        >
                            Topluluk Tariflerini Keşfet
                        </Button>
                    </CardActions>
                </Card>

                <Card sx={{ maxWidth: 600, mx: 'auto', bgcolor: 'white', borderRadius: 2, boxShadow: 3, mt: 4 }}>
                    <CardContent>
                        <Typography variant="h5" component="h2" sx={{ color: '#1a237e', mb: 2 }}>
                            Kaydedilen Tarifler
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#5c6bc0', mb: 2 }}>
                            Daha önce kaydettiğiniz tarifleri görüntüleyin ve yönetin.
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2 }}>
                        <Button 
                            variant="contained" 
                            fullWidth
                            sx={{ 
                                bgcolor: '#2196f3',
                                '&:hover': {
                                    bgcolor: '#1976d2'
                                }
                            }}
                            onClick={() => navigate('/kaydedilen-tarifler')}
                        >
                            Kaydedilen Tarifleri Görüntüle
                        </Button>
                    </CardActions>
                </Card>

                
            </Container>
        </Box>
    );
};

export default HomePage; 