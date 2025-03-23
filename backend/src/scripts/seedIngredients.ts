import mongoose from 'mongoose';
import Ingredient from '../models/Ingredient';
import { config } from '../config';

const ingredients = [
  // Et ve Tavuk
  { isim: 'Kıyma', kategori: 'Et & Tavuk', birim: 'gram' },
  { isim: 'Tavuk Göğsü', kategori: 'Et & Tavuk', birim: 'gram' },
  { isim: 'Dana Kuşbaşı', kategori: 'Et & Tavuk', birim: 'gram' },
  
  // Sebzeler
  { isim: 'Domates', kategori: 'Sebzeler', birim: 'adet' },
  { isim: 'Soğan', kategori: 'Sebzeler', birim: 'adet' },
  { isim: 'Sarımsak', kategori: 'Sebzeler', birim: 'diş' },
  { isim: 'Biber', kategori: 'Sebzeler', birim: 'adet' },
  { isim: 'Patlıcan', kategori: 'Sebzeler', birim: 'adet' },
  
  // Bakliyat
  { isim: 'Pirinç', kategori: 'Bakliyat', birim: 'gram' },
  { isim: 'Bulgur', kategori: 'Bakliyat', birim: 'gram' },
  { isim: 'Mercimek', kategori: 'Bakliyat', birim: 'gram' },
  
  // Süt Ürünleri
  { isim: 'Süt', kategori: 'Süt Ürünleri', birim: 'ml' },
  { isim: 'Yoğurt', kategori: 'Süt Ürünleri', birim: 'gram' },
  { isim: 'Peynir', kategori: 'Süt Ürünleri', birim: 'gram' },
  
  // Baharatlar
  { isim: 'Tuz', kategori: 'Baharatlar', birim: 'gram' },
  { isim: 'Karabiber', kategori: 'Baharatlar', birim: 'gram' },
  { isim: 'Pul Biber', kategori: 'Baharatlar', birim: 'gram' },
  
  // Diğer
  { isim: 'Un', kategori: 'Diğer', birim: 'gram' },
  { isim: 'Makarna', kategori: 'Diğer', birim: 'gram' },
  { isim: 'Ekmek', kategori: 'Diğer', birim: 'adet' }
];

async function seedIngredients() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB bağlantısı başarılı');

    await Ingredient.deleteMany({}); // Mevcut malzemeleri temizle
    await Ingredient.insertMany(ingredients);
    
    console.log('Malzemeler başarıyla eklendi');
    process.exit(0);
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

seedIngredients(); 