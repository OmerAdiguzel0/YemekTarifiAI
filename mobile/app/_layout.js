// Polyfill'leri içe aktar
import '../polyfills';

import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';

export default function Layout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen 
          name="index" 
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="login" 
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="register" 
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </AuthProvider>
  );
}