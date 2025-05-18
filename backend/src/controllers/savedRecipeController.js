const SavedRecipe = require('../models/SavedRecipe');
const CommunityRecipe = require('../models/CommunityRecipe');
const Recipe = require('../models/Recipe');
const mongoose = require('mongoose');

// Tarif kaydetme
const saveRecipe = async (req, res) => {
    try {
        const { recipeId, type } = req.body;
        const userId = req.user.userId || req.user.id;

        if (!recipeId || !type) {
            return res.status(400).json({ error: 'Eksik bilgi gönderildi' });
        }

        // Aynı tarif zaten kaydedilmiş mi kontrol et
        const existing = await SavedRecipe.findOne({ 
            userId: new mongoose.Types.ObjectId(userId), 
            recipeId: new mongoose.Types.ObjectId(recipeId), 
            type 
        });
        if (existing) {
            return res.status(400).json({ error: 'Bu tarif zaten kayıtlı' });
        }

        // Yeni kaydı oluştur
        const savedRecipe = new SavedRecipe({
            userId: new mongoose.Types.ObjectId(userId),
            recipeId: new mongoose.Types.ObjectId(recipeId),
            type
        });
        await savedRecipe.save();

        res.status(201).json({
            message: 'Tarif başarıyla kaydedildi',
            recipe: savedRecipe
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Bu tarif zaten kayıtlı' });
        }
        console.error('Tarif kaydetme hatası:', error);
        res.status(500).json({ error: 'Tarif kaydedilirken bir hata oluştu' });
    }
};

// Kaydedilen tarifleri listeleme
const getSavedRecipes = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        const saved = await SavedRecipe.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
        console.log('Saved:', saved);

        // AI ve topluluk tariflerini ayır
        const aiRecipeIds = saved.filter(r => r.type === 'ai').map(r => r.recipeId);
        const communityRecipeIds = saved.filter(r => r.type === 'community').map(r => r.recipeId);
        console.log('Community recipe IDs:', communityRecipeIds);

        // AI tariflerini ve topluluk tariflerini detaylarıyla çek
        const aiRecipes = await Recipe.find({ _id: { $in: aiRecipeIds } });
        const communityRecipes = await CommunityRecipe.find({ _id: { $in: communityRecipeIds } });
        console.log('Community recipes:', communityRecipes);

        // Sonuçları tip bilgisiyle birleştir
        const result = [
            ...aiRecipes.map(r => {
                const savedRecipe = saved.find(s => s.recipeId.toString() === r._id.toString() && s.type === 'ai');
                return { ...r.toObject(), type: 'ai', savedRecipeId: savedRecipe?._id };
            }),
            ...communityRecipes.map(r => {
                const savedRecipe = saved.find(s => s.recipeId.toString() === r._id.toString() && s.type === 'community');
                return { ...r.toObject(), type: 'community', savedRecipeId: savedRecipe?._id };
            })
        ];

        res.json(result);
    } catch (error) {
        console.error('Tarifleri listeleme hatası:', error);
        res.status(500).json({ error: 'Tarifler listelenirken bir hata oluştu' });
    }
};

// Kayıtlı tarifi sil
const deleteSavedRecipe = async (req, res) => {
    try {
        const { id } = req.params; // SavedRecipe kaydının _id'si
        const userId = req.user.userId || req.user.id;

        const recipe = await SavedRecipe.findOne({ _id: id, userId: new mongoose.Types.ObjectId(userId) });
        if (!recipe) {
            return res.status(404).json({ error: 'Kayıtlı tarif bulunamadı' });
        }

        await SavedRecipe.deleteOne({ _id: id, userId: new mongoose.Types.ObjectId(userId) });
        res.json({ message: 'Kayıtlı tarif silindi' });
    } catch (error) {
        res.status(500).json({ error: 'Bir hata oluştu' });
    }
};

module.exports = {
    saveRecipe,
    getSavedRecipes,
    deleteSavedRecipe
}; 