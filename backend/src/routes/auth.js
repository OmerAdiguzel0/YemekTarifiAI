const express = require('express');
const {
    register,
    login,
    logout,
    changePassword,
    changeUsername
} = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.post('/change-password', auth, changePassword);
router.post('/change-username', auth, changeUsername);

// Token doğrulama endpoint'i
router.get('/verify', auth, (req, res) => {
    res.json({ message: 'Token geçerli' });
});

module.exports = router; 