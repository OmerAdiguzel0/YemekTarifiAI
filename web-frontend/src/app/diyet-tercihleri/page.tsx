'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DietPreferences from '@/components/diet/DietPreferences';

export default function DiyetTercihleriPage() {
  const [seciliTercihler, setSeciliTercihler] = useState<string[]>([]);

  const tercihKaydet = () => {
    // TODO: Backend'e seçili tercihleri gönder
    console.log('Seçili tercihler:', seciliTercihler);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diyet Tercihleri</h1>
          <p className="text-gray-600">
            Size özel tarifler için beslenme tercihlerinizi seçin. İstediğiniz kadar seçim yapabilirsiniz.
          </p>
        </div>

        <DietPreferences onTercihDegisimi={setSeciliTercihler} />

        <div className="mt-8 flex justify-end">
          <button
            onClick={tercihKaydet}
            className="px-6 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Tercihleri Kaydet
          </button>
        </div>
      </div>
    </MainLayout>
  );
} 