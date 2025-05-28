import { useState, useRef, useEffect } from 'react';

const COMMON_INGREDIENTS = [
  'tomatoes', 'onions', 'garlic', 'carrots', 'potatoes', 'bell peppers',
  'chicken breast', 'ground beef', 'salmon', 'eggs', 'milk', 'cheese',
  'rice', 'pasta', 'bread', 'flour', 'olive oil', 'butter',
  'spinach', 'broccoli', 'mushrooms', 'zucchini', 'cucumber', 'lettuce',
  'apples', 'bananas', 'lemons', 'avocado', 'beans', 'lentils',
  'yogurt', 'cream', 'herbs', 'spices', 'salt', 'pepper'
];

const IngredientInput = ({ onIngredientsChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (onIngredientsChange) {
      onIngredientsChange(selectedIngredients);
    }
  }, [selectedIngredients, onIngredientsChange]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim().length > 0) {
      const filteredSuggestions = COMMON_INGREDIENTS.filter(ingredient =>
        ingredient.toLowerCase().includes(value.toLowerCase()) &&
        !selectedIngredients.includes(ingredient)
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (ingredient) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const ingredient = inputValue.trim().toLowerCase();
      if (!selectedIngredients.includes(ingredient)) {
        setSelectedIngredients([...selectedIngredients, ingredient]);
      }
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const removeIngredient = (ingredientToRemove) => {
    setSelectedIngredients(selectedIngredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <label htmlFor="ingredient-input" className="block text-sm font-medium text-gray-700 mb-2">
        Add your leftover ingredients
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          id="ingredient-input"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type an ingredient..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          data-testid="ingredient-input"
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                data-testid={`suggestion-${index}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedIngredients.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected ingredients:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map((ingredient, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                data-testid={`selected-ingredient-${index}`}
              >
                {ingredient}
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                  data-testid={`remove-ingredient-${index}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientInput; 