const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Route dosyaları
const auth = require('./routes/auth');
const recipe = require('./routes/recipe');
const recipes = require('./routes/recipes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*',  // Geliştirme aşamasında tüm originlere izin ver
    credentials: true
}));
app.use(cookieParser());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch(err => console.log('MongoDB bağlantı hatası:', err));

// Route'lar
app.use('/api/auth', auth);
app.use('/api/recipe', recipe);
app.use('/api/recipes', recipes);

// Hata yakalama middleware'i
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Sunucu Hatası'
    });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
});
