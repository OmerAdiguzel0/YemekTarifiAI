const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityRecipe',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Bir kullanıcının aynı tarifi birden fazla kez beğenmesini önlemek için bileşik indeks
likeSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema); 