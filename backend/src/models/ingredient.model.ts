import mongoose, { Document, Schema } from 'mongoose';

export interface IIngredient extends Document {
  name: string;
  category: string;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: Date;
  updatedAt: Date;
}

const ingredientSchema = new Schema<IIngredient>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['sebze', 'meyve', 'et', 'süt-ürünleri', 'tahıl', 'baharat', 'diğer']
  },
  unit: {
    type: String,
    required: true,
    enum: ['gram', 'adet', 'su-bardağı', 'yemek-kaşığı', 'çay-kaşığı']
  },
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  protein: {
    type: Number,
    required: true,
    min: 0
  },
  carbs: {
    type: Number,
    required: true,
    min: 0
  },
  fat: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

ingredientSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Ingredient = mongoose.model<IIngredient>('Ingredient', ingredientSchema); 