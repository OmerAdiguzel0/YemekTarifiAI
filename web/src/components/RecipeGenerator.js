import React, { useState } from 'react';
import { saveRecipe } from '../api';

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState('');
  const [diet, setDiet] = useState('vegan');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      alert('Lütfen en az bir malzeme girin');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/ai/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ingredients: ingredients.split(','),
          dietaryPreference: diet
        })
      });
      
      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      alert('Tarif oluşturma hatası: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!recipe) {
      alert('Önce bir tarif oluşturun');
      return;
    }
    
    try {
      await saveRecipe({
        title: "AI Tarifi: " + ingredients.split(',')[0],
        ingredients: ingredients.split(','),
        instructions: recipe.split('\n'),
        aiDescription: recipe,
        dietaryTags: [diet],
        cookingTime: 30,
        difficulty: 'Orta'
      });
      alert('Tarif kaydedildi!');
    } catch (error) {
      alert('Kaydetme hatası: ' + error.message);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Tarif Oluşturucu</h2>
      
      <div className="form-group">
        <label className="form-label">Malzemeler</label>
        <textarea
          className="form-control"
          placeholder="Malzemeleri virgülle ayırın"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">Diyet Tercihi</label>
        <div className="diet-buttons">
          <button 
            type="button"
            className={`diet-button ${diet === 'vegan' ? 'active' : ''}`}
            onClick={() => setDiet('vegan')}>
            🥗 Vegan
          </button>
          <button 
            type="button"
            className={`diet-button ${diet === 'gluten-free' ? 'active' : ''}`}
            onClick={() => setDiet('gluten-free')}>
            🌾 Glutensiz
          </button>
          <button 
            type="button"
            className={`diet-button ${diet === 'protein' ? 'active' : ''}`}
            onClick={() => setDiet('protein')}>
            💪 Yüksek Protein
          </button>
        </div>
      </div>
      
      <div className="form-group">
        <button 
          className="btn btn-primary btn-block"
          onClick={generateRecipe}
          disabled={loading}>
          {loading ? 'Tarif Oluşturuluyor...' : 'Tarif Oluştur'}
        </button>
      </div>
      
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}
      
      {recipe && (
        <div className="recipe-result">
          <h3>Oluşturulan Tarif</h3>
          <div className="recipe-content">
            {recipe.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          <button 
            className="btn btn-success btn-block"
            onClick={handleSave}>
            Tarifi Kaydet
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;