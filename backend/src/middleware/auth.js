const jwt = require('jsonwebtoken');

// JWT Secret key - normalde .env dosyasında saklanmalı
const JWT_SECRET = process.env.JWT_SECRET || 'yemektarifi-jwt-secret';

module.exports = function(req, res, next) {
  // Token'ı header'dan al
  const token = req.header('x-auth-token');

  // Token yoksa
  if (!token) {
    return res.status(401).json({ message: 'Yetkilendirme hatası, token bulunamadı' });
  }

  try {
    // Token'ı doğrula
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Kullanıcı bilgisini request'e ekle
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token geçersiz' });
  }
};