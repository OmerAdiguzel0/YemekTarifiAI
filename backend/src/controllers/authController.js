const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Kullanıcı kaydı
// @route   POST /api/auth/kayit
// @access  Public
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Kullanıcı var mı kontrol et
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Bu email adresi zaten kayıtlı' });
        }

        // Yeni kullanıcı oluştur
        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu' });
    } catch (error) {
        console.error('Kayıt hatası:', error);
        res.status(500).json({ error: 'Kayıt işlemi sırasında bir hata oluştu' });
    }
};

// @desc    Kullanıcı girişi
// @route   POST /api/auth/giris
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kullanıcıyı bul (şifre dahil)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Email veya şifre hatalı' });
        }

        // Şifreyi kontrol et
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Email veya şifre hatalı' });
        }

        // Token oluştur
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Token'ı gönder
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({ error: 'Giriş işlemi sırasında bir hata oluştu' });
    }
};

// @desc    Kullanıcı çıkışı
// @route   GET /api/auth/cikis
// @access  Private
const logout = (req, res) => {
    res.json({ message: 'Başarıyla çıkış yapıldı' });
};

// Token oluştur ve cookie'ye kaydet
const sendTokenResponse = (user, statusCode, res) => {
    // Token oluştur
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
};

module.exports = {
    register,
    login,
    logout
}; 