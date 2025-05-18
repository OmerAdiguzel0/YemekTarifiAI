const mongoose = require('mongoose');

const uri = 'mongodb+srv://oemiar:1902.Erom@yemektarifi.w5wba.mongodb.net/?retryWrites=true&w=majority&appName=YemekTarifi';

const savedRecipeSchema = new mongoose.Schema({}, { strict: false });
const SavedRecipe = mongoose.model('SavedRecipe', savedRecipeSchema, 'savedrecipes');

async function fixIndexes() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const indexes = await SavedRecipe.collection.indexes();
    console.log('Mevcut indexler:', indexes);
    // userId içeren tüm unique indexleri sil
    for (const idx of indexes) {
      if (idx.unique && idx.name !== '_id_' && idx.name !== 'userId_1_recipeId_1_type_1' && idx.key.userId) {
        try {
          await SavedRecipe.collection.dropIndex(idx.name);
          console.log(`Index silindi: ${idx.name}`);
        } catch (e) {
          console.log(`Index silinemedi: ${idx.name}`, e.message);
        }
      }
    }
    // Doğru indexi tekrar ekle
    await SavedRecipe.collection.createIndex({ userId: 1, recipeId: 1, type: 1 }, { unique: true });
    console.log('Sadece userId_1_recipeId_1_type_1 indexi bırakıldı.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Hata:', err);
    process.exit(1);
  }
}

fixIndexes(); 