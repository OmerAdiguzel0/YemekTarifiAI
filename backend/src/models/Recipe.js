const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ingredients: [{
        type: String,
        required: true
    }],
    preferences: [{
        type: String,
        enum: ['Vegan', 'Vejetaryen', 'Glutensiz', 'Şekersiz', 'Düşük Kalorili', 'Laktozsuz'],
        required: true
    }],
    generatedRecipe: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Recipe', recipeSchema); 