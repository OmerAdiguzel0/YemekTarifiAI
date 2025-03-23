import express from 'express';
import { ingredientController } from '../controllers/ingredient.controller';
import { authMiddleware } from '../middleware/auth';
import { IUser } from '../models/User';

// Express'in Request tipini genişletiyoruz
declare global {
  namespace Express {
    interface User extends IUser {} // Passport User tipini IUser ile genişletiyoruz
  }
}

const router = express.Router();

// Herkese açık rotalar
router.get('/', ingredientController.getAll);
router.get('/category/:kategori', ingredientController.getByCategory);
router.get('/search', ingredientController.search);

// Sadece admin kullanıcıların erişebileceği rotalar
router.post('/', authMiddleware, ingredientController.create);

export default router; 