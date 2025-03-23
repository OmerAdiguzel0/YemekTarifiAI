'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { recipeService, IRecipe } from '@/services/recipe';

export default function TarifDetay() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipeService.getRecipeById(id as string);
        setRecipe(data);
      } catch (error) {
        console.error('Tarif getirilemedi:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Tarif bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Üst Bilgi */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {recipe.baslik}
        </h1>
        
        <div className="flex items-center gap-4 text-gray-600">
          <div className="flex items-center gap-2">
            <Image
              src={recipe.ekleyen_kullanici.profilePhoto || '/images/default-avatar.png'}
              alt={recipe.ekleyen_kullanici.displayName}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span>{recipe.ekleyen_kullanici.displayName}</span>
          </div>
          <div>•</div>
          <div>{new Date(recipe.createdAt).toLocaleDateString('tr-TR')}</div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Kolon */}
        <div className="lg:col-span-2">
          {/* Tarif Görseli */}
          <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image
              src={recipe.resimUrl || '/images/default-recipe.jpg'}
              alt={recipe.baslik}
              fill
              className="object-cover"
            />
          </div>

          {/* Hazırlanış */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Hazırlanışı</h2>
            <ol className="space-y-4">
              {recipe.yapilis.map((adim, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <p className="text-gray-700">{adim}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Sağ Kolon */}
        <div className="space-y-6">
          {/* Pişirme Bilgileri */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Pişirme Bilgileri</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Hazırlama Süresi</span>
                <span>{recipe.hazirlama_suresi} dk</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pişirme Süresi</span>
                <span>{recipe.pisirme_suresi} dk</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Zorluk</span>
                <span>{recipe.zorluk}</span>
              </div>
            </div>
          </div>

          {/* Malzemeler */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Malzemeler</h2>
            <ul className="space-y-2">
              {recipe.malzemeler.map((malzeme, index) => (
                <li key={index} className="flex justify-between">
                  <span className="text-gray-700">{malzeme.malzeme}</span>
                  <span className="text-gray-600">
                    {malzeme.miktar} {malzeme.birim}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Diyet Bilgileri */}
          {recipe.diyet_tercihleri?.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Diyet Bilgileri</h2>
              <div className="flex flex-wrap gap-2">
                {recipe.diyet_tercihleri.map((diyet, index) => (
                  <span 
                    key={index}
                    className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full"
                  >
                    {diyet}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 