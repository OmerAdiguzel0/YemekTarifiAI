import { ExpoConfig } from 'expo/config';

// Mevcut app.json yapılandırmasını genişletiyoruz
const config: ExpoConfig = {
  name: "AI Yemek Tarifi",
  slug: "mobile",
  // ... diğer yapılandırmalar
  
  // Expo geliştirme araçları için tema renkleri
  extra: {
    devToolsTheme: {
      primaryColor: "#4CAF50",
      secondaryColor: "#388E3C",
      textColor: "#FFFFFF",
      backgroundColor: "#F5F5F5"
    }
  }
};

export default config;