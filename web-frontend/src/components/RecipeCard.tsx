'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IRecipe } from '@/services/recipe';

interface RecipeCardProps {
  recipe: IRecipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const router = useRouter();

  return (
    <div 
      onClick={() => router.push(`/tarifler/${recipe._id}`)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
      {/* Tarif Görseli */}
      <div className="relative h-48 w-full">
        <Image
          src={recipe.resimUrl || '/images/default-recipe.jpg'}
          alt={recipe.baslik}
          fill
          className="object-cover"
        />
        {recipe.ai_olusturuldu && (
          <div className="absolute top-2 right-2 bg-rose-500 text-white px-2 py-1 rounded-full text-xs">
            AI Tarifi
          </div>
        )}
      </div>

      {/* Tarif Bilgileri */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {recipe.baslik}
        </h3>
        
        {/* Hazırlama Bilgileri */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{recipe.hazirlama_suresi + recipe.pisirme_suresi} dk</span>
          </div>
          <div className="flex items-center gap-1">
            <span>📊</span>
            <span>{recipe.zorluk}</span>
          </div>
        </div>

        {/* Diyet Tercihleri */}
        {recipe.diyet_tercihleri?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {recipe.diyet_tercihleri.map((diyet, index) => (
              <span 
                key={index}
                className="bg-rose-50 text-rose-600 text-xs px-2 py-1 rounded-full"
              >
                {diyet}
              </span>
            ))}
          </div>
        )}

        {/* Alt Bilgiler */}
        <div className="flex items-center justify-between text-sm mt-4">
          <div className="flex items-center gap-2">
            <Image
              src={recipe.ekleyen_kullanici.profilePhoto || '/images/default-avatar.png'}
              alt={recipe.ekleyen_kullanici.displayName}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-gray-600">
              {recipe.ekleyen_kullanici.displayName}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span>⭐</span>
            <span>{recipe.puan.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 