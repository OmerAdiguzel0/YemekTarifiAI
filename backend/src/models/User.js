const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Kullanıcı adı zorunludur'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email adresi zorunludur'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Geçerli bir email adresi giriniz'
        ]
    },
    password: {
        type: String,
        required: [true, 'Şifre zorunludur'],
        minlength: 6,
        select: false // Varsayılan sorgularda şifreyi getirme
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Şifre hashleme
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// JWT token oluşturma
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Şifre karşılaştırma
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 