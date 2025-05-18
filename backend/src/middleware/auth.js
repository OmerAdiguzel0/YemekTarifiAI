const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header bulunamadı' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Bearer token bulunamadı' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error('Token doğrulama hatası:', err);
                return res.status(403).json({ error: 'Geçersiz veya süresi dolmuş token' });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Auth middleware hatası:', error);
        return res.status(500).json({ error: 'Yetkilendirme işlemi sırasında bir hata oluştu' });
    }
};

module.exports = authenticateToken; 