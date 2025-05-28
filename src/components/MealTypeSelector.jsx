import React, { useState } from 'react';

const MealTypeSelector = ({ onSelectionChange }) => {
  const [selectedMealType, setSelectedMealType] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [cookingTime, setCookingTime] = useState('');
  const [servingSize, setServingSize] = useState(4);

  const mealTypes = [
    { id: 'breakfast', label: 'Breakfast', icon: '🍳', description: 'Start your day right' },
    { id: 'lunch', label: 'Lunch', icon: '🥗', description: 'Midday fuel' },
    { id: 'dinner', label: 'Dinner', icon: '🍽️', description: 'Evening feast' },
    { id: 'snack', label: 'Snack', icon: '🍿', description: 'Quick bite' },
    { id: 'dessert', label: 'Dessert', icon: '🍰', description: 'Sweet treat' }
  ];

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥬', color: 'green' },
    { id: 'vegan', label: 'Vegan', icon: '🌱', color: 'emerald' },
    { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾', color: 'amber' },
    { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛', color: 'blue' },
    { id: 'low-carb', label: 'Low-Carb', icon: '🥩', color: 'red' },
    { id: 'keto', label: 'Keto', icon: '🥑', color: 'purple' }
  ];

  const cookingTimeOptions = [
    { id: '15', label: '15 min', fullLabel: '15 minutes or less', icon: '⚡', description: 'Super quick' },
    { id: '30', label: '30 min', fullLabel: '30 minutes or less', icon: '⏰', description: 'Quick & easy' },
    { id: '60', label: '1 hour', fullLabel: '1 hour or less', icon: '🕐', description: 'Moderate time' },
    { id: '120', label: '2 hours', fullLabel: '2 hours or less', icon: '⏳', description: 'Take your time' },
    { id: 'any', label: 'Any time', fullLabel: 'Any time', icon: '🍳', description: 'No rush' }
  ];

  const handleMealTypeSelect = (mealType) => {
    setSelectedMealType(mealType);
    updateSelection({ mealType, dietaryPreferences, cookingTime, servingSize });
  };

  const handleDietaryToggle = (dietary) => {
    const newPreferences = dietaryPreferences.includes(dietary)
      ? dietaryPreferences.filter(pref => pref !== dietary)
      : [...dietaryPreferences, dietary];
    
    setDietaryPreferences(newPreferences);
    updateSelection({ mealType: selectedMealType, dietaryPreferences: newPreferences, cookingTime, servingSize });
  };

  const handleCookingTimeSelect = (time) => {
    setCookingTime(time);
    updateSelection({ mealType: selectedMealType, dietaryPreferences, cookingTime: time, servingSize });
  };

  const handleServingSizeChange = (size) => {
    setServingSize(size);
    updateSelection({ mealType: selectedMealType, dietaryPreferences, cookingTime, servingSize: size });
  };

  const updateSelection = (selection) => {
    if (onSelectionChange) {
      onSelectionChange(selection);
    }
  };

  const getColorClasses = (color, isSelected) => {
    const colors = {
      green: isSelected ? 'border-green-500 bg-green-100 text-green-800' : 'border-gray-200 hover:border-green-300 hover:bg-green-50',
      emerald: isSelected ? 'border-emerald-500 bg-emerald-100 text-emerald-800' : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50',
      amber: isSelected ? 'border-amber-500 bg-amber-100 text-amber-800' : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50',
      blue: isSelected ? 'border-blue-500 bg-blue-100 text-blue-800' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50',
      red: isSelected ? 'border-red-500 bg-red-100 text-red-800' : 'border-gray-200 hover:border-red-300 hover:bg-red-50',
      purple: isSelected ? 'border-purple-500 bg-purple-100 text-purple-800' : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">What would you like to make?</h2>
        <p className="text-gray-600">Choose your preferences to get the perfect recipe</p>
      </div>
      
      {/* Selection Summary - Prominent at top */}
      {selectedMealType && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="text-2xl mr-2">✨</span>
              Your Recipe Preferences
            </h4>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Ready to Generate!
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-sm">
              <span className="text-2xl">{mealTypes.find(m => m.id === selectedMealType)?.icon}</span>
              <div>
                <div className="font-semibold text-gray-800">{mealTypes.find(m => m.id === selectedMealType)?.label}</div>
                <div className="text-sm text-gray-600">Meal Type</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-sm">
              <span className="text-2xl">🌱</span>
              <div>
                <div className="font-semibold text-gray-800">
                  {dietaryPreferences.length > 0 
                    ? dietaryPreferences.length === 1 
                      ? dietaryOptions.find(d => d.id === dietaryPreferences[0])?.label
                      : `${dietaryPreferences.length} preferences`
                    : 'No restrictions'
                  }
                </div>
                <div className="text-sm text-gray-600">Dietary</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-sm">
              <span className="text-2xl">{cookingTime ? cookingTimeOptions.find(t => t.id === cookingTime)?.icon : '⏰'}</span>
              <div>
                <div className="font-semibold text-gray-800">
                  {cookingTime ? cookingTimeOptions.find(t => t.id === cookingTime)?.label : 'Any time'}
                </div>
                <div className="text-sm text-gray-600">Cooking Time</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-white rounded-lg p-3 shadow-sm">
              <span className="text-2xl">👥</span>
              <div>
                <div className="font-semibold text-gray-800">{servingSize} serving{servingSize !== 1 ? 's' : ''}</div>
                <div className="text-sm text-gray-600">Portion Size</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Meal Type Selection */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-2xl mr-2">🍽️</span>
          Choose Your Meal Type
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {mealTypes.map((meal) => (
            <button
              key={meal.id}
              onClick={() => handleMealTypeSelect(meal.id)}
              className={`group relative p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                selectedMealType === meal.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{meal.icon}</div>
                <div className="font-bold text-lg mb-1">{meal.label}</div>
                <div className="text-sm text-gray-500">{meal.description}</div>
              </div>
              {selectedMealType === meal.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary Preferences */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-2xl mr-2">🌱</span>
          Dietary Preferences
          <span className="ml-2 text-sm font-normal text-gray-500">(Optional - select any that apply)</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {dietaryOptions.map((dietary) => {
            const isSelected = dietaryPreferences.includes(dietary.id);
            return (
              <button
                key={dietary.id}
                onClick={() => handleDietaryToggle(dietary.id)}
                className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md hover:scale-105 ${
                  getColorClasses(dietary.color, isSelected)
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">{dietary.icon}</div>
                  <div className="font-semibold text-sm">{dietary.label}</div>
                </div>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-current rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {dietaryPreferences.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {dietaryPreferences.map(pref => {
              const option = dietaryOptions.find(d => d.id === pref);
              return (
                <span key={pref} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  <span className="mr-1">{option?.icon}</span>
                  {option?.label}
                  <button
                    onClick={() => handleDietaryToggle(pref)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Cooking Time */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-2xl mr-2">⏰</span>
          How much time do you have?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {cookingTimeOptions.map((time) => (
            <button
              key={time.id}
              onClick={() => handleCookingTimeSelect(time.id)}
              className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md hover:scale-105 ${
                cookingTime === time.id
                  ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md scale-105'
                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">{time.icon}</div>
                <div className="font-bold text-sm mb-1">{time.label}</div>
                <div className="text-xs text-gray-500">{time.description}</div>
              </div>
              {cookingTime === time.id && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Serving Size */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="text-2xl mr-2">👥</span>
          How many people are you cooking for?
        </h3>
        <div className="flex items-center justify-center space-x-6 bg-gray-50 rounded-xl p-6">
          <button
            onClick={() => handleServingSizeChange(Math.max(1, servingSize - 1))}
            className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 flex items-center justify-center font-bold text-gray-600 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            -
          </button>
          <div className="flex items-center space-x-4 bg-white rounded-xl px-6 py-4 shadow-sm border-2 border-blue-200">
            <span className="text-3xl">👥</span>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">{servingSize}</div>
              <div className="text-sm text-gray-600">serving{servingSize !== 1 ? 's' : ''}</div>
            </div>
          </div>
          <button
            onClick={() => handleServingSizeChange(Math.min(12, servingSize + 1))}
            className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 flex items-center justify-center font-bold text-gray-600 hover:text-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealTypeSelector; 