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
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-rose-700 mb-6">Diyet Tercihleri</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {DIYET_SECENEKLERI.map((tercih) => (
          <button
            key={tercih.id}
            onClick={() => tercihToggle(tercih.id)}
            className={`p-6 rounded-xl text-left transition-all ${
              seciliTercihler.includes(tercih.id)
                ? 'bg-rose-50 border-2 border-rose-300 shadow-sm'
                : 'bg-white hover:bg-rose-50/50 border border-rose-100'
            }`}
          >
            <h3 className={`font-serif text-lg mb-2 ${
              seciliTercihler.includes(tercih.id) ? 'text-rose-700' : 'text-gray-700'
            }`}>
              {tercih.isim}
            </h3>
            <p className="text-gray-600 font-light leading-relaxed">{tercih.aciklama}</p>
          </button>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-white rounded-xl border border-rose-100">
        <p className="text-sm text-gray-600 font-light">
          Seçili Tercihler: {seciliTercihler.length}
        </p>
      </div>
    </div>
  );
} 