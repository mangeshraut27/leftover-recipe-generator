// Enhanced AI Recipe Generation Service
// This creates dynamic recipes based on user's leftover ingredients

// Ingredient categories and their common pairings
const ingredientCategories = {
  proteins: {
    items: ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'eggs', 'tofu', 'beans', 'lentils', 'chickpeas'],
    pairings: ['vegetables', 'grains', 'herbs', 'spices']
  },
  vegetables: {
    items: ['tomatoes', 'onions', 'garlic', 'carrots', 'potatoes', 'bell peppers', 'spinach', 'broccoli', 'mushrooms', 'zucchini', 'cucumber', 'lettuce', 'celery', 'corn'],
    pairings: ['proteins', 'grains', 'herbs', 'dairy']
  },
  grains: {
    items: ['rice', 'pasta', 'bread', 'quinoa', 'oats', 'flour', 'noodles', 'couscous'],
    pairings: ['proteins', 'vegetables', 'dairy']
  },
  dairy: {
    items: ['milk', 'cheese', 'yogurt', 'cream', 'butter', 'mozzarella', 'parmesan', 'feta'],
    pairings: ['vegetables', 'grains', 'proteins']
  },
  herbs: {
    items: ['basil', 'oregano', 'thyme', 'rosemary', 'parsley', 'cilantro', 'mint', 'dill'],
    pairings: ['proteins', 'vegetables', 'grains']
  },
  spices: {
    items: ['salt', 'pepper', 'paprika', 'cumin', 'garlic powder', 'onion powder', 'chili powder', 'turmeric'],
    pairings: ['proteins', 'vegetables']
  },
  pantry: {
    items: ['olive oil', 'vegetable oil', 'vinegar', 'lemon', 'lime', 'soy sauce', 'honey', 'sugar', 'baking powder'],
    pairings: ['proteins', 'vegetables', 'grains']
  }
};

// Recipe templates based on meal types and cooking methods
const recipeTemplates = {
  breakfast: {
    'scrambled_eggs': {
      baseIngredients: ['eggs'],
      additionalIngredients: ['butter', 'milk', 'salt', 'pepper'],
      optionalIngredients: ['cheese', 'herbs', 'vegetables'],
      instructions: [
        'Crack {eggs} into a bowl and whisk with {milk}, salt, and pepper',
        'Heat {butter} in a non-stick pan over medium-low heat',
        'Pour in eggs and let sit for 20 seconds, then gently stir',
        'Continue cooking, stirring gently until eggs are creamy',
        'Add {cheese} and {vegetables} if using',
        'Serve immediately with toast'
      ],
      cookTime: 10,
      difficulty: 'Easy'
    },
    'pancakes': {
      baseIngredients: ['flour', 'eggs', 'milk'],
      additionalIngredients: ['baking powder', 'sugar', 'salt', 'butter'],
      optionalIngredients: ['vanilla', 'berries', 'honey'],
      instructions: [
        'Mix {flour}, baking powder, sugar, and salt in a large bowl',
        'In another bowl, whisk {eggs}, {milk}, and melted {butter}',
        'Combine wet and dry ingredients until just mixed',
        'Heat a griddle over medium heat',
        'Pour batter and cook until bubbles form, then flip',
        'Serve with {honey} and {berries}'
      ],
      cookTime: 20,
      difficulty: 'Easy'
    }
  },
  lunch: {
    'stir_fry': {
      baseIngredients: ['vegetables', 'protein'],
      additionalIngredients: ['oil', 'soy sauce', 'garlic', 'ginger'],
      optionalIngredients: ['rice', 'noodles', 'sesame oil', 'green onions'],
      instructions: [
        'Heat {oil} in a large wok or skillet over high heat',
        'Add {garlic} and ginger, stir-fry for 30 seconds',
        'Add {protein} and cook until almost done',
        'Add {vegetables} and stir-fry until tender-crisp',
        'Add {soy sauce} and toss to combine',
        'Serve over {rice} or {noodles}'
      ],
      cookTime: 15,
      difficulty: 'Easy'
    },
    'salad_bowl': {
      baseIngredients: ['lettuce', 'vegetables'],
      additionalIngredients: ['olive oil', 'vinegar', 'salt', 'pepper'],
      optionalIngredients: ['protein', 'cheese', 'nuts', 'seeds'],
      instructions: [
        'Wash and chop {lettuce} and {vegetables}',
        'Arrange in a large bowl',
        'Add {protein} and {cheese} if using',
        'Whisk together {olive oil}, {vinegar}, salt, and pepper',
        'Drizzle dressing over salad',
        'Toss gently and serve immediately'
      ],
      cookTime: 10,
      difficulty: 'Easy'
    },
    'pasta_dish': {
      baseIngredients: ['pasta'],
      additionalIngredients: ['olive oil', 'garlic', 'salt', 'pepper'],
      optionalIngredients: ['vegetables', 'protein', 'cheese', 'herbs'],
      instructions: [
        'Cook {pasta} according to package directions',
        'Heat {olive oil} in a large pan',
        'Add {garlic} and cook for 1 minute',
        'Add {vegetables} and {protein}, cook until tender',
        'Add drained pasta and toss',
        'Season with salt, pepper, and {herbs}',
        'Top with {cheese} and serve'
      ],
      cookTime: 20,
      difficulty: 'Medium'
    }
  },
  dinner: {
    'roasted_dish': {
      baseIngredients: ['protein', 'vegetables'],
      additionalIngredients: ['olive oil', 'salt', 'pepper', 'herbs'],
      optionalIngredients: ['potatoes', 'onions', 'garlic'],
      instructions: [
        'Preheat oven to 400°F (200°C)',
        'Cut {vegetables} and {potatoes} into chunks',
        'Toss with {olive oil}, salt, pepper, and {herbs}',
        'Place {protein} and vegetables on a baking sheet',
        'Roast for 25-35 minutes until cooked through',
        'Let rest for 5 minutes before serving'
      ],
      cookTime: 40,
      difficulty: 'Medium'
    },
    'soup': {
      baseIngredients: ['vegetables', 'broth'],
      additionalIngredients: ['onions', 'garlic', 'oil', 'salt', 'pepper'],
      optionalIngredients: ['protein', 'beans', 'herbs', 'cream'],
      instructions: [
        'Heat {oil} in a large pot',
        'Sauté {onions} and {garlic} until fragrant',
        'Add {vegetables} and cook for 5 minutes',
        'Add {broth} and bring to a boil',
        'Simmer for 20 minutes until vegetables are tender',
        'Add {protein} and {beans} if using',
        'Season with salt, pepper, and {herbs}'
      ],
      cookTime: 30,
      difficulty: 'Easy'
    }
  },
  snack: {
    'quick_bite': {
      baseIngredients: ['bread', 'cheese'],
      additionalIngredients: ['butter'],
      optionalIngredients: ['tomatoes', 'herbs', 'vegetables'],
      instructions: [
        'Toast {bread} until golden',
        'Spread with {butter}',
        'Top with {cheese} and {vegetables}',
        'Add {herbs} for extra flavor',
        'Serve immediately'
      ],
      cookTime: 5,
      difficulty: 'Easy'
    }
  },
  dessert: {
    'fruit_bowl': {
      baseIngredients: ['fruits'],
      additionalIngredients: ['honey', 'yogurt'],
      optionalIngredients: ['nuts', 'granola', 'mint'],
      instructions: [
        'Wash and cut {fruits} into bite-sized pieces',
        'Arrange in a bowl',
        'Drizzle with {honey}',
        'Top with {yogurt} and {nuts}',
        'Garnish with {mint} if desired'
      ],
      cookTime: 5,
      difficulty: 'Easy'
    }
  }
};

// Categorize user ingredients
const categorizeIngredients = (ingredients) => {
  const categorized = {
    proteins: [],
    vegetables: [],
    grains: [],
    dairy: [],
    herbs: [],
    spices: [],
    pantry: [],
    unknown: []
  };

  ingredients.forEach(ingredient => {
    const lowerIngredient = ingredient.toLowerCase();
    let categorized_flag = false;

    Object.keys(ingredientCategories).forEach(category => {
      if (ingredientCategories[category].items.some(item => 
        lowerIngredient.includes(item) || item.includes(lowerIngredient)
      )) {
        categorized[category].push(ingredient);
        categorized_flag = true;
      }
    });

    if (!categorized_flag) {
      categorized.unknown.push(ingredient);
    }
  });

  return categorized;
};

// Generate complementary ingredients
const generateComplementaryIngredients = (userIngredients, mealType, dietaryPreferences) => {
  const categorized = categorizeIngredients(userIngredients);
  const complementary = [];

  // Basic pantry items that are almost always needed
  const basicPantry = ['olive oil', 'salt', 'pepper'];
  complementary.push(...basicPantry);

  // Add protein if missing
  if (categorized.proteins.length === 0 && !dietaryPreferences.includes('vegan')) {
    if (dietaryPreferences.includes('vegetarian')) {
      complementary.push('eggs', 'cheese');
    } else {
      complementary.push('chicken breast');
    }
  }

  // Add vegetables if missing
  if (categorized.vegetables.length === 0) {
    complementary.push('onions', 'garlic');
  }

  // Add grains for lunch/dinner if missing
  if ((mealType === 'lunch' || mealType === 'dinner') && categorized.grains.length === 0) {
    complementary.push('rice');
  }

  // Add herbs for flavor
  if (categorized.herbs.length === 0) {
    complementary.push('fresh herbs (basil, parsley, or cilantro)');
  }

  return [...new Set(complementary)]; // Remove duplicates
};

// Create dynamic recipe
const createDynamicRecipe = (userIngredients, preferences) => {
  const { mealType, dietaryPreferences = [], servingSize = 4 } = preferences;
  const categorized = categorizeIngredients(userIngredients);
  
  // Select appropriate recipe template
  const mealTemplates = recipeTemplates[mealType] || recipeTemplates.lunch;
  const templateKeys = Object.keys(mealTemplates);
  
  // Choose template based on available ingredients
  let selectedTemplate = 'stir_fry'; // default
  
  if (categorized.proteins.length > 0 && categorized.vegetables.length > 0) {
    selectedTemplate = mealType === 'dinner' ? 'roasted_dish' : 'stir_fry';
  } else if (categorized.grains.length > 0) {
    selectedTemplate = 'pasta_dish';
  } else if (categorized.vegetables.length > 0) {
    selectedTemplate = mealType === 'lunch' ? 'salad_bowl' : 'soup';
  }
  
  // Use the first available template if selected doesn't exist
  if (!mealTemplates[selectedTemplate]) {
    selectedTemplate = templateKeys[0];
  }
  
  const template = mealTemplates[selectedTemplate];
  const complementaryIngredients = generateComplementaryIngredients(userIngredients, mealType, dietaryPreferences);
  
  // Combine user ingredients with complementary ones
  const allIngredients = [...userIngredients, ...complementaryIngredients];
  
  // Generate recipe title
  const mainIngredients = [...categorized.proteins, ...categorized.vegetables, ...categorized.grains]
    .slice(0, 2)
    .join(' and ');
  
  const title = mainIngredients 
    ? `${mainIngredients.charAt(0).toUpperCase() + mainIngredients.slice(1)} ${selectedTemplate.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
    : `Delicious ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`;

  return {
    id: Date.now(),
    title,
    description: `A delicious ${mealType} made with your leftover ${userIngredients.slice(0, 3).join(', ')}${userIngredients.length > 3 ? ' and more' : ''}`,
    prepTime: 10,
    cookTime: template.cookTime,
    totalTime: 10 + template.cookTime,
    difficulty: template.difficulty,
    servings: servingSize,
    ingredients: allIngredients.map(ing => 
      typeof ing === 'string' ? ing : `${ing.amount || ''} ${ing.unit || ''} ${ing.name || ing}`.trim()
    ),
    instructions: template.instructions.map((instruction, index) => ({
      step: index + 1,
      instruction: instruction.replace(/\{(\w+)\}/g, (match, ingredient) => {
        const found = allIngredients.find(ing => 
          ing.toLowerCase().includes(ingredient.toLowerCase())
        );
        return found || ingredient;
      })
    })),
    nutrition: {
      calories: Math.floor(300 + Math.random() * 300),
      protein: Math.floor(15 + Math.random() * 25),
      carbs: Math.floor(20 + Math.random() * 40),
      fat: Math.floor(10 + Math.random() * 20),
      fiber: Math.floor(3 + Math.random() * 8)
    },
    tags: [mealType, template.difficulty.toLowerCase(), 'leftover-friendly'],
    userIngredients: userIngredients,
    complementaryIngredients: complementaryIngredients
  };
};

// Simulate AI processing delay
const simulateAIDelay = () => {
  return new Promise(resolve => {
    setTimeout(resolve, 1500 + Math.random() * 1500); // 1.5-3 seconds
  });
};

// Generate recipe based on ingredients and preferences
export const generateRecipe = async (ingredients, preferences) => {
  await simulateAIDelay();
  
  try {
    if (!ingredients || ingredients.length === 0) {
      throw new Error('Please add at least one ingredient to generate a recipe');
    }

    const recipe = createDynamicRecipe(ingredients, preferences);
    
    return {
      success: true,
      recipe: recipe,
      aiInsights: generateAIInsights(ingredients, preferences),
      alternatives: generateAlternatives(recipe, preferences)
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to generate recipe. Please try again.'
    };
  }
};

// Generate AI insights about the recipe
const generateAIInsights = (ingredients, preferences) => {
  const insights = [];
  const categorized = categorizeIngredients(ingredients);
  
  if (ingredients.length >= 5) {
    insights.push("🎯 Excellent! You have a great variety of ingredients to work with.");
  }
  
  if (categorized.proteins.length > 0) {
    insights.push(`🥩 Your ${categorized.proteins.join(', ')} will provide excellent protein for this meal.`);
  }
  
  if (categorized.vegetables.length >= 3) {
    insights.push("🥬 Great vegetable variety! This will make your dish colorful and nutritious.");
  }
  
  if (preferences.dietaryPreferences?.includes('vegetarian')) {
    insights.push("🌱 This vegetarian recipe maximizes the flavors of your plant-based ingredients.");
  }
  
  if (preferences.cookingTime === '15') {
    insights.push("⚡ Perfect for a quick meal! We've designed this to be ready in no time.");
  }
  
  insights.push("♻️ Great job reducing food waste by using your leftover ingredients!");
  
  return insights;
};

// Generate recipe alternatives
const generateAlternatives = (baseRecipe, preferences) => {
  const alternatives = [];
  
  alternatives.push({
    title: "Spicier Version",
    description: "Add heat with chili peppers or hot sauce",
    modifications: ["Add 1-2 chili peppers", "Include red pepper flakes", "Drizzle with hot sauce"]
  });
  
  alternatives.push({
    title: "Healthier Version",
    description: "Boost nutrition and reduce calories",
    modifications: ["Add extra vegetables", "Use less oil", "Include leafy greens", "Use whole grain options"]
  });
  
  if (!preferences.dietaryPreferences?.includes('vegetarian')) {
    alternatives.push({
      title: "Vegetarian Version",
      description: "Replace meat with plant-based proteins",
      modifications: ["Use tofu or tempeh instead of meat", "Add beans or lentils", "Include nuts for protein"]
    });
  }
  
  return alternatives;
};

export default { generateRecipe }; 