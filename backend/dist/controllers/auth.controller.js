"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDietPreferences = exports.getCurrentUser = exports.googleAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const user_model_1 = require("../models/user.model");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(400).json({ message: 'Geçersiz token' });
        }
        const { email, name, sub: googleId } = payload;
        // Kullanıcıyı bul veya oluştur
        let user = await user_model_1.User.findOne({ email });
        if (!user) {
            user = await user_model_1.User.create({
                email,
                name,
                googleId,
                dietPreferences: []
            });
        }
        // JWT token oluştur
        const accessToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                dietPreferences: user.dietPreferences
            },
            accessToken
        });
    }
    catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ message: 'Kimlik doğrulama hatası' });
    }
};
exports.googleAuth = googleAuth;
const getCurrentUser = async (req, res) => {
    try {
        const user = await user_model_1.User.findById(req.userId).select('-googleId');
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Kullanıcı bilgileri alınamadı' });
    }
};
exports.getCurrentUser = getCurrentUser;
const updateDietPreferences = async (req, res) => {
    try {
        const { dietPreferences } = req.body;
        const user = await user_model_1.User.findByIdAndUpdate(req.userId, { dietPreferences }, { new: true }).select('-googleId');
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Update diet preferences error:', error);
        res.status(500).json({ message: 'Diyet tercihleri güncellenemedi' });
    }
};
exports.updateDietPreferences = updateDietPreferences;
