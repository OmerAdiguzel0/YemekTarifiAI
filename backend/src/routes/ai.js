const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const router = express.Router();
// Node.js için global fetch ve Headers tanımlayalım
const fetch = require("node-fetch");
global.fetch = fetch;
global.Headers = fetch.Headers;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/generate-recipe", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const { ingredients, dietaryPreference } = req.body;
    
    const prompt = `Sağlıklı ve ${dietaryPreference} beslenme tercihine uygun, 
    şu malzemelerle yapılabilecek bir tarif oluştur: ${ingredients.join(", ")}. 
    Tarif formatı: Başlık, Malzemeler, Hazırlanışı, AI Notları.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    console.log("Gemini API yanıtı:", response);
    
    res.json({ recipe: response.text() });
  } catch (error) {
    console.error("Gemini API hatası:", error);
    res.status(500).json({ error: "AI tarif oluşturma hatası", details: error.message });
  }
});

module.exports = router;