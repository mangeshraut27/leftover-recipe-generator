import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecipeGenerator from '../RecipeGenerator';
import * as recipeService from '../../services/recipeService';

// Mock the recipe service
jest.mock('../../services/recipeService');

const mockIngredients = ['chicken', 'rice', 'onion'];
const mockMealPreferences = {
  mealType: 'dinner',
  dietaryPreferences: ['gluten-free'],
  cookingTime: '30 minutes',
  servingSize: 4
};

const mockRecipe = {
  id: 1,
  title: 'Chicken Rice Bowl',
  description: 'A delicious and healthy chicken rice bowl',
  totalTime: 30,
  servings: 4,
  difficulty: 'Easy',
  ingredients: [
    { name: 'chicken breast', amount: '2', unit: 'pieces' },
    { name: 'rice', amount: '1', unit: 'cup' },
    { name: 'onion', amount: '1', unit: 'medium' }
  ],
  instructions: [
    { step: 1, instruction: 'Cook the rice according to package instructions.' },
    { step: 2, instruction: 'Season and cook the chicken breast.' },
    { step: 3, instruction: 'Sauté the onion until golden.' },
    { step: 4, instruction: 'Combine all ingredients and serve.' }
  ],
  nutrition: {
    calories: 450,
    protein: 35,
    carbs: 45,
    fat: 12,
    fiber: 3
  },
  tags: ['healthy', 'gluten-free', 'high-protein'],
  aiInsights: {
    tips: ['Let the chicken rest before slicing for better texture'],
    healthBenefits: ['High in protein', 'Good source of complex carbs'],
    variations: ['Add vegetables for extra nutrients']
  },
  alternatives: [
    {
      title: 'Vegetarian Rice Bowl',
      description: 'Replace chicken with tofu',
      modifications: ['Use firm tofu instead of chicken', 'Add extra vegetables']
    }
  ]
};

describe('RecipeGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders initial state with generate button', () => {
    render(
      <RecipeGenerator 
        ingredients={mockIngredients} 
        mealPreferences={mockMealPreferences} 
      />
    );

    expect(screen.getByText('Ready to Cook?')).toBeInTheDocument();
    expect(screen.getByText('🚀 Generate My Recipe!')).toBeInTheDocument();
    expect(screen.getByText('Your Ingredients:')).toBeInTheDocument();
    expect(screen.getByText('Your Preferences:')).toBeInTheDocument();
  });

  test('shows disabled state when no ingredients provided', () => {
    render(
      <RecipeGenerator 
        ingredients={[]} 
        mealPreferences={mockMealPreferences} 
      />
    );

    const generateButton = screen.getByText('Add Ingredients First');
    expect(generateButton).toBeDisabled();
    expect(screen.getByText('Please add at least one ingredient to get started')).toBeInTheDocument();
  });

  test('displays ingredients and preferences summary', () => {
    render(
      <RecipeGenerator 
        ingredients={mockIngredients} 
        mealPreferences={mockMealPreferences} 
      />
    );

    // Check ingredients
    mockIngredients.forEach(ingredient => {
      expect(screen.getByText(ingredient)).toBeInTheDocument();
    });

    // Check preferences
    expect(screen.getByText('dinner')).toBeInTheDocument();
    expect(screen.getByText('30 minutes')).toBeInTheDocument();
    expect(screen.getByText('gluten-free')).toBeInTheDocument();
  });

  test('shows loading state when generating recipe', async () => {
    recipeService.generateRecipe.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockRecipe), 100))
    );

    render(
      <RecipeGenerator 
        ingredients={mockIngredients} 
        mealPreferences={mockMealPreferences} 
      />
    );

    const generateButton = screen.getByText('🚀 Generate My Recipe!');
    fireEvent.click(generateButton);

    expect(screen.getByText('Creating your perfect recipe...')).toBeInTheDocument();
    expect(screen.getByText('Our AI chef is crafting the perfect recipe for you...')).toBeInTheDocument();
  });

  test('displays recipe after successful generation', async () => {
    recipeService.generateRecipe.mockResolvedValue(mockRecipe);

    render(
      <RecipeGenerator 
        ingredients={mockIngredients} 
        mealPreferences={mockMealPreferences} 
      />
    );

    const generateButton = screen.getByText('🚀 Generate My Recipe!');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Chicken Rice Bowl')).toBeInTheDocument();
    });

    expect(screen.getByText('← Start Over')).toBeInTheDocument();
    expect(screen.getByText('🎲 Generate Another Recipe')).toBeInTheDocument();
  });

  test('shows error state when recipe generation fails', async () => {
    recipeService.generateRecipe.mockRejectedValue(new Error('API Error'));

    render(
      <RecipeGenerator 
        ingredients={mockIngredients} 
        mealPreferences={mockMealPreferences} 
      />
    );

    const generateButton = screen.getByText('🚀 Generate My Recipe!');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });

    expect(screen.getByText('Failed to generate recipe. Please try again.')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  test('handles "Go Back" button in error state', async () => {
    recipeService.generateRecipe.mockRejectedValue(new Error('API Error'));

    render(
      <RecipeGenerator 
        ingredients={mockIngredients} 
        mealPreferences={mockMealPreferences} 
      />
    );

    // Generate error
    const generateButton = screen.getByText('🚀 Generate My Recipe!');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });

    // Click Go Back
    const goBackButton = screen.getByText('Go Back');
    fireEvent.click(goBackButton);

    expect(screen.getByText('Ready to Cook?')).toBeInTheDocument();
  });

  test('handles "Try Again" button in error state', async () => {
    recipeService.generateRecipe
      .mockRejectedValueOnce(new Error('API Error'))
      .mockResolvedValueOnce(mockRecipe);

    render(
      <RecipeGenerator 
        ingredients={mockIngredients} 
        mealPreferences={mockMealPreferences} 
      />
    );

    // Generate error
    const generateButton = screen.getByText('🚀 Generate My Recipe!');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    });

    // Click Try Again
    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);

    await waitFor(() => {
      expect(screen.getByText('Chicken Rice Bowl')).toBeInTheDocument();
    });
  });

  test('handles "Start Over" button after recipe generation', async () => {
    recipeService.generateRecipe.mockResolvedValue(mockRecipe);

    render(
      <RecipeGenerator 
        ingredients={mockIngredients} 
        mealPreferences={mockMealPreferences} 
      />
    );

    // Generate recipe
    const generateButton = screen.getByText('🚀 Generate My Recipe!');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Chicken Rice Bowl')).toBeInTheDocument();
    });

    // Click Start Over
    const startOverButton = screen.getByText('← Start Over');
    fireEvent.click(startOverButton);

    expect(screen.getByText('Ready to Cook?')).toBeInTheDocument();
  });

  test('handles "Generate Another Recipe" button', async () => {
    recipeService.generateRecipe.mockResolvedValue(mockRecipe);

    render(
      <RecipeGenerator 
        ingredients={mockIngredients} 
        mealPreferences={mockMealPreferences} 
      />
    );

    // Generate first recipe
    const generateButton = screen.getByText('🚀 Generate My Recipe!');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Chicken Rice Bowl')).toBeInTheDocument();
    });

    // Click Generate Another Recipe
    const generateAnotherButton = screen.getByText('🎲 Generate Another Recipe');
    fireEvent.click(generateAnotherButton);

    // Should show loading state again
    expect(screen.getByText('Creating your perfect recipe...')).toBeInTheDocument();
  });

  test('shows error when trying to generate without ingredients', async () => {
    render(
      <RecipeGenerator 
        ingredients={[]} 
        mealPreferences={mockMealPreferences} 
      />
    );

    // The button should be disabled, but let's test the logic
    const component = screen.getByText('Add Ingredients First').closest('button');
    expect(component).toBeDisabled();
  });

  test('calls generateRecipe with correct parameters', async () => {
    recipeService.generateRecipe.mockResolvedValue(mockRecipe);

    render(
      <RecipeGenerator 
        ingredients={mockIngredients} 
        mealPreferences={mockMealPreferences} 
      />
    );

    const generateButton = screen.getByText('🚀 Generate My Recipe!');
    fireEvent.click(generateButton);

    expect(recipeService.generateRecipe).toHaveBeenCalledWith(
      mockIngredients,
      mockMealPreferences
    );
  });
}); 