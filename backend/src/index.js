require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// MongoDB Atlas bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));

// Middleware'ler
app.use(cors({
  origin: '*',  // Tüm kaynaklara izin ver
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Temel route
app.get('/', (req, res) => {
  res.send('AI Yemek Backend Çalışıyor');
});

// JWT Secret key'i .env dosyasına ekleyelim
process.env.JWT_SECRET = process.env.JWT_SECRET || 'yemektarifi-jwt-secret';

const recipeRoutes = require('./routes/ai');
const Recipe = require('./models/Recipe');
const authRoutes = require('./routes/auth'); // Yeni eklenen

// Routes
app.use('/api/ai', recipeRoutes);
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/auth', authRoutes); // Yeni eklenen

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});

// Hata yönetimi ekleyelim
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} zaten kullanımda!`);
    // Burada isteğe bağlı olarak alternatif port kullanımı eklenebilir
  } else {
    console.error('Sunucu hatası:', error);
  }
});

// SIGINT (Ctrl+C) ile kapatmayı yönet
process.on('SIGINT', () => {
  server.close(() => {
    console.log('\nSunucu kapatıldı');
    process.exit(0);
  });
});