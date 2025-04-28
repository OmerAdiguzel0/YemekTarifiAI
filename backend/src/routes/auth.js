const express = require('express');
const {
    register,
    login,
    logout
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// Token doğrulama endpoint'i
router.get('/verify', authenticateToken, (req, res) => {
    res.json({ message: 'Token geçerli' });
});

module.exports = router; 