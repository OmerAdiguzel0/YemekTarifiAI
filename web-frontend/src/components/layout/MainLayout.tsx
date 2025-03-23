'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, isAuthenticated, login, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/'); // Anasayfaya yönlendir
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50/30 to-white">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-serif italic text-rose-600">
                  ✿ YemekTarifi
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/malzemeler" className="text-gray-600 hover:text-rose-500 transition-colors font-light">
                Malzemeler
              </Link>
              <Link href="/tarifler" className="text-gray-600 hover:text-rose-500 transition-colors font-light">
                Tarifler
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {user?.profilePhoto && (
                      <img
                        src={user.profilePhoto}
                        alt={user.displayName}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-gray-700">{user?.displayName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-rose-500 transition-colors font-light"
                  >
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => login()}
                  className="text-gray-600 hover:text-rose-500 transition-colors font-light"
                >
                  Giriş Yap
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
      <footer className="bg-white/80 backdrop-blur-sm border-t border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-400 font-light">
            © 2024 YemekTarifi. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
} 