const SavedRecipe = require('../models/SavedRecipe');

// Tarif kaydetme
const saveRecipe = async (req, res) => {
    try {
        const { title, ingredients, instructions, tips } = req.body;
        const userId = req.user.id;

        // Eksik alan kontrolü
        if (!title || !ingredients || !instructions) {
            return res.status(400).json({ error: 'Eksik bilgi gönderildi' });
        }

        // Yeni tarifi kaydet
        const savedRecipe = new SavedRecipe({
            userId,
            title,
            ingredients,
            instructions,
            tips: tips || []
        });

        await savedRecipe.save();

        res.status(201).json({
            message: 'Tarif başarıyla kaydedildi',
            recipe: savedRecipe
        });

    } catch (error) {
        if (error.code === 11000) {
            // Aynı tarif zaten kaydedilmiş
            return res.status(400).json({ error: 'Bu tarif zaten kayıtlı' });
        }
        console.error('Tarif kaydetme hatası:', error);
        res.status(500).json({ error: 'Tarif kaydedilirken bir hata oluştu' });
    }
};

// Kaydedilen tarifleri listeleme
const getSavedRecipes = async (req, res) => {
    try {
        const userId = req.user.id;

        const recipes = await SavedRecipe.find({ userId })
            .sort({ createdAt: -1 }); // En son eklenenler başta

        res.json(recipes);

    } catch (error) {
        console.error('Tarifleri listeleme hatası:', error);
        res.status(500).json({ error: 'Tarifler listelenirken bir hata oluştu' });
    }
};

// Kaydedilen tarifi silme
const deleteSavedRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user.id;

        const recipe = await SavedRecipe.findOne({ _id: recipeId, userId });

        if (!recipe) {
            return res.status(404).json({ error: 'Tarif bulunamadı' });
        }

        await recipe.deleteOne();

        res.json({ message: 'Tarif başarıyla silindi' });

    } catch (error) {
        console.error('Tarif silme hatası:', error);
        res.status(500).json({ error: 'Tarif silinirken bir hata oluştu' });
    }
};

module.exports = {
    saveRecipe,
    getSavedRecipes,
    deleteSavedRecipe
}; 