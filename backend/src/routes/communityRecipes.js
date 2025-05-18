const express = require('express');
const router = express.Router();
const CommunityRecipe = require('../models/CommunityRecipe');
const SavedRecipe = require('../models/SavedRecipe');
const Like = require('../models/Like');
const auth = require('../middleware/auth');

// Topluluk tariflerini listele (beğeni sayısına göre sıralı)
router.get('/', auth, async (req, res) => {
  try {
    const recipes = await CommunityRecipe.find().sort({ likeCount: -1 });
    let userId = null;
    if (req.user && req.user.userId) userId = req.user.userId;
    // Her tarif için liked bilgisini ekle
    let recipesWithLiked = [];
    if (userId) {
      const likes = await Like.find({ userId });
      const likedIds = new Set(likes.map(l => l.recipeId.toString()));
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
    username: req.user.email,
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
    const newLike = new Like({
      userId: req.user.userId,
      recipeId: req.params.id
    });
    await newLike.save();
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

module.exports = router; 