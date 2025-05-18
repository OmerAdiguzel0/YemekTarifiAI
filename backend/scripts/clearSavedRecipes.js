const mongoose = require('mongoose');

const uri = 'mongodb+srv://oemiar:1902.Erom@yemektarifi.w5wba.mongodb.net/?retryWrites=true&w=majority&appName=YemekTarifi';

const savedRecipeSchema = new mongoose.Schema({}, { strict: false });
const SavedRecipe = mongoose.model('SavedRecipe', savedRecipeSchema, 'savedrecipes');

async function clearSavedRecipes() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const result = await SavedRecipe.deleteMany({});
    console.log(`Silinen kayıt sayısı: ${result.deletedCount}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Hata:', err);
    process.exit(1);
  }
}

clearSavedRecipes(); 