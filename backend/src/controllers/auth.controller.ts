import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/user.model';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req: Request, res: Response) => {
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
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        email,
        name,
        googleId,
        dietPreferences: []
      });
    }

    // JWT token oluştur
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        dietPreferences: user.dietPreferences
      },
      accessToken
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ message: 'Kimlik doğrulama hatası' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-googleId');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Kullanıcı bilgileri alınamadı' });
  }
};

export const updateDietPreferences = async (req: Request, res: Response) => {
  try {
    const { dietPreferences } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { dietPreferences },
      { new: true }
    ).select('-googleId');

    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update diet preferences error:', error);
    res.status(500).json({ message: 'Diyet tercihleri güncellenemedi' });
  }
}; 