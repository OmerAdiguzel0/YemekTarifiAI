const Recipe = require('../models/Recipe');
const { generateRecipe: generateRecipeService } = require('../services/geminiService');

const generateRecipe = async (req, res) => {
    try {
        const { ingredients, preferences } = req.body;

        if (!ingredients || ingredients.length === 0) {
            return res.status(400).json({ error: 'Malzemeler gereklidir' });
        }

        const recipe = await generateRecipeService(ingredients, preferences);
        res.json(recipe);
    } catch (error) {
        console.error('Tarif oluşturma hatası:', error);
        res.status(500).json({ error: 'Tarif oluşturulurken bir hata oluştu' });
    }
};

const createRecipe = async (req, res) => {
    try {
        console.log('Request user object:', req.user);
        const { ingredients, preferences, generatedRecipe } = req.body;
        const userId = req.user.userId;

        console.log('User ID:', userId);

        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ error: 'Malzemeler gereklidir ve boş olamaz' });
        }

        if (!preferences || !Array.isArray(preferences)) {
            return res.status(400).json({ error: 'Tercihler gereklidir' });
        }

        if (!generatedRecipe) {
            return res.status(400).json({ error: 'Oluşturulan tarif gereklidir' });
        }

        const recipe = new Recipe({
            userId: userId,
            ingredients,
            preferences,
            generatedRecipe
        });

        await recipe.save();
        console.log('Saved recipe:', JSON.stringify(recipe, null, 2));
        res.status(201).json({ message: 'Tarif başarıyla kaydedildi', recipe });
    } catch (error) {
        console.error('Recipe creation error:', error);
        res.status(500).json({ error: 'Tarif kaydedilirken bir hata oluştu' });
    }
};

const getUserRecipes = async (req, res) => {
    try {
        console.log('User object in getUserRecipes:', req.user);
        const userId = req.user.userId;

        console.log('Fetching recipes for userId:', userId);
        const recipes = await Recipe.find({ userId })
            .sort({ createdAt: -1 });

        console.log('Found recipes:', JSON.stringify(recipes, null, 2));
        res.json({
            success: true,
            recipes
        });
    } catch (error) {
        console.error('Error in getUserRecipes:', error);
        res.status(500).json({ error: 'Tarifler alınırken bir hata oluştu' });
    }
};

const deleteRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user.userId;

        console.log('Delete request received for:', { recipeId, userId });

        const recipe = await Recipe.findOne({ _id: recipeId, userId });
        console.log('Found recipe:', recipe);
        
        if (!recipe) {
            console.log('Recipe not found or unauthorized');
            return res.status(404).json({ error: 'Tarif bulunamadı' });
        }

        const result = await Recipe.deleteOne({ _id: recipeId, userId });
        console.log('Delete result:', result);

        if (result.deletedCount === 0) {
            console.log('Recipe not deleted');
            return res.status(400).json({ error: 'Tarif silinemedi' });
        }

        console.log('Recipe successfully deleted');
        res.json({ message: 'Tarif başarıyla silindi' });
    } catch (error) {
        console.error('Error in deleteRecipe:', error);
        res.status(500).json({ error: 'Tarif silinirken bir hata oluştu' });
    }
};

module.exports = {
    generateRecipe,
    createRecipe,
    getUserRecipes,
    deleteRecipe
}; 