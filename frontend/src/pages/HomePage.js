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
            </Container>
        </Box>
    );
};

export default HomePage; 