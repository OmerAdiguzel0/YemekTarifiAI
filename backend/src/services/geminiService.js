const { GoogleGenerativeAI } = require('@google/generative-ai');
const fetch = require('node-fetch');

// Global fetch tanımlamaları
global.fetch = fetch;
global.Headers = fetch.Headers;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateRecipe = async (ingredients, preferences) => {
    try {
        const preferencesText = preferences && preferences.length > 0
            ? `\nTercihler ve Özel İstekler: ${preferences.join(', ')}`
            : '';

        const prompt = `Sen profesyonel bir şefsin. Verilen malzemelerle yapılabilecek en lezzetli tarifi JSON formatında oluştur.

Malzemeler: ${ingredients.join(', ')}${preferencesText}

Lütfen yanıtını tam olarak aşağıdaki JSON formatında ver:
{
  "title": "Yemeğin Adı",
  "ingredients": [
    "Miktar - Malzeme 1",
    "Miktar - Malzeme 2"
  ],
  "instructions": [
    "1. Detaylı adım açıklaması",
    "2. Detaylı adım açıklaması"
  ],
  "tips": [
    "Püf nokta 1",
    "Püf nokta 2"
  ]
}

Önemli: Yanıtın kesinlikle geçerli bir JSON formatında olmalı ve başka hiçbir ek metin içermemeli. Markdown kod bloğu kullanma.`;

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
            },
        });

        const result = await model.generateContent(prompt);
        if (!result || !result.response) {
            throw new Error('API yanıt vermedi');
        }

        const response = await result.response;
        console.log("Gemini API ham yanıt:", response);
        
        let recipeString = response.text();
        if (!recipeString) {
            throw new Error('API boş yanıt döndü');
        }

        console.log("Gemini API metin yanıtı:", recipeString);

        // Markdown kod bloğu sözdizimini temizle
        recipeString = recipeString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        console.log("Temizlenmiş JSON:", recipeString);

        try {
            const recipe = JSON.parse(recipeString);
            if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
                throw new Error('Eksik tarif bilgileri');
            }
            return recipe;
        } catch (parseError) {
            console.error('JSON ayrıştırma hatası:', parseError);
            throw new Error('Tarif formatı geçersiz');
        }
    } catch (error) {
        console.error('Gemini API hatası:', error);
        throw new Error(error.message || 'Tarif oluşturulurken bir hata oluştu');
    }
};

module.exports = {
    generateRecipe
}; 