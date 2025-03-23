import { Router } from 'express';
import { 
  getAllIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  getIngredientById
} from '../controllers/ingredient.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllIngredients);
router.post('/', authMiddleware, createIngredient);
router.get('/:id', getIngredientById);
router.put('/:id', authMiddleware, updateIngredient);
router.delete('/:id', authMiddleware, deleteIngredient);

export default router; 