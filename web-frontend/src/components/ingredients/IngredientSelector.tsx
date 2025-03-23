'use client';

import { useState } from 'react';

interface Malzeme {
  id: string;
  isim: string;
  kategori: string;
}

interface IngredientSelectorProps {
  malzemeler: Malzeme[];
  onMalzemeSecimi: (seciliMalzemeler: string[]) => void;
}

export default function IngredientSelector({ malzemeler, onMalzemeSecimi }: IngredientSelectorProps) {
  const [seciliMalzemeler, setSeciliMalzemeler] = useState<string[]>([]);

  const malzemeToggle = (malzemeId: string) => {
    setSeciliMalzemeler((onceki) => {
      const yeniListe = onceki.includes(malzemeId)
        ? onceki.filter((id) => id !== malzemeId)
        : [...onceki, malzemeId];
      
      onMalzemeSecimi(yeniListe);
      return yeniListe;
    });
  };

  const kategoriler = Array.from(new Set(malzemeler.map((m) => m.kategori)));

  return (
    <div className="space-y-6">
      {kategoriler.map((kategori) => (
        <div key={kategori} className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700">{kategori}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {malzemeler
              .filter((m) => m.kategori === kategori)
              .map((malzeme) => (
                <button
                  key={malzeme.id}
                  onClick={() => malzemeToggle(malzeme.id)}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    seciliMalzemeler.includes(malzeme.id)
                      ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-500'
                      : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                  }`}
                >
                  {malzeme.isim}
                </button>
              ))}
          </div>
        </div>
      ))}
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Seçili Malzeme Sayısı: {seciliMalzemeler.length} (3-10 arası seçim yapınız)
        </p>
      </div>
    </div>
  );
} 