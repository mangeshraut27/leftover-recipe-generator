import {
  recipeHistoryService,
  savedRecipesService,
  userPreferencesService,
  recipeExportService,
  storageStatsService
} from '../storageService';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index) => Object.keys(store)[index] || null)
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock navigator.share
Object.defineProperty(navigator, 'share', {
  value: jest.fn(() => Promise.resolve()),
  writable: true
});

// Mock navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(() => Promise.resolve())
  },
  writable: true
});

const mockRecipe = {
  id: 1,
  title: 'Test Recipe',
  description: 'A delicious test recipe',
  totalTime: 30,
  servings: 4,
  difficulty: 'Easy',
  ingredients: [
    { name: 'ingredient1', amount: '1', unit: 'cup' },
    { name: 'ingredient2', amount: '2', unit: 'tbsp' }
  ],
  instructions: [
    { step: 1, instruction: 'First step' },
    { step: 2, instruction: 'Second step' }
  ],
  nutrition: {
    calories: 300,
    protein: 15,
    carbs: 30,
    fat: 10,
    fiber: 5
  },
  tags: ['healthy', 'quick'],
  generatedAt: '2024-01-01T12:00:00Z'
};

describe('Storage Service', () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  describe('recipeHistoryService', () => {
    test('adds recipe to history', () => {
      recipeHistoryService.addToHistory(mockRecipe);
      
      const history = recipeHistoryService.getHistory();
      expect(history).toHaveLength(1);
      expect(history[0]).toMatchObject({
        ...mockRecipe,
        generatedAt: mockRecipe.generatedAt // Use the original timestamp
      });
      expect(history[0]).toHaveProperty('viewCount', 1);
    });

    test('increments view count for existing recipe', () => {
      recipeHistoryService.addToHistory(mockRecipe);
      recipeHistoryService.addToHistory(mockRecipe);
      
      const history = recipeHistoryService.getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].viewCount).toBe(2);
    });

    test('maintains history limit of 50 recipes', () => {
      // Add 51 recipes
      for (let i = 1; i <= 51; i++) {
        recipeHistoryService.addToHistory({ ...mockRecipe, id: i });
      }
      
      const history = recipeHistoryService.getHistory();
      expect(history).toHaveLength(50);
      expect(history[0].id).toBe(51); // Most recent should be first
    });

    test('removes recipe from history', () => {
      recipeHistoryService.addToHistory(mockRecipe);
      recipeHistoryService.removeFromHistory(mockRecipe.id);
      
      const history = recipeHistoryService.getHistory();
      expect(history).toHaveLength(0);
    });

    test('clears all history', () => {
      recipeHistoryService.addToHistory(mockRecipe);
      recipeHistoryService.clearHistory();
      
      const history = recipeHistoryService.getHistory();
      expect(history).toHaveLength(0);
    });

    test('returns empty array when no history exists', () => {
      const history = recipeHistoryService.getHistory();
      expect(history).toEqual([]);
    });

    test('handles corrupted localStorage data gracefully', () => {
      localStorageMock.setItem('recipe_history', 'invalid json');
      
      const history = recipeHistoryService.getHistory();
      expect(history).toEqual([]);
    });

    test('handles recipe without required fields', () => {
      // Clear any previous localStorage mock errors
      localStorageMock.clear();
      jest.clearAllMocks();
      
      const incompleteRecipe = { title: 'Incomplete Recipe' };
      
      const result = recipeHistoryService.addToHistory(incompleteRecipe);
      expect(result).toBe(true);
      
      const history = recipeHistoryService.getHistory();
      expect(history).toHaveLength(1);
    });
  });

  describe('savedRecipesService', () => {
    test('saves recipe to favorites', () => {
      savedRecipesService.saveRecipe(mockRecipe);
      
      const saved = savedRecipesService.getSavedRecipes();
      expect(saved).toHaveLength(1);
      expect(saved[0]).toMatchObject(mockRecipe);
      expect(saved[0]).toHaveProperty('savedAt');
    });

    test('checks if recipe is saved', () => {
      savedRecipesService.saveRecipe(mockRecipe);
      
      expect(savedRecipesService.isRecipeSaved(mockRecipe.id)).toBe(true);
      expect(savedRecipesService.isRecipeSaved(999)).toBe(false);
    });

    test('unsaves recipe', () => {
      savedRecipesService.saveRecipe(mockRecipe);
      savedRecipesService.unsaveRecipe(mockRecipe.id);
      
      const saved = savedRecipesService.getSavedRecipes();
      expect(saved).toHaveLength(0);
    });

    test('updates recipe notes', () => {
      savedRecipesService.saveRecipe(mockRecipe);
      savedRecipesService.updateNotes(mockRecipe.id, 'My custom notes');
      
      const saved = savedRecipesService.getSavedRecipes();
      expect(saved[0].notes).toBe('My custom notes');
    });

    test('categorizes saved recipes', () => {
      const recipe1 = { ...mockRecipe, id: 1 };
      const recipe2 = { ...mockRecipe, id: 2 };
      
      savedRecipesService.saveRecipe(recipe1, 'dinner');
      savedRecipesService.saveRecipe(recipe2, 'lunch');
      
      const dinnerRecipes = savedRecipesService.getRecipesByCategory('dinner');
      const lunchRecipes = savedRecipesService.getRecipesByCategory('lunch');
      
      expect(dinnerRecipes).toHaveLength(1);
      expect(lunchRecipes).toHaveLength(1);
      expect(dinnerRecipes[0].category).toBe('dinner');
      expect(lunchRecipes[0].category).toBe('lunch');
    });

    test('gets all categories', () => {
      savedRecipesService.saveRecipe({ ...mockRecipe, id: 1 }, 'dinner');
      savedRecipesService.saveRecipe({ ...mockRecipe, id: 2 }, 'lunch');
      savedRecipesService.saveRecipe({ ...mockRecipe, id: 3 }, 'dinner');
      
      const categories = savedRecipesService.getCategories();
      expect(categories).toEqual(['dinner', 'lunch']);
    });

    test('returns empty array when no saved recipes exist', () => {
      const saved = savedRecipesService.getSavedRecipes();
      expect(saved).toEqual([]);
    });

    test('handles corrupted localStorage data gracefully', () => {
      localStorageMock.setItem('saved_recipes', 'invalid json');
      
      const saved = savedRecipesService.getSavedRecipes();
      expect(saved).toEqual([]);
    });
  });

  describe('userPreferencesService', () => {
    const mockPreferences = {
      theme: 'dark',
      defaultMealType: 'dinner',
      notifications: true
    };

    test('saves user preferences', () => {
      userPreferencesService.savePreferences(mockPreferences);
      
      const preferences = userPreferencesService.getPreferences();
      expect(preferences).toMatchObject(mockPreferences);
      expect(preferences).toHaveProperty('updatedAt');
    });

    test('returns default preferences when none exist', () => {
      const preferences = userPreferencesService.getPreferences();
      expect(preferences).toEqual({});
    });

    test('clears user preferences', () => {
      userPreferencesService.savePreferences(mockPreferences);
      userPreferencesService.clearPreferences();
      
      const preferences = userPreferencesService.getPreferences();
      expect(preferences).toEqual({});
    });

    test('handles corrupted localStorage data gracefully', () => {
      localStorageMock.setItem('user_preferences', 'invalid json');
      
      const preferences = userPreferencesService.getPreferences();
      expect(preferences).toEqual({});
    });
  });

  describe('recipeExportService', () => {
    test('exports recipe as text', () => {
      const exportText = recipeExportService.exportAsText(mockRecipe);
      
      expect(exportText).toContain('Test Recipe');
      expect(exportText).toContain('A delicious test recipe');
      expect(exportText).toContain('INGREDIENTS:');
      expect(exportText).toContain('INSTRUCTIONS:');
      expect(exportText).toContain('NUTRITION (per serving):');
    });

    test('copies recipe to clipboard', async () => {
      await recipeExportService.copyToClipboard(mockRecipe);
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('Test Recipe')
      );
    });

    test('handles clipboard copy failure gracefully', async () => {
      navigator.clipboard.writeText.mockRejectedValue(new Error('Clipboard error'));
      
      const result = await recipeExportService.copyToClipboard(mockRecipe);
      expect(result).toBe(false);
    });

    test('shares recipe via Web Share API', async () => {
      await recipeExportService.shareRecipe(mockRecipe);
      
      expect(navigator.share).toHaveBeenCalledWith({
        title: 'Test Recipe',
        text: expect.stringContaining('A delicious test recipe'),
        url: window.location.href
      });
    });

    test('handles share failure gracefully', async () => {
      navigator.share.mockRejectedValue(new Error('Share error'));
      
      const result = await recipeExportService.shareRecipe(mockRecipe);
      expect(result).toBe(false);
    });

    test('falls back when Web Share API is not available', async () => {
      // Mock navigator.share to be undefined
      const originalShare = navigator.share;
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        writable: true
      });
      
      const result = await recipeExportService.shareRecipe(mockRecipe);
      expect(result).toBe(false);
      
      // Restore original
      Object.defineProperty(navigator, 'share', {
        value: originalShare,
        writable: true
      });
    });
  });

  describe('storageStatsService', () => {
    beforeEach(() => {
      // Add some test data
      recipeHistoryService.addToHistory(mockRecipe);
      recipeHistoryService.addToHistory({ ...mockRecipe, id: 2, title: 'Recipe 2' });
      savedRecipesService.saveRecipe(mockRecipe, 'dinner');
    });

    test('gets storage statistics', () => {
      const stats = storageStatsService.getStats();
      
      expect(stats).toHaveProperty('totalRecipesGenerated');
      expect(stats).toHaveProperty('totalSavedRecipes');
      expect(stats).toHaveProperty('totalCategories');
      expect(stats).toHaveProperty('mostViewedRecipe');
      expect(stats).toHaveProperty('recentActivity');
      expect(stats).toHaveProperty('storageUsed');
      
      expect(stats.totalRecipesGenerated).toBe(2);
      expect(stats.totalSavedRecipes).toBe(1);
      expect(stats.totalCategories).toBe(1);
    });

    test('identifies most viewed recipe', () => {
      // Add recipe multiple times to increase view count
      recipeHistoryService.addToHistory(mockRecipe);
      recipeHistoryService.addToHistory(mockRecipe);
      
      const stats = storageStatsService.getStats();
      expect(stats.mostViewedRecipe.id).toBe(mockRecipe.id);
      expect(stats.mostViewedRecipe.viewCount).toBe(3);
    });

    test('gets recent activity', () => {
      const stats = storageStatsService.getStats();
      expect(stats.recentActivity).toHaveLength(2);
      expect(stats.recentActivity[0].id).toBe(2); // Most recent first
    });

    test('calculates storage usage', () => {
      const stats = storageStatsService.getStats();
      expect(stats.storageUsed).toBeGreaterThan(0);
    });

    test('clears all data', () => {
      storageStatsService.clearAllData();
      
      expect(recipeHistoryService.getHistory()).toHaveLength(0);
      expect(savedRecipesService.getSavedRecipes()).toHaveLength(0);
      expect(userPreferencesService.getPreferences()).toEqual({});
    });

    test('handles empty data gracefully', () => {
      storageStatsService.clearAllData();
      
      const stats = storageStatsService.getStats();
      expect(stats.totalRecipesGenerated).toBe(0);
      expect(stats.totalSavedRecipes).toBe(0);
      expect(stats.totalCategories).toBe(0);
      expect(stats.mostViewedRecipe).toBeNull();
      expect(stats.recentActivity).toHaveLength(0);
    });
  });

  describe('Edge cases and error handling', () => {
    test('handles localStorage quota exceeded', () => {
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      
      // Should not throw error and should return false
      const result = recipeHistoryService.addToHistory(mockRecipe);
      expect(result).toBe(false);
      
      localStorageMock.setItem = originalSetItem;
    });

    test('handles null recipe gracefully', () => {
      expect(recipeHistoryService.addToHistory(null)).toBe(false);
      expect(savedRecipesService.saveRecipe(null)).toBe(false);
    });

    test('handles undefined recipe ID gracefully', () => {
      expect(recipeHistoryService.removeFromHistory(undefined)).toBe(false);
      expect(savedRecipesService.unsaveRecipe(undefined)).toBe(false);
    });
  });
}); 