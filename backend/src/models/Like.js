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
    required: false
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Bir kullanıcının aynı tarifi birden fazla kez beğenmesini önlemek için bileşik indeks
likeSchema.index({ userId: 1, recipeId: 1 }, { unique: true, partialFilterExpression: { recipeId: { $exists: true } } });
// Bir kullanıcının aynı yorumu birden fazla kez beğenmesini önlemek için bileşik indeks
likeSchema.index({ userId: 1, commentId: 1 }, { unique: true, partialFilterExpression: { commentId: { $exists: true } } });

likeSchema.pre('save', function(next) {
  if (!this.recipeId && !this.commentId) {
    return next(new Error('Either recipeId or commentId must be set'));
  }
  if (this.recipeId && this.commentId) {
    return next(new Error('Only one of recipeId or commentId must be set'));
  }
  next();
});

module.exports = mongoose.model('Like', likeSchema); 