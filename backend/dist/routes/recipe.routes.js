"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const recipe_controller_1 = require("../controllers/recipe.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/generate', auth_middleware_1.authMiddleware, recipe_controller_1.generateRecipe);
router.get('/', recipe_controller_1.getAllRecipes);
router.post('/', auth_middleware_1.authMiddleware, recipe_controller_1.createRecipe);
router.get('/:id', recipe_controller_1.getRecipeById);
router.put('/:id', auth_middleware_1.authMiddleware, recipe_controller_1.updateRecipe);
router.delete('/:id', auth_middleware_1.authMiddleware, recipe_controller_1.deleteRecipe);
exports.default = router;
