import { API_URL } from '../config';

export const getCommunityRecipes = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Oturum açmanız gerekiyor');
  }

  const response = await fetch(`${API_URL}/community/recipes`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.status === 403) {
    localStorage.removeItem('token');
    throw new Error('Oturum süreniz doldu');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Tarifler yüklenirken bir hata oluştu');
  }

  const data = await response.json();
  return data.recipes || [];
};

export const saveCommunityRecipe = async (recipeId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Oturum açmanız gerekiyor');
  }

  const response = await fetch(`${API_URL}/community/recipes/${recipeId}/save`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (response.status === 403) {
    localStorage.removeItem('token');
    throw new Error('Oturum süreniz doldu');
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Tarif kaydedilirken bir hata oluştu');
  }

  return await response.json();
}; 