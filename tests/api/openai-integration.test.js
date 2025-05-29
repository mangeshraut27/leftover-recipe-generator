import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { generateRecipe } from '../../src/services/recipeService.js';

// Mock fetch for API testing
global.fetch = jest.fn();

describe('OpenAI API Integration Tests', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    fetch.mockClear();
    
    // Set up environment variable
    process.env.VITE_OPENAI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    // Clean up environment
    delete process.env.VITE_OPENAI_API_KEY;
  });

  describe('Successful API Calls', () => {
    it('should generate recipe using OpenAI API successfully', async () => {
      const mockApiResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              title: "Chicken Rice Bowl",
              description: "A delicious and healthy meal",
              totalTime: 30,
              servings: 4,
              difficulty: "Easy",
              ingredients: [
                { name: "chicken", amount: "1", unit: "lb", isLeftover: true },
                { name: "rice", amount: "2", unit: "cups", isLeftover: true }
              ],
              instructions: [
                { step: 1, instruction: "Cook the rice", time: 15 },
                { step: 2, instruction: "Cook the chicken", time: 15 }
              ],
              nutrition: {
                calories: 450,
                protein: 35,
                carbs: 40,
                fat: 12,
                fiber: 3,
                sugar: 2
              },
              tags: ["healthy", "quick"],
              aiInsights: {
                tips: ["Season well", "Don't overcook"],
                healthBenefits: ["High protein", "Balanced meal"],
                variations: ["Add vegetables", "Try different spices"]
              },
              alternatives: [{
                title: "Spicy Version",
                description: "Add chili peppers",
                modifications: ["Add 1 tsp chili flakes"]
              }]
            })
          }
        }]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      const ingredients = ['chicken', 'rice'];
      const preferences = {
        mealType: 'dinner',
        dietaryPreferences: [],
        cookingTime: '30',
        servingSize: 4
      };

      const result = await generateRecipe(ingredients, preferences);

      expect(result.success).toBe(true);
      expect(result.recipe.title).toBe("Chicken Rice Bowl");
      expect(result.recipe.source).toBe('openai');
      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json'
          })
        })
      );
    });

    it('should include dietary preferences in API request', async () => {
      const mockApiResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              title: "Vegan Pasta",
              description: "Plant-based pasta dish",
              totalTime: 25,
              servings: 2,
              difficulty: "Easy",
              ingredients: [],
              instructions: [],
              nutrition: {},
              tags: ["vegan"],
              aiInsights: { tips: [], healthBenefits: [], variations: [] },
              alternatives: []
            })
          }
        }]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      const ingredients = ['pasta', 'tomatoes'];
      const preferences = {
        mealType: 'lunch',
        dietaryPreferences: ['vegan', 'gluten-free'],
        cookingTime: '25',
        servingSize: 2
      };

      await generateRecipe(ingredients, preferences);

      const fetchCall = fetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);
      const userMessage = requestBody.messages[1].content;

      expect(userMessage).toContain('vegan, gluten-free');
      expect(userMessage).toContain('lunch');
      expect(userMessage).toContain('25 minutes');
      expect(userMessage).toContain('Serves 2');
    });
  });

  describe('API Error Handling', () => {
    it('should fall back to local generation when API key is missing', async () => {
      delete process.env.VITE_OPENAI_API_KEY;

      const ingredients = ['chicken', 'rice'];
      const preferences = { mealType: 'dinner' };

      const result = await generateRecipe(ingredients, preferences);

      expect(result.success).toBe(true);
      expect(result.recipe.source).toBe('fallback');
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should fall back to local generation when API returns error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          error: { message: 'Invalid API key' }
        })
      });

      const ingredients = ['chicken', 'rice'];
      const preferences = { mealType: 'dinner' };

      const result = await generateRecipe(ingredients, preferences);

      expect(result.success).toBe(true);
      expect(result.recipe.source).toBe('fallback');
      expect(result.recipe.title).toContain('chicken');
    });

    it('should fall back when API returns invalid JSON', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: 'Invalid JSON response'
            }
          }]
        })
      });

      const ingredients = ['pasta'];
      const preferences = { mealType: 'lunch' };

      const result = await generateRecipe(ingredients, preferences);

      expect(result.success).toBe(true);
      expect(result.recipe.source).toBe('fallback');
    });

    it('should fall back when network request fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const ingredients = ['eggs'];
      const preferences = { mealType: 'breakfast' };

      const result = await generateRecipe(ingredients, preferences);

      expect(result.success).toBe(true);
      expect(result.recipe.source).toBe('fallback');
    });

    it('should fall back when API response is malformed', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [] // Empty choices array
        })
      });

      const ingredients = ['fish'];
      const preferences = { mealType: 'dinner' };

      const result = await generateRecipe(ingredients, preferences);

      expect(result.success).toBe(true);
      expect(result.recipe.source).toBe('fallback');
    });
  });

  describe('API Request Validation', () => {
    it('should send correct request structure to OpenAI', async () => {
      const mockApiResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              title: "Test Recipe",
              description: "Test",
              totalTime: 30,
              servings: 4,
              difficulty: "Easy",
              ingredients: [],
              instructions: [],
              nutrition: {},
              tags: [],
              aiInsights: { tips: [], healthBenefits: [], variations: [] },
              alternatives: []
            })
          }
        }]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      const ingredients = ['chicken', 'vegetables'];
      const preferences = {
        mealType: 'dinner',
        dietaryPreferences: ['keto'],
        cookingTime: '45',
        servingSize: 6
      };

      await generateRecipe(ingredients, preferences);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json'
          },
          body: expect.stringContaining('"model":"gpt-4o-mini"')
        })
      );

      const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
      expect(requestBody.model).toBe('gpt-4o-mini');
      expect(requestBody.max_tokens).toBe(2000);
      expect(requestBody.temperature).toBe(0.7);
      expect(requestBody.messages).toHaveLength(2);
      expect(requestBody.messages[0].role).toBe('system');
      expect(requestBody.messages[1].role).toBe('user');
    });

    it('should handle empty ingredients gracefully', async () => {
      const ingredients = [];
      const preferences = { mealType: 'dinner' };

      const result = await generateRecipe(ingredients, preferences);

      expect(result.success).toBe(false);
      expect(result.error).toContain('at least one ingredient');
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('Response Processing', () => {
    it('should correctly parse and structure OpenAI response', async () => {
      const mockRecipe = {
        title: "AI Generated Recipe",
        description: "A creative combination",
        totalTime: 40,
        servings: 3,
        difficulty: "Medium",
        ingredients: [
          { name: "ingredient1", amount: "2", unit: "cups", isLeftover: true }
        ],
        instructions: [
          { step: 1, instruction: "Do something", time: 20 }
        ],
        nutrition: {
          calories: 500,
          protein: 25,
          carbs: 45,
          fat: 18,
          fiber: 6,
          sugar: 8
        },
        tags: ["creative", "leftover-friendly"],
        aiInsights: {
          tips: ["Great tip"],
          healthBenefits: ["Healthy benefit"],
          variations: ["Try this variation"]
        },
        alternatives: [{
          title: "Alternative",
          description: "Different approach",
          modifications: ["Change this"]
        }]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: JSON.stringify(mockRecipe)
            }
          }]
        })
      });

      const result = await generateRecipe(['test'], { mealType: 'dinner' });

      expect(result.success).toBe(true);
      expect(result.recipe.title).toBe(mockRecipe.title);
      expect(result.recipe.id).toBeDefined();
      expect(result.recipe.createdAt).toBeDefined();
      expect(result.recipe.source).toBe('openai');
      expect(result.aiInsights).toEqual(mockRecipe.aiInsights);
      expect(result.alternatives).toEqual(mockRecipe.alternatives);
    });
  });
}); 