'use client';

import MainLayout from '@/components/layout/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20 relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="text-rose-200 text-6xl">❀</div>
          </div>
          
          <h1 className="text-5xl font-serif italic text-gray-900 mb-6 pt-8">
            Akıllı Yemek Tarifi
          </h1>
          <p className="text-2xl text-gray-800 font-light">
            Mutfağınızdaki malzemelerle harikalar yaratın
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all border border-rose-100 group hover:border-rose-200">
            <div className="text-rose-300 text-3xl mb-4 group-hover:text-rose-400">🥗</div>
            <h2 className="text-2xl font-serif text-gray-900 mb-4">Malzeme Seçimi</h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Mutfağınızda bulunan malzemeleri seçin, size özel tarifleri keşfedin.
            </p>
            <a
              href="/malzemeler"
              className="inline-block bg-rose-100 text-rose-700 px-6 py-3 rounded-2xl hover:bg-rose-200 transition-colors font-medium"
            >
              Malzemeleri Seç
            </a>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-rose-200">
            <h2 className="text-2xl font-serif text-gray-900 mb-4">Diyet Tercihleri</h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Beslenme alışkanlıklarınıza uygun özel tarifler için tercihlerinizi belirleyin.
            </p>
            <a
              href="/diyet-tercihleri"
              className="inline-block bg-rose-600 text-white px-6 py-3 rounded-xl hover:bg-rose-700 transition-colors font-medium"
            >
              Tercihleri Belirle
            </a>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-rose-200">
            <h2 className="text-2xl font-serif text-gray-900 mb-4">Tariflerim</h2>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              Kaydettiğiniz ve en sevdiğiniz tarifleri kolayca görüntüleyin.
            </p>
            <a
              href="/tariflerim"
              className="inline-block bg-rose-600 text-white px-6 py-3 rounded-xl hover:bg-rose-700 transition-colors font-medium"
            >
              Tariflere Git
            </a>
          </div>
        </div>

        <div className="mt-20 bg-gradient-to-b from-white to-rose-50 p-12 rounded-3xl border border-rose-100">
          <h2 className="text-3xl font-serif text-gray-900 mb-12 text-center">
            Nasıl Çalışır?
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-serif text-xl">
                1
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-lg">
                  Malzemeleri Seçin
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Mutfağınızda bulunan malzemeleri işaretleyin
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-rose-200 text-rose-700 rounded-full flex items-center justify-center font-serif text-lg">
                2
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-lg">Tercihlerinizi Belirtin</h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  Beslenme tercihlerinizi seçin
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-rose-200 text-rose-700 rounded-full flex items-center justify-center font-serif text-lg">
                3
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2 text-lg">Tarifleri Keşfedin</h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  Size özel hazırlanan tarifleri görüntüleyin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
