"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRecipe = exports.updateRecipe = exports.getRecipeById = exports.createRecipe = exports.getAllRecipes = exports.generateRecipe = void 0;
const recipe_model_1 = require("../models/recipe.model");
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const generateRecipe = async (req, res) => {
    try {
        const { ingredients, dietPreferences } = req.body;
        // Gemini API prompt oluşturma
        const prompt = `Elimde şu malzemeler var: ${ingredients.join(', ')}.
    ${dietPreferences.length > 0 ? `Diyet tercihlerim: ${dietPreferences.join(', ')}.` : ''}
    Bu malzemelerle yapılabilecek bir yemek tarifi önerir misin?
    Lütfen şu formatta ver:
    - Yemek Adı
    - Malzemeler ve Miktarları
    - Hazırlama Süresi
    - Pişirme Süresi
    - Porsiyon
    - Zorluk Seviyesi
    - Kalori (porsiyon başına)
    - Hazırlanışı (adım adım)`;
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const recipe = response.text();
        res.json({ recipe });
    }
    catch (error) {
        console.error('Generate recipe error:', error);
        res.status(500).json({ message: 'Tarif oluşturulamadı' });
    }
};
exports.generateRecipe = generateRecipe;
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await recipe_model_1.Recipe.find()
            .populate('ingredients.ingredient')
            .populate('createdBy', 'name')
            .sort('-createdAt');
        res.json(recipes);
    }
    catch (error) {
        console.error('Get all recipes error:', error);
        res.status(500).json({ message: 'Tarifler alınamadı' });
    }
};
exports.getAllRecipes = getAllRecipes;
const createRecipe = async (req, res) => {
    try {
        const recipe = await recipe_model_1.Recipe.create({
            ...req.body,
            createdBy: req.userId
        });
        await recipe.populate('ingredients.ingredient');
        await recipe.populate('createdBy', 'name');
        res.status(201).json(recipe);
    }
    catch (error) {
        console.error('Create recipe error:', error);
        res.status(500).json({ message: 'Tarif oluşturulamadı' });
    }
};
exports.createRecipe = createRecipe;
const getRecipeById = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await recipe_model_1.Recipe.findById(id)
            .populate('ingredients.ingredient')
            .populate('createdBy', 'name');
        if (!recipe) {
            return res.status(404).json({ message: 'Tarif bulunamadı' });
        }
        res.json(recipe);
    }
    catch (error) {
        console.error('Get recipe by id error:', error);
        res.status(500).json({ message: 'Tarif alınamadı' });
    }
};
exports.getRecipeById = getRecipeById;
const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await recipe_model_1.Recipe.findOneAndUpdate({ _id: id, createdBy: req.userId }, req.body, { new: true })
            .populate('ingredients.ingredient')
            .populate('createdBy', 'name');
        if (!recipe) {
            return res.status(404).json({ message: 'Tarif bulunamadı' });
        }
        res.json(recipe);
    }
    catch (error) {
        console.error('Update recipe error:', error);
        res.status(500).json({ message: 'Tarif güncellenemedi' });
    }
};
exports.updateRecipe = updateRecipe;
const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await recipe_model_1.Recipe.findOneAndDelete({ _id: id, createdBy: req.userId });
        if (!recipe) {
            return res.status(404).json({ message: 'Tarif bulunamadı' });
        }
        res.json({ message: 'Tarif başarıyla silindi' });
    }
    catch (error) {
        console.error('Delete recipe error:', error);
        res.status(500).json({ message: 'Tarif silinemedi' });
    }
};
exports.deleteRecipe = deleteRecipe;
