const mongoose = require('mongoose');

const savedRecipeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    ingredients: [{
        type: String,
        required: true
    }],
    instructions: [{
        type: String,
        required: true
    }],
    tips: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Bir kullanıcının aynı tarifi birden fazla kez kaydetmesini önlemek için bileşik indeks
savedRecipeSchema.index({ userId: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('SavedRecipe', savedRecipeSchema); 