// Polyfill'leri içe aktar
import '../polyfills';

// Global olarak ReadableStream tanımlayalım
import { ReadableStream } from 'web-streams-polyfill';

// ReadableStream'i global olarak tanımla
global.ReadableStream = ReadableStream;

import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';

function RootLayoutNav() {
  const segments = useSegments();
  const router = useRouter();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'none',
        contentStyle: { backgroundColor: 'transparent' },
        header: () => null // Header'ı tamamen null olarak ayarla
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false,
          header: () => null
        }}
      />
      <Stack.Screen 
        name="register" 
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Burada olabilecek fazladan bir View veya container kaldırıldı */}
      <RootLayoutNav />
    </AuthProvider>
  );
}