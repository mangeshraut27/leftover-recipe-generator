import React, { useState } from 'react';
import { savedRecipesService, recipeExportService } from '../services/storageService';
import SocialFeatures from './SocialFeatures';

const RecipeDisplay = ({ recipe, onSave, onUnsave }) => {
  const [activeTab, setActiveTab] = useState('recipe');
  const [isSaved, setIsSaved] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [showSocialFeatures, setShowSocialFeatures] = useState(false);

  // Check if recipe is saved on component mount and when recipe changes
  React.useEffect(() => {
    if (recipe?.id) {
      setIsSaved(savedRecipesService.isRecipeSaved(recipe.id));
    }
  }, [recipe?.id]);

  if (!recipe) return null;

  const handleSaveToggle = () => {
    if (isSaved) {
      savedRecipesService.unsaveRecipe(recipe.id);
      setIsSaved(false);
      onUnsave?.(recipe.id);
    } else {
      savedRecipesService.saveRecipe(recipe);
      setIsSaved(true);
      setShowSaveSuccess(true);
      setTimeout(() => setShowSaveSuccess(false), 2000);
      onSave?.(recipe);
    }
  };

  const handleExportRecipe = async () => {
    const success = await recipeExportService.copyToClipboard(recipe);
    if (success) {
      alert('Recipe copied to clipboard!');
    } else {
      alert('Failed to copy recipe. Please try again.');
    }
  };

  const handleShareRecipe = async () => {
    const success = await recipeExportService.shareRecipe(recipe);
    if (!success) {
      // Fallback to copy
      handleExportRecipe();
    }
  };

  const handleSocialFeatures = () => {
    setShowSocialFeatures(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Recipe Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
            <p className="text-blue-100 text-lg mb-4">{recipe.description}</p>
            
            {/* Recipe Stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <span className="mr-1">⏱️</span>
                <span>Total: {formatTime(recipe.totalTime)}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">👥</span>
                <span>{recipe.servings} servings</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 ml-6">
            <button
              onClick={handleSaveToggle}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isSaved
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
            >
              {isSaved ? '⭐ Saved' : '☆ Save Recipe'}
            </button>
            
            <button
              onClick={handleSocialFeatures}
              className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors font-medium"
            >
              🌟 Social
            </button>
            
            <button
              onClick={handleExportRecipe}
              className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors font-medium"
            >
              📋 Copy
            </button>
            
            <button
              onClick={handleShareRecipe}
              className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors font-medium"
            >
              📤 Share
            </button>
          </div>
        </div>

        {/* Save Success Message */}
        {showSaveSuccess && (
          <div className="mt-4 p-3 bg-green-500 bg-opacity-20 border border-green-300 rounded-lg">
            <div className="flex items-center">
              <span className="mr-2">✅</span>
              <span>Recipe saved to your favorites!</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'recipe', label: 'Recipe', icon: '📝' },
            { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
            { id: 'insights', label: 'AI Insights', icon: '🤖' },
            { id: 'alternatives', label: 'Alternatives', icon: '🔄' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'recipe' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🛒</span>
                Ingredients
              </h3>
              <div className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      className="mr-3 h-4 w-4 text-blue-600 rounded"
                      id={`ingredient-${index}`}
                    />
                    <label htmlFor={`ingredient-${index}`} className="text-gray-700 cursor-pointer">
                      <span className="font-medium">{ingredient.amount} {ingredient.unit}</span> {ingredient.name}
                    </label>
                  </div>
                ))}
              </div>

              {/* Timing Breakdown */}
              {recipe.timing && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">⏰ Timing</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Prep: {recipe.timing.prep} min</div>
                    <div>Cook: {recipe.timing.cook} min</div>
                    <div className="font-medium">Total: {recipe.totalTime} min</div>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">👨‍🍳</span>
                Instructions
              </h3>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 leading-relaxed pt-1">{instruction.instruction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="max-w-2xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">📊</span>
              Nutrition Information
              <span className="ml-2 text-sm text-gray-500">(per serving)</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(recipe.nutrition).map(([key, value]) => (
                <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{value}</div>
                  <div className="text-sm text-gray-600 capitalize">
                    {key === 'calories' ? 'Calories' : 
                     key === 'carbs' ? 'Carbs (g)' :
                     key === 'protein' ? 'Protein (g)' :
                     key === 'fat' ? 'Fat (g)' :
                     key === 'fiber' ? 'Fiber (g)' : key}
                  </div>
                </div>
              ))}
            </div>

            {/* Nutrition Chart */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Macronutrient Breakdown</h4>
              <div className="space-y-2">
                {['protein', 'carbs', 'fat'].map((macro) => {
                  const total = recipe.nutrition.protein + recipe.nutrition.carbs + recipe.nutrition.fat;
                  const percentage = Math.round((recipe.nutrition[macro] / total) * 100);
                  return (
                    <div key={macro} className="flex items-center">
                      <span className="w-16 text-sm text-gray-600 capitalize">{macro}:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mx-3">
                        <div
                          className={`h-2 rounded-full ${
                            macro === 'protein' ? 'bg-red-500' :
                            macro === 'carbs' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="max-w-3xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">🤖</span>
              AI Insights & Tips
            </h3>
            
            {recipe.aiInsights ? (
              <div className="space-y-6">
                {/* Chef Tips */}
                {recipe.aiInsights.tips && recipe.aiInsights.tips.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">💡</span>
                      Chef Tips
                    </h4>
                    <div className="space-y-3">
                      {recipe.aiInsights.tips.map((tip, index) => (
                        <div key={index} className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                          <p className="text-gray-700">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Health Benefits */}
                {recipe.aiInsights.healthBenefits && recipe.aiInsights.healthBenefits.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">🌱</span>
                      Health Benefits
                    </h4>
                    <div className="space-y-3">
                      {recipe.aiInsights.healthBenefits.map((benefit, index) => (
                        <div key={index} className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                          <p className="text-gray-700">{benefit}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recipe Variations */}
                {recipe.aiInsights.variations && recipe.aiInsights.variations.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <span className="mr-2">🔄</span>
                      Recipe Variations
                    </h4>
                    <div className="space-y-3">
                      {recipe.aiInsights.variations.map((variation, index) => (
                        <div key={index} className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
                          <p className="text-gray-700">{variation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-4 block">🤖</span>
                <p>No AI insights available for this recipe.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'alternatives' && (
          <div className="max-w-4xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">🔄</span>
              Recipe Alternatives
            </h3>
            
            {recipe.alternatives && recipe.alternatives.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {recipe.alternatives.map((alternative, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{alternative.title}</h4>
                    <p className="text-gray-600 mb-4">{alternative.description}</p>
                    
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900">Modifications:</h5>
                      <ul className="space-y-1">
                        {alternative.modifications.map((mod, modIndex) => (
                          <li key={modIndex} className="text-sm text-gray-600 flex items-start">
                            <span className="mr-2 text-green-500">•</span>
                            {mod}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-4 block">🔄</span>
                <p>No alternatives available for this recipe.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recipe Tags */}
      <div className="px-6 pb-6">
        <div className="flex flex-wrap gap-2">
          {recipe.tags && recipe.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Social Features Modal */}
      {showSocialFeatures && (
        <SocialFeatures
          recipe={recipe}
          onClose={() => setShowSocialFeatures(false)}
        />
      )}
    </div>
  );
};

export default RecipeDisplay; 