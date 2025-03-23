'use client';

import MainLayout from '@/components/layout/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Akıllı Yemek Tarifi Oluşturucu
          </h1>
          <p className="text-xl text-gray-600">
            Elinizdeki malzemelerle yapabileceğiniz en lezzetli tarifleri keşfedin
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Malzeme Seçimi</h2>
            <p className="text-gray-600 mb-4">
              Evinizde bulunan malzemeleri seçin, size uygun tarifleri bulalım.
            </p>
            <a
              href="/malzemeler"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Malzemeleri Seç
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Diyet Tercihleri</h2>
            <p className="text-gray-600 mb-4">
              Beslenme tercihlerinize uygun tarifler için diyet seçeneklerinizi belirleyin.
            </p>
            <a
              href="/diyet-tercihleri"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Tercihleri Belirle
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Tariflerim</h2>
            <p className="text-gray-600 mb-4">
              Kaydettiğiniz ve beğendiğiniz tarifleri görüntüleyin.
            </p>
            <a
              href="/tariflerim"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Tariflere Git
            </a>
          </div>
        </div>

        <div className="mt-12 bg-gray-50 p-8 rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Nasıl Çalışır?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Malzemeleri Seçin</h3>
                <p className="text-gray-600 text-sm">Evinizde bulunan malzemeleri işaretleyin</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Tercihlerinizi Belirtin</h3>
                <p className="text-gray-600 text-sm">Diyet tercihlerinizi seçin</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-800">Tarifleri Keşfedin</h3>
                <p className="text-gray-600 text-sm">Size özel tarifleri görüntüleyin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
