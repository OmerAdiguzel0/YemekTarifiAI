'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { recipeService, IRecipe, IRecipeFilters } from '@/services/recipe';
import RecipeCard from '@/components/RecipeCard';
import MainLayout from '@/components/layout/MainLayout';

export default function TariflerPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<IRecipeFilters>({
    siralama: 'puan'
  });

  const handleSearch = async () => {
    try {
      setLoading(true);
      const results = await recipeService.getAllRecipes(filters);
      setRecipes(results);
    } catch (error) {
      console.error('Tarifler getirilemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-rose-700 mb-4">
            Tarif Ara
          </h1>
          
          {/* Filtreler */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100/50 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Zorluk Filtresi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zorluk Seviyesi
                </label>
                <div className="relative">
                  <select
                    className="appearance-none w-full bg-white border border-rose-100 rounded-xl px-4 py-2.5 pr-8 
                    focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all
                    text-gray-700 cursor-pointer hover:border-rose-200"
                    value={filters.zorluk}
                    onChange={(e) => setFilters({...filters, zorluk: e.target.value})}
                  >
                    <option value="">Tümü</option>
                    <option value="Kolay">Kolay</option>
                    <option value="Orta">Orta</option>
                    <option value="Zor">Zor</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Süre Filtresi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maksimum Süre (dk)
                </label>
                <input
                  type="number"
                  className="w-full bg-white border border-rose-100 rounded-xl px-4 py-2.5
                  focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all
                  text-gray-700 hover:border-rose-200"
                  placeholder="Örn: 30"
                  value={filters.sure || ''}
                  onChange={(e) => setFilters({...filters, sure: Number(e.target.value)})}
                />
              </div>

              {/* Sıralama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sıralama
                </label>
                <div className="relative">
                  <select
                    className="appearance-none w-full bg-white border border-rose-100 rounded-xl px-4 py-2.5 pr-8
                    focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 transition-all
                    text-gray-700 cursor-pointer hover:border-rose-200"
                    value={filters.siralama}
                    onChange={(e) => setFilters({...filters, siralama: e.target.value as 'yeni' | 'puan' | 'populer'})}
                  >
                    <option value="puan">En Yüksek Puan</option>
                    <option value="yeni">En Yeni</option>
                    <option value="populer">En Popüler</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI veya Topluluk Seçimi */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => router.push('/tarifler/ai')}
              className="flex-1 bg-gradient-to-r from-rose-100 to-rose-50 text-rose-800 py-3.5 px-6 rounded-xl 
              hover:from-rose-200 hover:to-rose-100 transition-all font-semibold border border-rose-200 
              hover:border-rose-300 shadow-sm hover:shadow flex items-center justify-center gap-2"
            >
              <span className="text-rose-600 text-xl">✨</span>
              AI'dan Tarif Al
            </button>
            <button
              onClick={handleSearch}
              className="flex-1 bg-gradient-to-r from-rose-600 to-rose-500 text-white py-3.5 px-6 rounded-xl 
              hover:from-rose-700 hover:to-rose-600 transition-all font-semibold shadow-sm hover:shadow 
              flex items-center justify-center gap-2"
            >
              <span>👥</span>
              Topluluk Tariflerini Gör
            </button>
          </div>

          {/* Tarif Listesi */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Tarifler yükleniyor...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
              {recipes.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-3">🍳</div>
                  <p className="text-gray-500 text-lg">
                    Henüz tarif bulunamadı. Yeni bir arama yapmayı deneyin.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
} 