const mongoose = require('mongoose');
const Like = require('../models/Like');

async function cleanupLikes() {
  try {
    // Hem recipeId hem de commentId null olan kayıtları sil
    const result1 = await Like.deleteMany({ recipeId: null, commentId: null });
    console.log('Null kayıtlar silindi:', result1.deletedCount);

    // Hem recipeId hem de commentId dolu olan kayıtları sil
    const result2 = await Like.deleteMany({ recipeId: { $ne: null }, commentId: { $ne: null } });
    console.log('Duplicate kayıtlar silindi:', result2.deletedCount);

    console.log('Temizlik tamamlandı.');
  } catch (err) {
    console.error('Hata:', err);
  } finally {
    mongoose.disconnect();
  }
}

mongoose.connect('mongodb://localhost:27017/yemektarifi', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
    cleanupLikes();
  })
  .catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
  }); 