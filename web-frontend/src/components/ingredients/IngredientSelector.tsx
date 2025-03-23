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
    <div className="space-y-8">
      {kategoriler.map((kategori) => (
        <div key={kategori} className="space-y-4">
          <h3 className="text-2xl font-serif text-rose-700">{kategori}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {malzemeler
              .filter((m) => m.kategori === kategori)
              .map((malzeme) => (
                <button
                  key={malzeme.id}
                  onClick={() => malzemeToggle(malzeme.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    seciliMalzemeler.includes(malzeme.id)
                      ? 'bg-rose-50 text-rose-700 border-2 border-rose-300 shadow-sm'
                      : 'bg-white hover:bg-rose-50/50 text-gray-600 border border-rose-100'
                  } font-light`}
                >
                  {malzeme.isim}
                </button>
              ))}
          </div>
        </div>
      ))}
      
      <div className="mt-6 p-6 bg-white rounded-xl border border-rose-100">
        <p className="text-sm text-gray-600 font-light">
          Seçili Malzeme Sayısı: {seciliMalzemeler.length} (3-10 arası seçim yapınız)
        </p>
      </div>
    </div>
  );
} 