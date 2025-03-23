"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIngredientById = exports.deleteIngredient = exports.updateIngredient = exports.createIngredient = exports.getAllIngredients = void 0;
const ingredient_model_1 = require("../models/ingredient.model");
const getAllIngredients = async (req, res) => {
    try {
        const ingredients = await ingredient_model_1.Ingredient.find().sort('name');
        res.json(ingredients);
    }
    catch (error) {
        console.error('Get all ingredients error:', error);
        res.status(500).json({ message: 'Malzemeler alınamadı' });
    }
};
exports.getAllIngredients = getAllIngredients;
const createIngredient = async (req, res) => {
    try {
        const ingredient = await ingredient_model_1.Ingredient.create(req.body);
        res.status(201).json(ingredient);
    }
    catch (error) {
        console.error('Create ingredient error:', error);
        res.status(500).json({ message: 'Malzeme oluşturulamadı' });
    }
};
exports.createIngredient = createIngredient;
const updateIngredient = async (req, res) => {
    try {
        const { id } = req.params;
        const ingredient = await ingredient_model_1.Ingredient.findByIdAndUpdate(id, req.body, { new: true });
        if (!ingredient) {
            return res.status(404).json({ message: 'Malzeme bulunamadı' });
        }
        res.json(ingredient);
    }
    catch (error) {
        console.error('Update ingredient error:', error);
        res.status(500).json({ message: 'Malzeme güncellenemedi' });
    }
};
exports.updateIngredient = updateIngredient;
const deleteIngredient = async (req, res) => {
    try {
        const { id } = req.params;
        const ingredient = await ingredient_model_1.Ingredient.findByIdAndDelete(id);
        if (!ingredient) {
            return res.status(404).json({ message: 'Malzeme bulunamadı' });
        }
        res.json({ message: 'Malzeme başarıyla silindi' });
    }
    catch (error) {
        console.error('Delete ingredient error:', error);
        res.status(500).json({ message: 'Malzeme silinemedi' });
    }
};
exports.deleteIngredient = deleteIngredient;
const getIngredientById = async (req, res) => {
    try {
        const { id } = req.params;
        const ingredient = await ingredient_model_1.Ingredient.findById(id);
        if (!ingredient) {
            return res.status(404).json({ message: 'Malzeme bulunamadı' });
        }
        res.json(ingredient);
    }
    catch (error) {
        console.error('Get ingredient by id error:', error);
        res.status(500).json({ message: 'Malzeme alınamadı' });
    }
};
exports.getIngredientById = getIngredientById;
