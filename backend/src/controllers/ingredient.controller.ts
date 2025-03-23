import { Request, Response } from 'express';
import { Ingredient } from '../models/ingredient.model';

export const getAllIngredients = async (req: Request, res: Response) => {
  try {
    const ingredients = await Ingredient.find().sort('name');
    res.json(ingredients);
  } catch (error) {
    console.error('Get all ingredients error:', error);
    res.status(500).json({ message: 'Malzemeler alınamadı' });
  }
};

export const createIngredient = async (req: Request, res: Response) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    res.status(201).json(ingredient);
  } catch (error) {
    console.error('Create ingredient error:', error);
    res.status(500).json({ message: 'Malzeme oluşturulamadı' });
  }
};

export const updateIngredient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!ingredient) {
      return res.status(404).json({ message: 'Malzeme bulunamadı' });
    }
    
    res.json(ingredient);
  } catch (error) {
    console.error('Update ingredient error:', error);
    res.status(500).json({ message: 'Malzeme güncellenemedi' });
  }
};

export const deleteIngredient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findByIdAndDelete(id);
    
    if (!ingredient) {
      return res.status(404).json({ message: 'Malzeme bulunamadı' });
    }
    
    res.json({ message: 'Malzeme başarıyla silindi' });
  } catch (error) {
    console.error('Delete ingredient error:', error);
    res.status(500).json({ message: 'Malzeme silinemedi' });
  }
};

export const getIngredientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findById(id);
    
    if (!ingredient) {
      return res.status(404).json({ message: 'Malzeme bulunamadı' });
    }
    
    res.json(ingredient);
  } catch (error) {
    console.error('Get ingredient by id error:', error);
    res.status(500).json({ message: 'Malzeme alınamadı' });
  }
}; 