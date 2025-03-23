import express from 'express';
import { recipeController } from '../controllers/recipe.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Herkese açık rotalar
router.get('/', recipeController.getAll);
router.get('/:id', recipeController.getById);

// Oturum gerektiren rotalar
router.post('/', authMiddleware, recipeController.create);
router.post('/ai-recipe', authMiddleware, recipeController.getAIRecipe);
router.post('/:id/save', authMiddleware, recipeController.saveRecipe);

export default router; 