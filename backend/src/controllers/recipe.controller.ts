import { Request, Response } from 'express';
import { Recipe } from '../models/recipe.model';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const generateRecipe = async (req: Request, res: Response) => {
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
  } catch (error) {
    console.error('Generate recipe error:', error);
    res.status(500).json({ message: 'Tarif oluşturulamadı' });
  }
};

export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    const recipes = await Recipe.find()
      .populate('ingredients.ingredient')
      .populate('createdBy', 'name')
      .sort('-createdAt');
    res.json(recipes);
  } catch (error) {
    console.error('Get all recipes error:', error);
    res.status(500).json({ message: 'Tarifler alınamadı' });
  }
};

export const createRecipe = async (req: Request, res: Response) => {
  try {
    const recipe = await Recipe.create({
      ...req.body,
      createdBy: req.userId
    });
    
    await recipe.populate('ingredients.ingredient');
    await recipe.populate('createdBy', 'name');
    
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ message: 'Tarif oluşturulamadı' });
  }
};

export const getRecipeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id)
      .populate('ingredients.ingredient')
      .populate('createdBy', 'name');
    
    if (!recipe) {
      return res.status(404).json({ message: 'Tarif bulunamadı' });
    }
    
    res.json(recipe);
  } catch (error) {
    console.error('Get recipe by id error:', error);
    res.status(500).json({ message: 'Tarif alınamadı' });
  }
};

export const updateRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findOneAndUpdate(
      { _id: id, createdBy: req.userId },
      req.body,
      { new: true }
    )
    .populate('ingredients.ingredient')
    .populate('createdBy', 'name');
    
    if (!recipe) {
      return res.status(404).json({ message: 'Tarif bulunamadı' });
    }
    
    res.json(recipe);
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ message: 'Tarif güncellenemedi' });
  }
};

export const deleteRecipe = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findOneAndDelete({ _id: id, createdBy: req.userId });
    
    if (!recipe) {
      return res.status(404).json({ message: 'Tarif bulunamadı' });
    }
    
    res.json({ message: 'Tarif başarıyla silindi' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ message: 'Tarif silinemedi' });
  }
}; 