const express = require('express');
const { generateRecipe, createRecipe, getUserRecipes, deleteRecipe } = require('../controllers/recipeController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Tüm route'lar için authentication gerekli
router.use(authenticateToken);

router.post('/generate', generateRecipe);
router.post('/create', createRecipe);
router.get('/user-recipes', getUserRecipes);
router.delete('/:recipeId', deleteRecipe);

module.exports = router; 