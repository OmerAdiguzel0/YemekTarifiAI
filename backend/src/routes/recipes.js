const express = require('express');
const router = express.Router();
const { generateRecipe } = require('../controllers/recipeController');
const { saveRecipe, getSavedRecipes, deleteSavedRecipe } = require('../controllers/savedRecipeController');
const auth = require('../middleware/auth');

// Tarif oluşturma
router.post('/generate', auth, generateRecipe);

// Tarif kaydetme
router.post('/save', auth, saveRecipe);

// Kaydedilen tarifleri listeleme
router.get('/saved', auth, getSavedRecipes);

// Kaydedilen tarifi silme
router.delete('/saved/:id', auth, deleteSavedRecipe);

module.exports = router; 