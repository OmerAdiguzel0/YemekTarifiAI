import { Router } from 'express';
import {
  generateRecipe,
  getAllRecipes,
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe
} from '../controllers/recipe.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/generate', authMiddleware, generateRecipe);
router.get('/', getAllRecipes);
router.post('/', authMiddleware, createRecipe);
router.get('/:id', getRecipeById);
router.put('/:id', authMiddleware, updateRecipe);
router.delete('/:id', authMiddleware, deleteRecipe);

export default router; 