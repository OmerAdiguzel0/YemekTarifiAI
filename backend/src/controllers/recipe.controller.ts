import { Request, Response } from 'express';
import Recipe, { IRecipe } from '../models/Recipe';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { IUser } from '../models/User';

// Express Request tipini genişlet
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const recipeController = {
  // Tüm tarifleri getir (filtreleme ve sıralama ile)
  getAll: async (req: Request, res: Response) => {
    try {
      const {
        malzemeler,
        diyet,
        zorluk,
        sure,
        siralama = 'puan'
      } = req.query;

      let query: any = {};

      // Malzemelere göre filtreleme
      if (malzemeler) {
        const malzemeListesi = (malzemeler as string).split(',');
        query['malzemeler.malzeme'] = { $in: malzemeListesi };
      }

      // Diyet tercihine göre filtreleme
      if (diyet) {
        query.diyet_tercihleri = diyet;
      }

      // Zorluğa göre filtreleme
      if (zorluk) {
        query.zorluk = zorluk;
      }

      // Süreye göre filtreleme
      if (sure) {
        query.hazirlama_suresi = { $lte: Number(sure) };
      }

      // Sıralama seçenekleri
      let sort: any = {};
      switch (siralama) {
        case 'yeni':
          sort = { createdAt: -1 };
          break;
        case 'puan':
          sort = { puan: -1 };
          break;
        case 'populer':
          sort = { kaydetme_sayisi: -1 };
          break;
        default:
          sort = { puan: -1 };
      }

      const recipes = await Recipe.find(query)
        .sort(sort)
        .populate('malzemeler.malzeme')
        .populate('ekleyen_kullanici', 'displayName profilePhoto');

      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: 'Tarifler getirilirken bir hata oluştu' });
    }
  },

  // Tarif detayını getir
  getById: async (req: Request, res: Response) => {
    try {
      const recipe = await Recipe.findById(req.params.id)
        .populate('malzemeler.malzeme')
        .populate('ekleyen_kullanici', 'displayName profilePhoto');

      if (!recipe) {
        return res.status(404).json({ message: 'Tarif bulunamadı' });
      }

      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: 'Tarif getirilirken bir hata oluştu' });
    }
  },

  // Yeni tarif ekle
  create: async (req: Request, res: Response) => {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ message: 'Kullanıcı girişi gerekli' });
      }

      const recipe = new Recipe({
        ...req.body,
        createdBy: (req.user as IUser)._id
      });

      await recipe.save();
      res.status(201).json(recipe);
    } catch (error) {
      res.status(400).json({ message: 'Tarif eklenirken bir hata oluştu' });
    }
  },

  // AI'dan tarif al
  getAIRecipe: async (req: Request, res: Response) => {
    try {
      const { malzemeler, diyet_tercihleri } = req.body;

      // TODO: Gemini API entegrasyonu burada yapılacak
      // Şimdilik mock bir yanıt dönelim
      const aiRecipe = {
        baslik: "AI Tarifi",
        malzemeler,
        yapilis: ["Adım 1", "Adım 2"],
        ai_olusturuldu: true
      };

      res.json(aiRecipe);
    } catch (error) {
      res.status(500).json({ message: 'AI tarifi oluşturulurken bir hata oluştu' });
    }
  },

  // Tarifi kaydet/favorilere ekle
  saveRecipe: async (req: Request, res: Response) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: 'Tarif bulunamadı' });
      }

      recipe.kaydetme_sayisi += 1;
      await recipe.save();

      res.json({ message: 'Tarif başarıyla kaydedildi' });
    } catch (error) {
      res.status(500).json({ message: 'Tarif kaydedilirken bir hata oluştu' });
    }
  },

  // Tarifi güncelle
  update: async (req: Request, res: Response) => {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ message: 'Kullanıcı girişi gerekli' });
      }

      const { id } = req.params;
      const recipe = await Recipe.findOneAndUpdate(
        { _id: id, createdBy: (req.user as IUser)._id },
        { $set: req.body },
        { new: true }
      );

      if (!recipe) {
        return res.status(404).json({ message: 'Tarif bulunamadı' });
      }

      res.json(recipe);
    } catch (error) {
      res.status(500).json({ message: 'Tarif güncellenirken bir hata oluştu' });
    }
  },

  // Tarifi sil
  delete: async (req: Request, res: Response) => {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ message: 'Kullanıcı girişi gerekli' });
      }

      const { id } = req.params;
      const recipe = await Recipe.findOneAndDelete({ 
        _id: id, 
        createdBy: (req.user as IUser)._id
      });

      if (!recipe) {
        return res.status(404).json({ message: 'Tarif bulunamadı' });
      }

      res.json({ message: 'Tarif başarıyla silindi' });
    } catch (error) {
      res.status(500).json({ message: 'Tarif silinirken bir hata oluştu' });
    }
  }
};

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
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Kullanıcı girişi gerekli' });
    }

    const recipe = await Recipe.create({
      ...req.body,
      createdBy: (req.user as IUser)._id
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
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Kullanıcı girişi gerekli' });
    }

    const { id } = req.params;
    const recipe = await Recipe.findOneAndUpdate(
      { _id: id, createdBy: (req.user as IUser)._id },
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
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Kullanıcı girişi gerekli' });
    }

    const { id } = req.params;
    const recipe = await Recipe.findOneAndDelete({ 
      _id: id, 
      createdBy: (req.user as IUser)._id 
    });
    
    if (!recipe) {
      return res.status(404).json({ message: 'Tarif bulunamadı' });
    }
    
    res.json({ message: 'Tarif başarıyla silindi' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ message: 'Tarif silinemedi' });
  }
}; 