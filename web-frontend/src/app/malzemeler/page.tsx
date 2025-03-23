'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import IngredientSelector from '@/components/ingredients/IngredientSelector';

// Örnek malzeme verileri - Gerçek uygulamada API'den gelecek
const ORNEK_MALZEMELER = [
  {
    id: 'domates',
    isim: 'Domates',
    kategori: 'Sebzeler'
  },
  {
    id: 'sogan',
    isim: 'Soğan',
    kategori: 'Sebzeler'
  },
  {
    id: 'patates',
    isim: 'Patates',
    kategori: 'Sebzeler'
  },
  {
    id: 'tavuk',
    isim: 'Tavuk Göğsü',
    kategori: 'Et & Tavuk'
  },
  {
    id: 'kiyma',
    isim: 'Kıyma',
    kategori: 'Et & Tavuk'
  },
  {
    id: 'pirinc',
    isim: 'Pirinç',
    kategori: 'Bakliyat'
  },
  {
    id: 'bulgur',
    isim: 'Bulgur',
    kategori: 'Bakliyat'
  },
  {
    id: 'sut',
    isim: 'Süt',
    kategori: 'Süt Ürünleri'
  },
  {
    id: 'peynir',
    isim: 'Beyaz Peynir',
    kategori: 'Süt Ürünleri'
  }
];

export default function MalzemelerPage() {
  const [seciliMalzemeler, setSeciliMalzemeler] = useState<string[]>([]);

  const malzemeSeciminiKaydet = () => {
    // TODO: Backend'e seçili malzemeleri gönder
    console.log('Seçili malzemeler:', seciliMalzemeler);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Malzeme Seçimi</h1>
          <p className="text-gray-600">
            Evinizde bulunan malzemeleri seçin. En az 3, en fazla 10 malzeme seçebilirsiniz.
          </p>
        </div>

        <IngredientSelector
          malzemeler={ORNEK_MALZEMELER}
          onMalzemeSecimi={setSeciliMalzemeler}
        />

        <div className="mt-8 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {seciliMalzemeler.length} malzeme seçildi
          </p>
          <button
            onClick={malzemeSeciminiKaydet}
            disabled={seciliMalzemeler.length < 3 || seciliMalzemeler.length > 10}
            className={`px-6 py-2 rounded-lg text-white transition-colors ${
              seciliMalzemeler.length >= 3 && seciliMalzemeler.length <= 10
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Tarif Oluştur
          </button>
        </div>
      </div>
    </MainLayout>
  );
} 