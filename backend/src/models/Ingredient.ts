import mongoose, { Document, Schema } from 'mongoose';

export interface IIngredient extends Document {
  isim: string;
  kategori: string;
  birim?: string;
  resimUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const IngredientSchema = new Schema<IIngredient>({
  isim: {
    type: String,
    required: true,
    unique: true
  },
  kategori: {
    type: String,
    required: true,
    enum: ['Sebzeler', 'Meyveler', 'Et & Tavuk', 'Deniz Ürünleri', 'Bakliyat', 'Süt Ürünleri', 'Baharatlar', 'Diğer']
  },
  birim: {
    type: String,
    enum: ['adet', 'gram', 'ml', 'yemek kaşığı', 'çay kaşığı', 'su bardağı', 'diş']
  },
  resimUrl: String
}, {
  timestamps: true
});

export default mongoose.model<IIngredient>('Ingredient', IngredientSchema); 