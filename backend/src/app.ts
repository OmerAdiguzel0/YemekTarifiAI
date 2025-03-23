import express from 'express';
import ingredientRoutes from './routes/ingredient.routes';

const app = express();

// Routes
app.use('/api/ingredients', ingredientRoutes);

// ... existing code ...

// ... existing code ... 