"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
// Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const ingredient_routes_1 = __importDefault(require("./routes/ingredient.routes"));
const recipe_routes_1 = __importDefault(require("./routes/recipe.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/ingredients', ingredient_routes_1.default);
app.use('/api/recipes', recipe_routes_1.default);
// MongoDB Bağlantısı
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yemek-tarifi')
    .then(() => {
    console.log('MongoDB bağlantısı başarılı');
    // Server'ı başlat
    app.listen(PORT, () => {
        console.log(`Server ${PORT} portunda çalışıyor`);
    });
})
    .catch((error) => {
    console.error('MongoDB bağlantı hatası:', error);
    process.exit(1);
});
// Ana route
app.get('/', (req, res) => {
    res.json({ message: 'Akıllı Tarif Oluşturucu API' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Bir şeyler ters gitti!' });
});
