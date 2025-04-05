const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [String],
  instructions: [String],
  aiDescription: String,
  dietaryTags: [String],
  cookingTime: Number,
  difficulty: { type: String, enum: ['Kolay', 'Orta', 'Zor'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);