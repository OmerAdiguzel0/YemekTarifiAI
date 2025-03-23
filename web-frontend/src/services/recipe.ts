import { API_URL } from '@/config';

export interface IMalzeme {
  malzeme: string;
  miktar: number;
  birim: string;
}

export interface IRecipe {
  _id: string;
  baslik: string;
  malzemeler: IMalzeme[];
  yapilis: string[];
  hazirlama_suresi: number;
  pisirme_suresi: number;
  zorluk: 'Kolay' | 'Orta' | 'Zor';
  diyet_tercihleri: string[];
  puan: number;
  kaydetme_sayisi: number;
  resimUrl?: string;
  ekleyen_kullanici: {
    _id: string;
    displayName: string;
    profilePhoto?: string;
  };
  ai_olusturuldu: boolean;
  createdAt: string;
}

export interface IRecipeFilters {
  malzemeler?: string[];
  diyet?: string;
  zorluk?: string;
  sure?: number;
  siralama?: 'yeni' | 'puan' | 'populer';
}

export const recipeService = {
  // Tüm tarifleri getir (filtreli)
  getAllRecipes: async (filters?: IRecipeFilters): Promise<IRecipe[]> => {
    const queryParams = new URLSearchParams();
    
    if (filters?.malzemeler?.length) {
      queryParams.set('malzemeler', filters.malzemeler.join(','));
    }
    if (filters?.diyet) {
      queryParams.set('diyet', filters.diyet);
    }
    if (filters?.zorluk) {
      queryParams.set('zorluk', filters.zorluk);
    }
    if (filters?.sure) {
      queryParams.set('sure', filters.sure.toString());
    }
    if (filters?.siralama) {
      queryParams.set('siralama', filters.siralama);
    }

    const response = await fetch(`${API_URL}/recipes?${queryParams}`);
    if (!response.ok) throw new Error('Tarifler getirilemedi');
    return response.json();
  },

  // Tarif detayını getir
  getRecipeById: async (id: string): Promise<IRecipe> => {
    const response = await fetch(`${API_URL}/recipes/${id}`);
    if (!response.ok) throw new Error('Tarif detayı getirilemedi');
    return response.json();
  },

  // Yeni tarif ekle
  createRecipe: async (recipe: Partial<IRecipe>): Promise<IRecipe> => {
    const response = await fetch(`${API_URL}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(recipe)
    });
    if (!response.ok) throw new Error('Tarif eklenemedi');
    return response.json();
  },

  // AI'dan tarif al
  getAIRecipe: async (malzemeler: string[], diyet_tercihleri?: string[]): Promise<IRecipe> => {
    const response = await fetch(`${API_URL}/recipes/ai-recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ malzemeler, diyet_tercihleri })
    });
    if (!response.ok) throw new Error('AI tarifi oluşturulamadı');
    return response.json();
  },

  // Tarifi kaydet
  saveRecipe: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/recipes/${id}/save`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) throw new Error('Tarif kaydedilemedi');
  }
}; 