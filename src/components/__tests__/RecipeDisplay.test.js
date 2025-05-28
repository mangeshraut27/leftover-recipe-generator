import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipeDisplay from '../RecipeDisplay';

const mockRecipe = {
  id: 1,
  title: 'Chicken Rice Bowl',
  description: 'A delicious and healthy chicken rice bowl perfect for dinner',
  totalTime: 30,
  servings: 4,
  difficulty: 'Easy',
  ingredients: [
    { name: 'chicken breast', amount: '2', unit: 'pieces' },
    { name: 'rice', amount: '1', unit: 'cup' },
    { name: 'onion', amount: '1', unit: 'medium' },
    { name: 'olive oil', amount: '2', unit: 'tbsp' }
  ],
  timing: {
    prep: 10,
    cook: 20
  },
  instructions: [
    { step: 1, instruction: 'Cook the rice according to package instructions.' },
    { step: 2, instruction: 'Season and cook the chicken breast until golden.' },
    { step: 3, instruction: 'Sauté the onion until translucent.' },
    { step: 4, instruction: 'Combine all ingredients and serve hot.' }
  ],
  nutrition: {
    calories: 450,
    protein: 35,
    carbs: 45,
    fat: 12,
    fiber: 3,
    sugar: 5,
    sodium: 800
  },
  tags: ['healthy', 'gluten-free', 'high-protein', 'quick'],
  aiInsights: {
    tips: [
      'Let the chicken rest before slicing for better texture',
      'Use jasmine rice for the best flavor'
    ],
    healthBenefits: [
      'High in protein for muscle building',
      'Good source of complex carbs for energy'
    ],
    variations: [
      'Add vegetables for extra nutrients',
      'Try brown rice for more fiber'
    ]
  },
  alternatives: [
    {
      title: 'Vegetarian Rice Bowl',
      description: 'Replace chicken with tofu for a plant-based option',
      modifications: [
        'Use firm tofu instead of chicken',
        'Add extra vegetables like bell peppers',
        'Include sesame oil for flavor'
      ]
    },
    {
      title: 'Spicy Chicken Rice Bowl',
      description: 'Add heat with chili peppers and spices',
      modifications: [
        'Add diced jalapeños',
        'Include chili powder in seasoning',
        'Serve with hot sauce'
      ]
    }
  ]
};

describe('RecipeDisplay', () => {
  test('renders recipe header information correctly', () => {
    render(<RecipeDisplay recipe={mockRecipe} />);
    
    expect(screen.getByText('Chicken Rice Bowl')).toBeInTheDocument();
    expect(screen.getByText('A delicious and healthy chicken rice bowl perfect for dinner')).toBeInTheDocument();
    
    // Check for timing - there are multiple "Total: 30 min" elements, so we'll check for the first one
    const timingElements = screen.getAllByText((content, element) => {
      return element?.textContent === 'Total: 30 min';
    });
    expect(timingElements[0]).toBeInTheDocument();
    
    const servingElements = screen.getAllByText((content, element) => {
      return element?.textContent === '4 servings';
    });
    expect(servingElements[0]).toBeInTheDocument();
    
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  test('renders all navigation tabs', () => {
    render(<RecipeDisplay recipe={mockRecipe} />);

    expect(screen.getByText('Recipe')).toBeInTheDocument();
    expect(screen.getByText('Nutrition')).toBeInTheDocument();
    expect(screen.getByText('AI Insights')).toBeInTheDocument();
    expect(screen.getByText('Alternatives')).toBeInTheDocument();
  });

  test('displays default recipe content', () => {
    render(<RecipeDisplay recipe={mockRecipe} />);
    
    // Should show ingredients
    expect(screen.getByText('Ingredients')).toBeInTheDocument();
    expect(screen.getByText('chicken breast')).toBeInTheDocument();
    expect(screen.getByText('rice')).toBeInTheDocument();
    
    // Should show instructions
    expect(screen.getByText('Instructions')).toBeInTheDocument();
    expect(screen.getByText('Cook the rice according to package instructions.')).toBeInTheDocument();
    
    // Should show timing
    expect(screen.getByText('⏰ Timing')).toBeInTheDocument();
    expect(screen.getByText('Prep: 10 min')).toBeInTheDocument();
    expect(screen.getByText('Cook: 20 min')).toBeInTheDocument();
  });

  test('switches to nutrition tab when clicked', () => {
    render(<RecipeDisplay recipe={mockRecipe} />);
    
    const nutritionTab = screen.getByText('Nutrition');
    fireEvent.click(nutritionTab);

    expect(screen.getByText('Nutrition Information')).toBeInTheDocument();
    expect(screen.getByText('450')).toBeInTheDocument(); // calories
    expect(screen.getByText('35')).toBeInTheDocument(); // protein
    expect(screen.getByText('Macronutrient Breakdown')).toBeInTheDocument();
  });

  test('switches to AI insights tab when clicked', () => {
    render(<RecipeDisplay recipe={mockRecipe} />);
    
    const insightsTab = screen.getByText('AI Insights');
    fireEvent.click(insightsTab);

    expect(screen.getByText('AI Insights & Tips')).toBeInTheDocument();
    expect(screen.getByText('Chef Tips')).toBeInTheDocument();
    expect(screen.getByText('Health Benefits')).toBeInTheDocument();
  });

  test('switches to alternatives tab when clicked', () => {
    render(<RecipeDisplay recipe={mockRecipe} />);
    
    const alternativesTab = screen.getByText('Alternatives');
    fireEvent.click(alternativesTab);

    expect(screen.getByText('Recipe Alternatives')).toBeInTheDocument();
    expect(screen.getByText('Vegetarian Rice Bowl')).toBeInTheDocument();
  });

  test('allows checking ingredients', () => {
    render(<RecipeDisplay recipe={mockRecipe} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(mockRecipe.ingredients.length);
    
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
  });

  test('displays all recipe tags', () => {
    render(<RecipeDisplay recipe={mockRecipe} />);
    
    mockRecipe.tags.forEach(tag => {
      expect(screen.getByText(`#${tag}`)).toBeInTheDocument();
    });
  });

  test('shows correct difficulty color styling', () => {
    render(<RecipeDisplay recipe={mockRecipe} />);
    
    const difficultyElement = screen.getByText('Easy');
    expect(difficultyElement).toHaveClass('text-green-600', 'bg-green-100');
  });

  test('handles recipe without AI insights gracefully', () => {
    const recipeWithoutInsights = { ...mockRecipe, aiInsights: null };
    render(<RecipeDisplay recipe={recipeWithoutInsights} />);
    
    fireEvent.click(screen.getByText('AI Insights'));
    expect(screen.getByText('No AI insights available for this recipe.')).toBeInTheDocument();
  });

  test('handles recipe without alternatives gracefully', () => {
    const recipeWithoutAlternatives = { ...mockRecipe, alternatives: null };
    render(<RecipeDisplay recipe={recipeWithoutAlternatives} />);
    
    fireEvent.click(screen.getByText('Alternatives'));
    expect(screen.getByText('No alternatives available for this recipe.')).toBeInTheDocument();
  });

  test('displays all instruction steps in order', () => {
    render(<RecipeDisplay recipe={mockRecipe} />);
    
    mockRecipe.instructions.forEach((instruction, index) => {
      expect(screen.getByText(`${index + 1}`)).toBeInTheDocument();
      expect(screen.getByText(instruction.instruction)).toBeInTheDocument();
    });
  });

  test('has correct active tab styling', () => {
    render(<RecipeDisplay recipe={mockRecipe} />);
    
    const recipeTab = screen.getByRole('button', { name: /📝 Recipe/ });
    expect(recipeTab).toHaveClass('border-blue-500', 'text-blue-600');
  });

  test('displays nutrition information correctly', () => {
    render(<RecipeDisplay recipe={mockRecipe} />);
    
    fireEvent.click(screen.getByText('Nutrition'));
    
    // Check all nutrition values (just the numbers, not with units)
    expect(screen.getByText('450')).toBeInTheDocument(); // calories
    expect(screen.getByText('35')).toBeInTheDocument(); // protein
    expect(screen.getByText('45')).toBeInTheDocument(); // carbs
    expect(screen.getByText('12')).toBeInTheDocument(); // fat
    expect(screen.getByText('3')).toBeInTheDocument(); // fiber
  });

  test('handles missing timing information', () => {
    const recipeWithoutTiming = {
      ...mockRecipe,
      timing: null
    };

    render(<RecipeDisplay recipe={recipeWithoutTiming} />);

    // Should not crash and should not show timing section
    expect(screen.queryByText('Timing')).not.toBeInTheDocument();
  });

  test('handles empty ingredients list', () => {
    const recipeWithoutIngredients = {
      ...mockRecipe,
      ingredients: []
    };

    render(<RecipeDisplay recipe={recipeWithoutIngredients} />);

    expect(screen.getByText('Ingredients')).toBeInTheDocument();
    // Should not crash with empty ingredients
  });
}); 