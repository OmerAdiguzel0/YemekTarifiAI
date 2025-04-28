const express = require('express');
const router = express.Router();
const { generateRecipe } = require('../controllers/recipeController');
const { saveRecipe, getSavedRecipes, deleteSavedRecipe } = require('../controllers/savedRecipeController');
const { authenticateToken } = require('../middleware/auth');

// Tarif oluşturma
router.post('/generate', authenticateToken, generateRecipe);

// Tarif kaydetme
router.post('/save', authenticateToken, saveRecipe);

// Kaydedilen tarifleri listeleme
router.get('/saved', authenticateToken, getSavedRecipes);

// Kaydedilen tarifi silme
router.delete('/saved/:recipeId', authenticateToken, deleteSavedRecipe);

module.exports = router; 