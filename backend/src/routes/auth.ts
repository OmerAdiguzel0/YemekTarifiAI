import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const router = express.Router();

// Express'in Request tipini genişletiyoruz
interface AuthRequest extends Request {
  user?: Express.User | IUser;  // Express.User ve IUser tiplerini birleştiriyoruz
}

// Google OAuth başlatma
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'] 
}));

// Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  (req: Request, res: Response) => {
    const user = req.user as IUser;
    
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        displayName: user.displayName
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// Auth middleware
const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token bulunamadı' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = { _id: decoded.id } as IUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Geçersiz token' });
  }
};

// Mevcut kullanıcı bilgilerini getir
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req.user as IUser)._id).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Çıkış yap
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Başarıyla çıkış yapıldı' });
});

export default router; 