import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const { currentUser } = useAuth();
  const [ingredients, setIngredients] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('genel');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    // Kaydedilmiş tarifleri getir
    fetchSavedRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/recipes');
      setSavedRecipes(response.data);
    } catch (error) {
      console.error('Tarifler yüklenirken hata:', error);
    }
  };

  const handleGenerateRecipe = async (e) => {
    e.preventDefault();
    
    if (!ingredients) {
      setError('Lütfen en az bir malzeme girin');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5001/api/ai/generate-recipe', {
        ingredients: ingredients.split(',').map(item => item.trim()),
        dietaryPreference
      });
      
      setRecipe(response.data.recipe);
    } catch (error) {
      console.error('Tarif oluşturma hatası:', error);
      setError('Tarif oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!recipe) return;
    
    try {
      // Tarifi parse et
      const lines = recipe.split('\n');
      const title = lines[0];
      
      // Malzemeler ve hazırlanışı bölümlerini bul
      let ingredientsSection = '';
      let instructionsSection = '';
      let aiNotesSection = '';
      
      let currentSection = '';
      for (const line of lines) {
        if (line.includes('Malzemeler')) {
          currentSection = 'ingredients';
          continue;
        } else if (line.includes('Hazırlanışı')) {
          currentSection = 'instructions';
          continue;
        } else if (line.includes('AI Notları')) {
          currentSection = 'aiNotes';
          continue;
        }
        
        if (currentSection === 'ingredients') {
          ingredientsSection += line + '\n';
        } else if (currentSection === 'instructions') {
          instructionsSection += line + '\n';
        } else if (currentSection === 'aiNotes') {
          aiNotesSection += line + '\n';
        }
      }
      
      const recipeData = {
        title,
        ingredients: ingredientsSection.trim(),
        instructions: instructionsSection.trim(),
        aiDescription: aiNotesSection.trim(),
        dietaryTags: [dietaryPreference],
        cookingTime: '30 dakika', // Varsayılan değer
        difficulty: 'Orta' // Varsayılan değer
      };
      
      await axios.post('http://localhost:5001/api/recipes', recipeData);
      alert('Tarif başarıyla kaydedildi!');
      fetchSavedRecipes();
    } catch (error) {
      console.error('Tarif kaydedilirken hata:', error);
      alert('Tarif kaydedilirken bir hata oluştu.');
    }
  };

  return (
    <div className="home-container">
      <div className="recipe-generator">
        <h2>AI Yemek Tarifi Oluşturucu</h2>
        
        <form onSubmit={handleGenerateRecipe}>
          <div className="form-group">
            <label>Malzemeler (virgülle ayırın)</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Örn: domates, soğan, zeytinyağı"
              rows={4}
            />
          </div>
          
          <div className="form-group">
            <label>Beslenme Tercihi</label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
            >
              <option value="genel">Genel</option>
              <option value="vejetaryen">Vejetaryen</option>
              <option value="vegan">Vegan</option>
              <option value="glutensiz">Glutensiz</option>
              <option value="düşük karbonhidrat">Düşük Karbonhidrat</option>
            </select>
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Tarif Oluşturuluyor...' : 'Tarif Oluştur'}
          </button>
        </form>
        
        {error && <div className="error-message">{error}</div>}
        
        {recipe && (
          <div className="recipe-result">
            <h3>Oluşturulan Tarif</h3>
            <div className="recipe-content">
              {recipe.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <button onClick={handleSaveRecipe} className="save-button">
              Tarifi Kaydet
            </button>
          </div>
        )}
      </div>
      
      <div className="saved-recipes">
        <h2>Kaydedilmiş Tarifler</h2>
        
        {savedRecipes.length === 0 ? (
          <p>Henüz kaydedilmiş tarif bulunmuyor.</p>
        ) : (
          <div className="recipe-list">
            {savedRecipes.map((recipe) => (
              <div key={recipe._id} className="recipe-card">
                <h3>{recipe.title}</h3>
                <p><strong>Zorluk:</strong> {recipe.difficulty}</p>
                <p><strong>Pişirme Süresi:</strong> {recipe.cookingTime}</p>
                <div className="tags">
                  {recipe.dietaryTags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;