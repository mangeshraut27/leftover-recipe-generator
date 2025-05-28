// Local Storage Service for Recipe Management
// Handles saving, retrieving, and managing user's recipe history and favorites

const STORAGE_KEYS = {
  SAVED_RECIPES: 'leftover_generator_saved_recipes',
  RECIPE_HISTORY: 'leftover_generator_recipe_history',
  USER_PREFERENCES: 'leftover_generator_user_preferences'
};

// Helper function to safely parse JSON from localStorage
const safeJSONParse = (item, fallback = []) => {
  try {
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error('Error parsing JSON from localStorage:', error);
    return fallback;
  }
};

// Helper function to safely stringify and save to localStorage
const safeJSONStringify = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Recipe History Management
export const recipeHistoryService = {
  // Add a recipe to history
  addToHistory: (recipe) => {
    if (!recipe) return false;
    
    const history = safeJSONParse(localStorage.getItem(STORAGE_KEYS.RECIPE_HISTORY));
    
    // Add timestamp and unique ID if not present
    const recipeWithMetadata = {
      ...recipe,
      id: recipe.id || Date.now(),
      generatedAt: recipe.generatedAt || new Date().toISOString(),
      viewCount: 1
    };

    // Check if recipe already exists in history
    const existingIndex = history.findIndex(r => r.id === recipeWithMetadata.id);
    
    if (existingIndex >= 0) {
      // Update existing recipe with new view count
      history[existingIndex] = {
        ...history[existingIndex],
        viewCount: (history[existingIndex].viewCount || 0) + 1,
        lastViewedAt: new Date().toISOString()
      };
    } else {
      // Add new recipe to beginning of history
      history.unshift(recipeWithMetadata);
      
      // Keep only last 50 recipes to prevent storage bloat
      if (history.length > 50) {
        history.splice(50);
      }
    }

    return safeJSONStringify(STORAGE_KEYS.RECIPE_HISTORY, history);
  },

  // Get all recipes from history
  getHistory: () => {
    return safeJSONParse(localStorage.getItem(STORAGE_KEYS.RECIPE_HISTORY));
  },

  // Clear all history
  clearHistory: () => {
    localStorage.removeItem(STORAGE_KEYS.RECIPE_HISTORY);
    return true;
  },

  // Remove specific recipe from history
  removeFromHistory: (recipeId) => {
    if (!recipeId) return false;
    
    const history = safeJSONParse(localStorage.getItem(STORAGE_KEYS.RECIPE_HISTORY));
    const filteredHistory = history.filter(recipe => recipe.id !== recipeId);
    return safeJSONStringify(STORAGE_KEYS.RECIPE_HISTORY, filteredHistory);
  }
};

// Saved Recipes (Favorites) Management
export const savedRecipesService = {
  // Save a recipe to favorites
  saveRecipe: (recipe, category = 'uncategorized') => {
    if (!recipe) return false;
    
    const savedRecipes = safeJSONParse(localStorage.getItem(STORAGE_KEYS.SAVED_RECIPES));
    
    const savedRecipe = {
      ...recipe,
      id: recipe.id || Date.now(),
      savedAt: new Date().toISOString(),
      category: category || recipe.mealType || 'uncategorized'
    };

    // Check if recipe is already saved
    const existingIndex = savedRecipes.findIndex(r => r.id === savedRecipe.id);
    
    if (existingIndex >= 0) {
      // Update existing saved recipe
      savedRecipes[existingIndex] = {
        ...savedRecipes[existingIndex],
        ...savedRecipe,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Add new saved recipe
      savedRecipes.unshift(savedRecipe);
    }

    return safeJSONStringify(STORAGE_KEYS.SAVED_RECIPES, savedRecipes);
  },

  // Get all saved recipes
  getSavedRecipes: () => {
    return safeJSONParse(localStorage.getItem(STORAGE_KEYS.SAVED_RECIPES));
  },

  // Remove recipe from favorites
  unsaveRecipe: (recipeId) => {
    if (!recipeId) return false;
    
    const savedRecipes = safeJSONParse(localStorage.getItem(STORAGE_KEYS.SAVED_RECIPES));
    const filteredRecipes = savedRecipes.filter(recipe => recipe.id !== recipeId);
    return safeJSONStringify(STORAGE_KEYS.SAVED_RECIPES, filteredRecipes);
  },

  // Check if recipe is saved
  isRecipeSaved: (recipeId) => {
    const savedRecipes = safeJSONParse(localStorage.getItem(STORAGE_KEYS.SAVED_RECIPES));
    return savedRecipes.some(recipe => recipe.id === recipeId);
  },

  // Update user notes for a saved recipe
  updateNotes: (recipeId, notes) => {
    const savedRecipes = safeJSONParse(localStorage.getItem(STORAGE_KEYS.SAVED_RECIPES));
    const recipeIndex = savedRecipes.findIndex(r => r.id === recipeId);
    
    if (recipeIndex >= 0) {
      savedRecipes[recipeIndex].notes = notes;
      savedRecipes[recipeIndex].updatedAt = new Date().toISOString();
      return safeJSONStringify(STORAGE_KEYS.SAVED_RECIPES, savedRecipes);
    }
    
    return false;
  },

  // Get saved recipes by category
  getRecipesByCategory: (category) => {
    const savedRecipes = safeJSONParse(localStorage.getItem(STORAGE_KEYS.SAVED_RECIPES));
    return savedRecipes.filter(recipe => recipe.category === category);
  },

  // Get all categories
  getCategories: () => {
    const savedRecipes = safeJSONParse(localStorage.getItem(STORAGE_KEYS.SAVED_RECIPES));
    const categories = [...new Set(savedRecipes.map(recipe => recipe.category))];
    return categories.filter(cat => cat && cat !== 'uncategorized').sort();
  }
};

// User Preferences Management
export const userPreferencesService = {
  // Save user preferences
  savePreferences: (preferences) => {
    return safeJSONStringify(STORAGE_KEYS.USER_PREFERENCES, {
      ...preferences,
      updatedAt: new Date().toISOString()
    });
  },

  // Get user preferences
  getPreferences: () => {
    return safeJSONParse(localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES), {});
  },

  // Clear user preferences
  clearPreferences: () => {
    localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
    return true;
  }
};

// Recipe Export/Share Functionality
export const recipeExportService = {
  // Export recipe as text
  exportAsText: (recipe) => {
    let text = `${recipe.title}\n`;
    text += `${recipe.description}\n\n`;
    text += `Prep Time: ${recipe.prepTime || 'N/A'} min | `;
    text += `Cook Time: ${recipe.cookTime || 'N/A'} min | `;
    text += `Total Time: ${recipe.totalTime} min\n`;
    text += `Servings: ${recipe.servings} | Difficulty: ${recipe.difficulty}\n\n`;
    
    text += `INGREDIENTS:\n`;
    recipe.ingredients.forEach((ingredient, index) => {
      if (typeof ingredient === 'string') {
        text += `${index + 1}. ${ingredient}\n`;
      } else {
        text += `${index + 1}. ${ingredient.amount} ${ingredient.unit} ${ingredient.name}\n`;
      }
    });
    
    text += `\nINSTRUCTIONS:\n`;
    recipe.instructions.forEach((instruction, index) => {
      const step = typeof instruction === 'string' ? instruction : instruction.instruction;
      text += `${index + 1}. ${step}\n`;
    });
    
    if (recipe.nutrition) {
      text += `\nNUTRITION (per serving):\n`;
      text += `Calories: ${recipe.nutrition.calories} | `;
      text += `Protein: ${recipe.nutrition.protein}g | `;
      text += `Carbs: ${recipe.nutrition.carbs}g | `;
      text += `Fat: ${recipe.nutrition.fat}g\n`;
    }
    
    text += `\nGenerated by Leftover Recipe Generator`;
    
    return text;
  },

  // Copy recipe to clipboard
  copyToClipboard: async (recipe) => {
    try {
      const text = recipeExportService.exportAsText(recipe);
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  },

  // Share via Web Share API (if available)
  shareRecipe: async (recipe) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href
        });
        return true;
      } catch (error) {
        console.error('Error sharing recipe:', error);
        return false;
      }
    } else {
      // Fallback - return false when Web Share API is not available
      return false;
    }
  }
};

// Storage Statistics
export const storageStatsService = {
  // Get storage usage statistics
  getStats: () => {
    const history = recipeHistoryService.getHistory();
    const saved = savedRecipesService.getSavedRecipes();
    const categories = savedRecipesService.getCategories();
    
    // Find most viewed recipe
    let mostViewedRecipe = null;
    if (history.length > 0) {
      mostViewedRecipe = history.reduce((max, recipe) => 
        (recipe.viewCount || 0) > (max.viewCount || 0) ? recipe : max, history[0]);
      
      // If no recipe has views, return null
      if (!mostViewedRecipe.viewCount) {
        mostViewedRecipe = null;
      }
    }
    
    return {
      totalRecipesGenerated: history.length,
      totalSavedRecipes: saved.length,
      totalCategories: categories.length,
      mostViewedRecipe,
      recentActivity: history.slice(0, 5),
      storageUsed: new Blob([
        localStorage.getItem(STORAGE_KEYS.RECIPE_HISTORY) || '',
        localStorage.getItem(STORAGE_KEYS.SAVED_RECIPES) || '',
        localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES) || ''
      ]).size
    };
  },

  // Clear all data
  clearAllData: () => {
    localStorage.removeItem(STORAGE_KEYS.RECIPE_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.SAVED_RECIPES);
    localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
    return true;
  }
};

export default {
  recipeHistoryService,
  savedRecipesService,
  userPreferencesService,
  recipeExportService,
  storageStatsService
}; 