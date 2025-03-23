import { Router } from 'express';
import { googleAuth, getCurrentUser, updateDietPreferences } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/google', googleAuth);
router.get('/me', authMiddleware, getCurrentUser);
router.put('/diet-preferences', authMiddleware, updateDietPreferences);

export default router; 