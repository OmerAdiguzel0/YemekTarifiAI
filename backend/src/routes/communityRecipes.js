const express = require('express');
const router = express.Router();
const CommunityRecipe = require('../models/CommunityRecipe');
const SavedRecipe = require('../models/SavedRecipe');
const Like = require('../models/Like');
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');

// Topluluk tariflerini listele (beğeni sayısına göre sıralı)
router.get('/', auth, async (req, res) => {
  try {
    const { title, ingredient } = req.query;
    let filter = {};
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    if (ingredient) {
      // Birden fazla malzeme desteği (AND mantığı, $and ile)
      const ingredientsArr = ingredient.split(',').map(i => i.trim()).filter(Boolean);
      if (ingredientsArr.length > 1) {
        filter.$and = ingredientsArr.map(ing => ({ ingredients: { $elemMatch: { $regex: ing, $options: 'i' } } }));
      } else {
        filter.ingredients = { $elemMatch: { $regex: ingredient, $options: 'i' } };
      }
    }
    const recipes = await CommunityRecipe.find(filter).sort({ likeCount: -1 });
    let userId = null;
    if (req.user && req.user.userId) userId = req.user.userId;
    // Her tarif için liked bilgisini ekle
    let recipesWithLiked = [];
    if (userId) {
      const likes = await Like.find({ userId });
      const likedIds = new Set(likes.filter(l => l.recipeId).map(l => l.recipeId.toString()));
      recipesWithLiked = recipes.map(r => ({
        ...r.toObject(),
        liked: likedIds.has(r._id.toString())
      }));
    } else {
      recipesWithLiked = recipes.map(r => ({ ...r.toObject(), liked: false }));
    }
    res.json(recipesWithLiked);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Yeni topluluk tarifi oluştur
router.post('/', auth, async (req, res) => {
  console.log('req.user:', req.user);
  const { title, description, ingredients, steps, preferences } = req.body;
  const newRecipe = new CommunityRecipe({
    userId: req.user.userId,
    username: req.user.username,
    title,
    description,
    ingredients,
    steps,
    preferences
  });
  try {
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Tarifi beğen
router.post('/:id/like', auth, async (req, res) => {
  try {
    const recipe = await CommunityRecipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Tarif bulunamadı' });
    }
    const existingLike = await Like.findOne({ userId: req.user.userId, recipeId: req.params.id });
    
    if (existingLike) {
      // Beğeniyi geri al
      await Like.deleteOne({ _id: existingLike._id });
      recipe.likeCount = Math.max(0, recipe.likeCount - 1);
      await recipe.save();
      return res.json({ message: 'Beğeni geri alındı', liked: false });
    }

    // Yeni beğeni ekle
    await Like.create({ userId: req.user.userId, recipeId: req.params.id });
    recipe.likeCount += 1;
    await recipe.save();
    res.json({ message: 'Tarif beğenildi', liked: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tarifi kaydet
router.post('/:id/save', auth, async (req, res) => {
  try {
    const recipe = await CommunityRecipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Tarif bulunamadı' });
    }
    const existingSave = await SavedRecipe.findOne({ userId: req.user.userId, recipeId: req.params.id, type: 'community' });
    if (existingSave) {
      return res.status(400).json({ message: 'Bu tarifi zaten kaydettiniz' });
    }
    console.log('Kayıt ekleniyor:', {
      userId: req.user.userId,
      recipeId: req.params.id,
      type: 'community'
    });
    const newSavedRecipe = new SavedRecipe({
      userId: req.user.userId,
      recipeId: req.params.id,
      type: 'community'
    });
    await newSavedRecipe.save();
    console.log('SavedRecipe kaydı:', newSavedRecipe);
    res.json({ message: 'Tarif kaydedildi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Kendi paylaştığı topluluk tarifleri
router.get('/mine', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipes = await CommunityRecipe.find({ userId }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Topluluk tarifini güncelle
router.put('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipe = await CommunityRecipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Tarif bulunamadı' });
    }
    if (recipe.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Bu tarifi sadece paylaşan kullanıcı güncelleyebilir' });
    }
    const { title, description, ingredients, steps, preferences } = req.body;
    recipe.title = title;
    recipe.description = description;
    recipe.ingredients = ingredients;
    recipe.steps = steps;
    recipe.preferences = preferences || [];
    await recipe.save();
    res.json({ message: 'Tarif güncellendi', recipe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Topluluk tarifini sil
router.delete('/:id', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipe = await CommunityRecipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Tarif bulunamadı' });
    }
    
    if (recipe.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Bu tarifi sadece paylaşan kullanıcı silebilir' });
    }

    // İlişkili kayıtları sil
    await Promise.all([
      CommunityRecipe.deleteOne({ _id: req.params.id }),
      SavedRecipe.deleteMany({ recipeId: req.params.id, type: 'community' }),
      Like.deleteMany({ recipeId: req.params.id })
    ]);

    res.json({ message: 'Tarif başarıyla silindi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bir tarife ait yorumları listele (likeCount ve liked bilgisini ekle)
router.get('/:id/comments', auth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const comments = await Comment.find({ recipeId: req.params.id }).sort({ createdAt: 1 });
    let result = [];
    if (userId) {
      const likes = await Like.find({ userId, commentId: { $in: comments.map(c => c._id) } });
      const likedIds = new Set(likes.map(l => l.commentId.toString()));
      for (const c of comments) {
        const likeCount = await Like.countDocuments({ commentId: c._id });
        result.push({ ...c.toObject(), likeCount, liked: likedIds.has(c._id.toString()) });
      }
    } else {
      for (const c of comments) {
        const likeCount = await Like.countDocuments({ commentId: c._id });
        result.push({ ...c.toObject(), likeCount, liked: false });
      }
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bir tarife yorum ekle
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text, parentCommentId } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Yorum metni boş olamaz' });
    }
    const commentData = {
      recipeId: req.params.id,
      userId: req.user.userId,
      username: req.user.username,
      text: text.trim()
    };
    if (parentCommentId) commentData.parentCommentId = parentCommentId;
    const comment = new Comment(commentData);
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Yorum sil (sadece yorumu yazan veya admin)
router.delete('/comments/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Yorum bulunamadı' });
    }
    if (comment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bu yorumu sadece yazan kullanıcı silebilir' });
    }
    await Comment.deleteOne({ _id: req.params.commentId });
    res.json({ message: 'Yorum silindi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Yorum güncelle (sadece yazan kullanıcı)
router.put('/comments/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Yorum bulunamadı' });
    }
    if (comment.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bu yorumu sadece yazan kullanıcı güncelleyebilir' });
    }
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Yorum metni boş olamaz' });
    }
    comment.text = text.trim();
    await comment.save();
    res.json({ message: 'Yorum güncellendi', comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Yorum beğen veya beğeniyi kaldır
router.post('/comments/:commentId/like', auth, async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user.userId;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Yorum bulunamadı' });
    }
    const existingLike = await Like.findOne({ userId, commentId });
    let liked;
    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      liked = false;
    } else {
      await Like.create({ userId, commentId });
      liked = true;
    }
    const likeCount = await Like.countDocuments({ commentId });
    res.json({ liked, likeCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 