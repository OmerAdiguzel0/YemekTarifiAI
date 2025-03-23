import { Request, Response } from 'express';
import Ingredient, { IIngredient } from '../models/Ingredient';

export const ingredientController = {
  // Tüm malzemeleri getir
  getAll: async (req: Request, res: Response) => {
    try {
      const ingredients = await Ingredient.find().sort('isim');
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ message: 'Malzemeler getirilemedi' });
    }
  },

  // Kategoriye göre malzemeleri getir
  getByCategory: async (req: Request, res: Response) => {
    try {
      const { kategori } = req.params;
      const ingredients = await Ingredient.find({ kategori }).sort('isim');
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ message: 'Malzemeler getirilemedi' });
    }
  },

  // Malzeme ara
  search: async (req: Request, res: Response) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.json([]);
      }

      const ingredients = await Ingredient.find({
        isim: { $regex: q as string, $options: 'i' }
      })
      .sort('isim')
      .limit(10);

      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ message: 'Malzeme araması başarısız' });
    }
  },

  // Yeni malzeme ekle
  create: async (req: Request, res: Response) => {
    try {
      const ingredient = new Ingredient(req.body);
      await ingredient.save();
      res.status(201).json(ingredient);
    } catch (error) {
      res.status(400).json({ message: 'Malzeme eklenemedi' });
    }
  },

  update: async (req: Request, res: Response) => {
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
  },

  delete: async (req: Request, res: Response) => {
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
  },

  getById: async (req: Request, res: Response) => {
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
  }
}; 