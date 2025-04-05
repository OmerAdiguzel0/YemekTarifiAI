const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');

// Tüm tarifleri getir
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Yeni tarif oluştur
router.post('/', async (req, res) => {
  const recipe = new Recipe({
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    aiDescription: req.body.aiDescription,
    dietaryTags: req.body.dietaryTags,
    cookingTime: req.body.cookingTime,
    difficulty: req.body.difficulty
  });

  try {
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Diğer CRUD operasyonları (sonra ekleyeceğiz)
// ... existing code ...

module.exports = router;