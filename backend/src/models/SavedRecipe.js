const mongoose = require('mongoose');

const savedRecipeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        enum: ['ai', 'community'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Bir kullanıcının aynı tarifi birden fazla kez kaydetmesini önlemek için bileşik indeks
savedRecipeSchema.index({ userId: 1, recipeId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('SavedRecipe', savedRecipeSchema); 