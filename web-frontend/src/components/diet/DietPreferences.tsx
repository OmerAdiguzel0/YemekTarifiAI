'use client';

import { useState } from 'react';

interface DiyetTercihi {
  id: string;
  isim: string;
  aciklama: string;
}

interface DietPreferencesProps {
  onTercihDegisimi: (tercihler: string[]) => void;
}

const DIYET_SECENEKLERI: DiyetTercihi[] = [
  {
    id: 'vejeteryan',
    isim: 'Vejeteryan',
    aciklama: 'Et, balık ve tavuk içermeyen tarifler'
  },
  {
    id: 'vegan',
    isim: 'Vegan',
    aciklama: 'Hiçbir hayvansal ürün içermeyen tarifler'
  },
  {
    id: 'glutensiz',
    isim: 'Glutensiz',
    aciklama: 'Gluten içermeyen tarifler'
  },
  {
    id: 'keto',
    isim: 'Keto',
    aciklama: 'Düşük karbonhidratlı, yüksek yağlı tarifler'
  },
  {
    id: 'dusuk_kalorili',
    isim: 'Düşük Kalorili',
    aciklama: '300 kalorinin altında tarifler'
  }
];

export default function DietPreferences({ onTercihDegisimi }: DietPreferencesProps) {
  const [seciliTercihler, setSeciliTercihler] = useState<string[]>([]);

  const tercihToggle = (tercihId: string) => {
    setSeciliTercihler((onceki) => {
      const yeniListe = onceki.includes(tercihId)
        ? onceki.filter((id) => id !== tercihId)
        : [...onceki, tercihId];
      
      onTercihDegisimi(yeniListe);
      return yeniListe;
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Diyet Tercihleri</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DIYET_SECENEKLERI.map((tercih) => (
          <button
            key={tercih.id}
            onClick={() => tercihToggle(tercih.id)}
            className={`p-4 rounded-lg text-left transition-all ${
              seciliTercihler.includes(tercih.id)
                ? 'bg-indigo-100 border-2 border-indigo-500'
                : 'bg-white hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <h3 className={`font-medium ${
              seciliTercihler.includes(tercih.id) ? 'text-indigo-700' : 'text-gray-700'
            }`}>
              {tercih.isim}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{tercih.aciklama}</p>
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Seçili Tercihler: {seciliTercihler.length}
        </p>
      </div>
    </div>
  );
} 