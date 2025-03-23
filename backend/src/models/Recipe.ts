import mongoose, { Document, Schema } from 'mongoose';

export interface IRecipe extends Document {
  baslik: string;
  malzemeler: Array<{
    malzeme: mongoose.Types.ObjectId; // Ingredient referansı
    miktar: number;
    birim: string;
  }>;
  yapilis: string[];
  hazirlama_suresi: number;
  pisirme_suresi: number;
  zorluk: 'Kolay' | 'Orta' | 'Zor';
  porsiyon: number;
  diyet_tercihleri: string[];
  resimUrl?: string;
  
  // Topluluk özellikleri
  ekleyen_kullanici: mongoose.Types.ObjectId; // User referansı
  puan: number;
  puan_sayisi: number;
  yorum_sayisi: number;
  kaydetme_sayisi: number;
  
  // AI özelliği
  ai_olusturuldu: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema = new Schema<IRecipe>({
  baslik: { type: String, required: true },
  malzemeler: [{
    malzeme: { type: Schema.Types.ObjectId, ref: 'Ingredient', required: true },
    miktar: { type: Number, required: true },
    birim: { type: String, required: true }
  }],
  yapilis: [{ type: String, required: true }],
  hazirlama_suresi: { type: Number, required: true },
  pisirme_suresi: { type: Number, required: true },
  zorluk: { 
    type: String, 
    enum: ['Kolay', 'Orta', 'Zor'],
    required: true 
  },
  porsiyon: { type: Number, required: true },
  diyet_tercihleri: [{
    type: String,
    enum: ['vejeteryan', 'vegan', 'glutensiz', 'keto', 'dusuk_kalorili']
  }],
  resimUrl: String,
  
  ekleyen_kullanici: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  puan: { type: Number, default: 0 },
  puan_sayisi: { type: Number, default: 0 },
  yorum_sayisi: { type: Number, default: 0 },
  kaydetme_sayisi: { type: Number, default: 0 },
  
  ai_olusturuldu: { type: Boolean, default: false }
}, {
  timestamps: true
});

export default mongoose.model<IRecipe>('Recipe', RecipeSchema); 