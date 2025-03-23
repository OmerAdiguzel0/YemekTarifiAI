'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { recipeService } from '@/services/recipe';
import { ingredientService, IIngredient } from '@/services/ingredient';
import { useDebounce } from '@/hooks/useDebounce';
import MainLayout from '@/components/layout/MainLayout';

export default function AITarifPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<IIngredient[]>([]);
  const [dietPreferences, setDietPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<IIngredient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Malzeme arama
  useEffect(() => {
    const searchIngredients = async () => {
      if (!debouncedSearchTerm) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await ingredientService.searchIngredients(debouncedSearchTerm);
        // Zaten seçili olan malzemeleri filtrele
        const filteredResults = results.filter(
          result => !selectedIngredients.some(selected => selected._id === result._id)
        );
        setSearchResults(filteredResults);
      } catch (error) {
        console.error('Malzeme araması başarısız:', error);
      } finally {
        setIsSearching(false);
      }
    };

    searchIngredients();
  }, [debouncedSearchTerm, selectedIngredients]);

  const handleIngredientSelect = (ingredient: IIngredient) => {
    setSelectedIngredients([...selectedIngredients, ingredient]);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleIngredientRemove = (ingredientId: string) => {
    setSelectedIngredients(
      selectedIngredients.filter(ing => ing._id !== ingredientId)
    );
  };

  const handleGenerateRecipe = async () => {
    try {
      setLoading(true);
      const recipe = await recipeService.getAIRecipe(
        selectedIngredients.map(ing => ing.isim),
        dietPreferences
      );
      router.push(`/tarifler/${recipe._id}`);
    } catch (error) {
      console.error('AI tarifi oluşturulamadı:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-rose-600/80 mb-6">
            AI ile Tarif Oluştur
          </h1>

          {/* Malzeme Seçimi */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Malzemelerinizi Seçin
            </h2>
            <p className="text-gray-600 mb-4">
              Evinizde bulunan malzemeleri seçin, AI size uygun bir tarif önersin.
            </p>
            
            {/* Malzeme Arama */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Malzeme ara..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              
              {/* Arama Sonuçları */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {searchResults.map((ingredient) => (
                    <button
                      key={ingredient._id}
                      onClick={() => handleIngredientSelect(ingredient)}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 transition"
                    >
                      {ingredient.isim}
                    </button>
                  ))}
                </div>
              )}

              {isSearching && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
                  Aranıyor...
                </div>
              )}
            </div>

            {/* Seçili Malzemeler */}
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ingredient) => (
                <span
                  key={ingredient._id}
                  className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {ingredient.isim}
                  <button
                    onClick={() => handleIngredientRemove(ingredient._id)}
                    className="hover:text-rose-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Diyet Tercihleri */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Diyet Tercihleriniz
            </h2>
            <div className="space-y-3">
              {['Vejetaryen', 'Vegan', 'Glutensiz', 'Düşük Kalorili'].map((diet) => (
                <label key={diet} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={dietPreferences.includes(diet)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDietPreferences([...dietPreferences, diet]);
                      } else {
                        setDietPreferences(dietPreferences.filter(d => d !== diet));
                      }
                    }}
                    className="w-5 h-5 rounded text-rose-600 border-gray-300 focus:ring-rose-500"
                  />
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors font-medium">
                    {diet}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tarif Oluştur Butonu */}
          <button
            onClick={handleGenerateRecipe}
            disabled={loading || selectedIngredients.length === 0}
            className={`w-full py-3 px-6 rounded-lg text-white transition ${
              loading || selectedIngredients.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            {loading ? 'Tarif Oluşturuluyor...' : 'Tarif Oluştur'}
          </button>

          {/* Bilgi Notu */}
          <p className="text-sm text-gray-500 text-center mt-4">
            En az bir malzeme seçmelisiniz. AI, seçtiğiniz malzemelerle yapılabilecek
            en uygun tarifi oluşturacaktır.
          </p>
        </div>
      </div>
    </MainLayout>
  );
} 