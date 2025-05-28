import React, { useState, useEffect } from 'react';
import { 
  recipeHistoryService, 
  savedRecipesService, 
  recipeExportService,
  storageStatsService 
} from '../services/storageService';
import RecipeDisplay from './RecipeDisplay';

const SavedRecipes = ({ onRecipeSelect }) => {
  const [activeTab, setActiveTab] = useState('history');
  const [recipeHistory, setRecipeHistory] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState({});

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRecipeHistory(recipeHistoryService.getHistory());
    setSavedRecipes(savedRecipesService.getSavedRecipes());
    setStats(storageStatsService.getStats());
  };

  // Filter and sort recipes
  const getFilteredRecipes = (recipes) => {
    let filtered = recipes;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (recipe.tags && recipe.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Apply category filter for saved recipes
    if (activeTab === 'saved' && selectedCategory !== 'all') {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.generatedAt || b.savedAt) - new Date(a.generatedAt || a.savedAt));
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'difficulty':
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        filtered.sort((a, b) => (difficultyOrder[a.difficulty] || 2) - (difficultyOrder[b.difficulty] || 2));
        break;
      case 'time':
        filtered.sort((a, b) => (a.totalTime || 0) - (b.totalTime || 0));
        break;
      default:
        break;
    }

    return filtered;
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    // Add to history if viewing a saved recipe
    if (activeTab === 'saved') {
      recipeHistoryService.addToHistory(recipe);
      loadData();
    }
  };

  const handleSaveRecipe = (recipe) => {
    savedRecipesService.saveRecipe(recipe);
    loadData();
  };

  const handleUnsaveRecipe = (recipeId) => {
    savedRecipesService.unsaveRecipe(recipeId);
    loadData();
  };

  const handleDeleteFromHistory = (recipeId) => {
    recipeHistoryService.removeFromHistory(recipeId);
    loadData();
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all recipe history? This action cannot be undone.')) {
      recipeHistoryService.clearHistory();
      loadData();
    }
  };

  const handleExportRecipe = async (recipe) => {
    const success = await recipeExportService.copyToClipboard(recipe);
    if (success) {
      alert('Recipe copied to clipboard!');
    } else {
      alert('Failed to copy recipe. Please try again.');
    }
  };

  const handleShareRecipe = async (recipe) => {
    const success = await recipeExportService.shareRecipe(recipe);
    if (!success) {
      // Fallback to copy
      handleExportRecipe(recipe);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const categories = savedRecipesService.getCategories();
  const currentRecipes = activeTab === 'history' ? recipeHistory : savedRecipes;
  const filteredRecipes = getFilteredRecipes(currentRecipes);

  // If a recipe is selected, show the recipe display
  if (selectedRecipe) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedRecipe(null)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="mr-2">←</span>
            Back to {activeTab === 'history' ? 'History' : 'Saved Recipes'}
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handleExportRecipe(selectedRecipe)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              📋 Copy Recipe
            </button>
            <button
              onClick={() => handleShareRecipe(selectedRecipe)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              📤 Share
            </button>
            {activeTab === 'history' && !savedRecipesService.isRecipeSaved(selectedRecipe.id) && (
              <button
                onClick={() => handleSaveRecipe(selectedRecipe)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                ⭐ Save Recipe
              </button>
            )}
          </div>
        </div>
        
        <RecipeDisplay recipe={selectedRecipe} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">My Recipe Collection</h2>
        <p className="text-purple-100">
          {stats.totalRecipesGenerated} recipes generated • {stats.totalSavedRecipes} saved favorites
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'history', label: 'Recipe History', icon: '📚', count: recipeHistory.length },
            { id: 'saved', label: 'Saved Favorites', icon: '⭐', count: savedRecipes.length },
            { id: 'stats', label: 'Statistics', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {(activeTab === 'history' || activeTab === 'saved') && (
          <>
            {/* Search and Filter Controls */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Category Filter (for saved recipes) */}
                {activeTab === 'saved' && categories.length > 0 && (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                )}

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="recent">Most Recent</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="difficulty">By Difficulty</option>
                  <option value="time">By Cooking Time</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
                </div>
                
                {activeTab === 'history' && recipeHistory.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    Clear History
                  </button>
                )}
              </div>
            </div>

            {/* Recipe Grid */}
            {filteredRecipes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {activeTab === 'history' ? '📚' : '⭐'}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeTab === 'history' ? 'No Recipe History' : 'No Saved Recipes'}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {activeTab === 'history' 
                    ? 'Start generating recipes to see them appear here!'
                    : 'Save your favorite recipes to access them quickly later.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    onClick={() => handleRecipeClick(recipe)}
                  >
                    {/* Recipe Card Header */}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{recipe.title}</h3>
                        {activeTab === 'saved' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnsaveRecipe(recipe.id);
                            }}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            🗑️
                          </button>
                        )}
                        {activeTab === 'history' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFromHistory(recipe.id);
                            }}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
                      
                      {/* Recipe Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>⏱️ {recipe.totalTime} min</span>
                        <span>👥 {recipe.servings}</span>
                        <span className={`px-2 py-1 rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                          {recipe.difficulty}
                        </span>
                      </div>

                      {/* Tags */}
                      {recipe.tags && recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {recipe.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                          {recipe.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{recipe.tags.length - 3} more</span>
                          )}
                        </div>
                      )}

                      {/* Metadata */}
                      <div className="text-xs text-gray-400">
                        {activeTab === 'history' ? (
                          <>
                            Generated {formatDate(recipe.generatedAt)}
                            {recipe.viewCount > 1 && (
                              <span className="ml-2">• Viewed {recipe.viewCount} times</span>
                            )}
                          </>
                        ) : (
                          <>
                            Saved {formatDate(recipe.savedAt)}
                            {recipe.userNotes && (
                              <span className="ml-2">• Has notes</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportRecipe(recipe);
                          }}
                          className="text-gray-600 hover:text-gray-800 text-sm"
                        >
                          📋
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareRecipe(recipe);
                          }}
                          className="text-gray-600 hover:text-gray-800 text-sm"
                        >
                          📤
                        </button>
                      </div>
                      
                      {activeTab === 'history' && !savedRecipesService.isRecipeSaved(recipe.id) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveRecipe(recipe);
                          }}
                          className="text-yellow-600 hover:text-yellow-800 text-sm"
                        >
                          ⭐ Save
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Usage Statistics</h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.totalRecipesGenerated}</div>
                <div className="text-sm text-blue-800">Recipes Generated</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.totalSavedRecipes}</div>
                <div className="text-sm text-green-800">Saved Favorites</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.totalCategories}</div>
                <div className="text-sm text-purple-800">Categories</div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round(stats.storageUsed / 1024)}KB
                </div>
                <div className="text-sm text-orange-800">Storage Used</div>
              </div>
            </div>

            {/* Most Viewed Recipe */}
            {stats.mostViewedRecipe?.title && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Most Viewed Recipe</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{stats.mostViewedRecipe.title}</div>
                    <div className="text-sm text-gray-600">
                      Viewed {stats.mostViewedRecipe.viewCount} times
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRecipe(stats.mostViewedRecipe)}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {stats.recentActivity && stats.recentActivity.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Recent Activity</h4>
                <div className="space-y-2">
                  {stats.recentActivity.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <div>
                        <div className="font-medium">{recipe.title}</div>
                        <div className="text-sm text-gray-600">
                          {formatDate(recipe.generatedAt)}
                        </div>
                      </div>
                      <span className="text-gray-400">→</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Data Management */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Data Management</h4>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                      storageStatsService.clearAllData();
                      loadData();
                    }
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRecipes; 