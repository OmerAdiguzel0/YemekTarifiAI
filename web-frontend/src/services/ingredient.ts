import { API_URL } from '@/config';

export interface IIngredient {
  _id: string;
  isim: string;
  kategori: string;
  birim: string;
}

export const ingredientService = {
  // Tüm malzemeleri getir
  getAllIngredients: async (): Promise<IIngredient[]> => {
    const response = await fetch(`${API_URL}/ingredients`);
    if (!response.ok) throw new Error('Malzemeler getirilemedi');
    return response.json();
  },

  // Kategoriye göre malzemeleri getir
  getIngredientsByCategory: async (category: string): Promise<IIngredient[]> => {
    const response = await fetch(`${API_URL}/ingredients/category/${category}`);
    if (!response.ok) throw new Error('Malzemeler getirilemedi');
    return response.json();
  },

  // Malzeme ara
  searchIngredients: async (query: string): Promise<IIngredient[]> => {
    const response = await fetch(`${API_URL}/ingredients/search?q=${query}`);
    if (!response.ok) throw new Error('Malzeme araması başarısız');
    return response.json();
  }
}; 