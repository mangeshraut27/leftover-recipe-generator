import { useState } from 'react'
import IngredientInput from './components/IngredientInput'
import MealTypeSelector from './components/MealTypeSelector'
import RecipeGenerator from './components/RecipeGenerator'
import SavedRecipes from './components/SavedRecipes'
import Community from './components/Community'

function App() {
  const [ingredients, setIngredients] = useState([]);
  const [mealPreferences, setMealPreferences] = useState({
    mealType: '',
    dietaryPreferences: [],
    cookingTime: '',
    servingSize: 2
  });
  const [currentView, setCurrentView] = useState('generator'); // 'generator', 'saved', or 'community'

  const handleIngredientsChange = (newIngredients) => {
    setIngredients(newIngredients);
  };

  const handleMealPreferencesChange = (preferences) => {
    setMealPreferences(preferences);
  };

  const isReadyForRecipes = ingredients.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🍲 Leftover Recipe Generator
          </h1>
          <p className="text-lg text-gray-600">
            Turn your leftover ingredients into delicious, healthy meals with AI
          </p>
          
          {/* Navigation */}
          <div className="mt-6 flex justify-center space-x-4">
            <button
              onClick={() => setCurrentView('generator')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'generator'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🤖 Generate Recipe
            </button>
            <button
              onClick={() => setCurrentView('saved')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'saved'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              📚 My Recipes
            </button>
            <button
              onClick={() => setCurrentView('community')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'community'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              👥 Community
            </button>
          </div>
        </header>

        <main className="space-y-8">
          {currentView === 'generator' ? (
            <>
              {/* Step 1: Ingredient Input */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                    1
                  </span>
                  <h2 className="text-xl font-semibold text-gray-900">
                    What ingredients do you have?
                  </h2>
                </div>
                <IngredientInput onIngredientsChange={handleIngredientsChange} />
              </div>

              {/* Step 2: Meal Type Selection */}
              {ingredients.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      2
                    </span>
                    <h2 className="text-xl font-semibold text-gray-900">
                      What would you like to make?
                    </h2>
                  </div>
                  <MealTypeSelector onSelectionChange={handleMealPreferencesChange} />
                </div>
              )}

              {/* Step 3: Recipe Generation */}
              {isReadyForRecipes && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                      3
                    </span>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Generate Your Recipe
                    </h2>
                  </div>
                  
                  <RecipeGenerator 
                    ingredients={ingredients} 
                    mealPreferences={mealPreferences} 
                  />
                </div>
              )}
            </>
          ) : currentView === 'saved' ? (
            /* Saved Recipes View */
            <SavedRecipes />
          ) : (
            /* Community View */
            <Community />
          )}
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>Made with ❤️ and AI • Reduce food waste, one recipe at a time</p>
        </footer>
      </div>
    </div>
  )
}

export default App
