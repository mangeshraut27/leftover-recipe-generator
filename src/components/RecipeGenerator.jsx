import React, { useState } from 'react';
import { generateRecipe } from '../services/recipeService';
import { recipeHistoryService } from '../services/storageService';
import LoadingSpinner from './LoadingSpinner';
import RecipeDisplay from './RecipeDisplay';

const RecipeGenerator = ({ ingredients, mealPreferences }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient to generate a recipe.');
      return;
    }

    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const generatedRecipe = await generateRecipe(ingredients, mealPreferences);
      
      // Add recipe to history automatically
      if (generatedRecipe.success && generatedRecipe.recipe) {
        const recipeWithId = {
          ...generatedRecipe.recipe,
          id: generatedRecipe.recipe.id || Date.now(),
          mealType: mealPreferences.mealType,
          userIngredients: ingredients,
          generatedWith: {
            ingredients,
            preferences: mealPreferences,
            timestamp: new Date().toISOString()
          }
        };
        
        recipeHistoryService.addToHistory(recipeWithId);
        setRecipe(recipeWithId);
      } else {
        setRecipe(generatedRecipe);
      }
    } catch (err) {
      setError('Failed to generate recipe. Please try again.');
      console.error('Recipe generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setError(null);
    setRecipe(null);
  };

  const handleGenerateAnother = () => {
    setRecipe(null);
    handleGenerateRecipe();
  };

  const handleRecipeSaved = (savedRecipe) => {
    // Optional: Show a success message or update UI
    console.log('Recipe saved:', savedRecipe.title);
  };

  const handleRecipeUnsaved = (recipeId) => {
    // Optional: Show a message or update UI
    console.log('Recipe unsaved:', recipeId);
  };

  // Show loading state
  if (loading) {
    return <LoadingSpinner message="Creating your perfect recipe..." />;
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-6xl">😔</div>
          <h3 className="text-xl font-semibold text-gray-900">Oops! Something went wrong</h3>
          <p className="text-gray-600 max-w-md">{error}</p>
          <div className="flex space-x-4">
            <button
              onClick={handleTryAgain}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={handleGenerateRecipe}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show recipe if generated
  if (recipe) {
    return (
      <div className="space-y-6">
        <RecipeDisplay 
          recipe={recipe} 
          onSave={handleRecipeSaved}
          onUnsave={handleRecipeUnsaved}
        />
        
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleTryAgain}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            ← Start Over
          </button>
          <button
            onClick={handleGenerateAnother}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            🎲 Generate Another Recipe
          </button>
        </div>
      </div>
    );
  }

  // Show initial state with generate button
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-6xl">🤖👨‍🍳</div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900">Ready to Cook?</h3>
          <p className="text-gray-600 max-w-md">
            Let our AI chef create a personalized recipe based on your ingredients and preferences!
          </p>
        </div>

        {/* Ingredients Summary */}
        {ingredients.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 max-w-md w-full">
            <h4 className="font-semibold text-gray-900 mb-2">Your Ingredients:</h4>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Meal Preferences Summary */}
        {(mealPreferences.mealType || mealPreferences.dietaryPreferences.length > 0 || mealPreferences.cookingTime) && (
          <div className="bg-gray-50 rounded-lg p-4 max-w-md w-full">
            <h4 className="font-semibold text-gray-900 mb-2">Your Preferences:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              {mealPreferences.mealType && (
                <p><strong>Meal Type:</strong> {mealPreferences.mealType}</p>
              )}
              {mealPreferences.cookingTime && (
                <p><strong>Cooking Time:</strong> {mealPreferences.cookingTime}</p>
              )}
              {mealPreferences.dietaryPreferences.length > 0 && (
                <p><strong>Dietary:</strong> {mealPreferences.dietaryPreferences.join(', ')}</p>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleGenerateRecipe}
          disabled={ingredients.length === 0}
          className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 ${
            ingredients.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {ingredients.length === 0 ? 'Add Ingredients First' : '🚀 Generate My Recipe!'}
        </button>

        {ingredients.length === 0 && (
          <p className="text-sm text-gray-500">
            Please add at least one ingredient to get started
          </p>
        )}
      </div>
    </div>
  );
};

export default RecipeGenerator; 