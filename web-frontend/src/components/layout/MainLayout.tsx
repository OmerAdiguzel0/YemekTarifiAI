'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-indigo-600">YemekTarifi</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/malzemeler" className="text-gray-700 hover:text-indigo-600">
                Malzemeler
              </Link>
              <Link href="/tarifler" className="text-gray-700 hover:text-indigo-600">
                Tarifler
              </Link>
              <Link href="/profil" className="text-gray-700 hover:text-indigo-600">
                Profil
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white shadow-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500">© 2024 YemekTarifi. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
} 