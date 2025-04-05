import React, { useEffect, useState } from 'react';
import { getRecipes } from '../api';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes();
      setRecipes(data);
      setLoading(false);
    } catch (error) {
      console.error('Tarif yükleme hatası:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h2 className="card-title">Kayıtlı Tarifler</h2>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">Kayıtlı Tarifler</h2>
      {recipes.length === 0 ? (
        <p className="empty-message">Henüz kayıtlı tarif bulunmuyor.</p>
      ) : (
        <div className="recipe-list">
          {recipes.map(recipe => (
            <div key={recipe._id} className="recipe-item">
              <h3 className="recipe-title">{recipe.title}</h3>
              <p className="recipe-description">{recipe.aiDescription}</p>
              <div className="recipe-tags">
                {recipe.dietaryTags?.map((tag, index) => (
                  <span key={index} className="recipe-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;