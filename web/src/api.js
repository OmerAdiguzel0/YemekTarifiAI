// API URL'lerini 5001 portuna güncelleyin
export const saveRecipe = (recipe) => {
  return fetch('http://localhost:5001/api/recipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe)
  }).then(res => res.json());
};

export const getRecipes = () => {
  return fetch('http://localhost:5001/api/recipes').then(res => res.json());
};