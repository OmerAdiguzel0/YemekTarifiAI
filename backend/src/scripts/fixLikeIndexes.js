const mongoose = require('mongoose');
const Like = require('../models/Like');

async function fixIndexes() {
  try {
    await Like.collection.dropIndexes();
    console.log('Tüm indexler silindi.');
    await Like.collection.createIndex(
      { userId: 1, recipeId: 1 },
      { unique: true, partialFilterExpression: { recipeId: { $exists: true } } }
    );
    await Like.collection.createIndex(
      { userId: 1, commentId: 1 },
      { unique: true, partialFilterExpression: { commentId: { $exists: true } } }
    );
    console.log('Doğru indexler tekrar oluşturuldu.');
  } catch (err) {
    console.error('Hata:', err);
  } finally {
    mongoose.disconnect();
  }
}

mongoose.connect('mongodb://localhost:27017/yemektarifi', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB bağlantısı başarılı');
    fixIndexes();
  })
  .catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
  }); 