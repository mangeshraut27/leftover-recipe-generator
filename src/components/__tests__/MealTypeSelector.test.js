import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MealTypeSelector from '../MealTypeSelector';

describe('MealTypeSelector', () => {
  const mockOnSelectionChange = jest.fn();

  beforeEach(() => {
    mockOnSelectionChange.mockClear();
  });

  test('renders all meal type options', () => {
    render(<MealTypeSelector onSelectionChange={mockOnSelectionChange} />);
    
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('Dinner')).toBeInTheDocument();
    expect(screen.getByText('Snack')).toBeInTheDocument();
    expect(screen.getByText('Dessert')).toBeInTheDocument();
  });

  test('renders all dietary preference options', () => {
    render(<MealTypeSelector onSelectionChange={mockOnSelectionChange} />);
    
    expect(screen.getByText('Vegetarian')).toBeInTheDocument();
    expect(screen.getByText('Vegan')).toBeInTheDocument();
    expect(screen.getByText('Gluten-Free')).toBeInTheDocument();
    expect(screen.getByText('Dairy-Free')).toBeInTheDocument();
    expect(screen.getByText('Low-Carb')).toBeInTheDocument();
    expect(screen.getByText('Keto')).toBeInTheDocument();
  });

  test('renders all cooking time options', () => {
    render(<MealTypeSelector onSelectionChange={mockOnSelectionChange} />);
    
    expect(screen.getByText('15 minutes or less')).toBeInTheDocument();
    expect(screen.getByText('30 minutes or less')).toBeInTheDocument();
    expect(screen.getByText('1 hour or less')).toBeInTheDocument();
    expect(screen.getByText('2 hours or less')).toBeInTheDocument();
    expect(screen.getByText('Any time')).toBeInTheDocument();
  });

  test('selects meal type and calls onSelectionChange', () => {
    render(<MealTypeSelector onSelectionChange={mockOnSelectionChange} />);
    
    const breakfastButton = screen.getByText('Breakfast');
    fireEvent.click(breakfastButton);
    
    expect(mockOnSelectionChange).toHaveBeenCalledWith({
      mealType: 'breakfast',
      dietaryPreferences: [],
      cookingTime: '',
      servingSize: 4
    });
  });

  test('toggles dietary preferences correctly', () => {
    render(<MealTypeSelector onSelectionChange={mockOnSelectionChange} />);
    
    const vegetarianButton = screen.getByText('Vegetarian');
    
    // First click - add preference
    fireEvent.click(vegetarianButton);
    expect(mockOnSelectionChange).toHaveBeenCalledWith({
      mealType: '',
      dietaryPreferences: ['vegetarian'],
      cookingTime: '',
      servingSize: 4
    });
    
    // Second click - remove preference
    fireEvent.click(vegetarianButton);
    expect(mockOnSelectionChange).toHaveBeenCalledWith({
      mealType: '',
      dietaryPreferences: [],
      cookingTime: '',
      servingSize: 4
    });
  });

  test('selects cooking time and calls onSelectionChange', () => {
    render(<MealTypeSelector onSelectionChange={mockOnSelectionChange} />);
    
    const quickTimeButton = screen.getByText('15 minutes or less');
    fireEvent.click(quickTimeButton);
    
    expect(mockOnSelectionChange).toHaveBeenCalledWith({
      mealType: '',
      dietaryPreferences: [],
      cookingTime: '15',
      servingSize: 4
    });
  });

  test('adjusts serving size with + and - buttons', () => {
    render(<MealTypeSelector onSelectionChange={mockOnSelectionChange} />);
    
    const plusButton = screen.getByText('+');
    const minusButton = screen.getByText('-');
    
    // Increase serving size
    fireEvent.click(plusButton);
    expect(mockOnSelectionChange).toHaveBeenCalledWith({
      mealType: '',
      dietaryPreferences: [],
      cookingTime: '',
      servingSize: 5
    });
    
    // Decrease serving size
    fireEvent.click(minusButton);
    fireEvent.click(minusButton);
    expect(mockOnSelectionChange).toHaveBeenCalledWith({
      mealType: '',
      dietaryPreferences: [],
      cookingTime: '',
      servingSize: 3
    });
  });

  test('does not allow serving size below 1', () => {
    render(<MealTypeSelector onSelectionChange={mockOnSelectionChange} />);
    
    const minusButton = screen.getByText('-');
    
    // Try to go below 1 (starting at 4, so click 4 times)
    fireEvent.click(minusButton);
    fireEvent.click(minusButton);
    fireEvent.click(minusButton);
    fireEvent.click(minusButton);
    fireEvent.click(minusButton); // This should not go below 1
    
    expect(mockOnSelectionChange).toHaveBeenLastCalledWith({
      mealType: '',
      dietaryPreferences: [],
      cookingTime: '',
      servingSize: 1
    });
  });

  test('does not allow serving size above 12', () => {
    render(<MealTypeSelector onSelectionChange={mockOnSelectionChange} />);
    
    const plusButton = screen.getByText('+');
    
    // Try to go above 12 (starting at 4, so need 9 clicks to reach 12, then 1 more)
    for (let i = 0; i < 10; i++) {
      fireEvent.click(plusButton);
    }
    
    expect(mockOnSelectionChange).toHaveBeenLastCalledWith({
      mealType: '',
      dietaryPreferences: [],
      cookingTime: '',
      servingSize: 12
    });
  });

  test('shows selection summary when meal type is selected', () => {
    render(<MealTypeSelector onSelectionChange={mockOnSelectionChange} />);
    
    // Initially no summary should be visible
    expect(screen.queryByText('Your Selection:')).not.toBeInTheDocument();
    
    // Select a meal type
    const dinnerButton = screen.getByText('Dinner');
    fireEvent.click(dinnerButton);
    
    // Summary should now be visible
    expect(screen.getByText('Your Selection:')).toBeInTheDocument();
    expect(screen.getByText('Dinner')).toBeInTheDocument();
  });

  test('updates selection summary with multiple preferences', () => {
    render(<MealTypeSelector onSelectionChange={mockOnSelectionChange} />);
    
    // Select meal type
    fireEvent.click(screen.getByText('Lunch'));
    
    // Select dietary preferences
    fireEvent.click(screen.getByText('Vegetarian'));
    fireEvent.click(screen.getByText('Gluten-Free'));
    
    // Select cooking time
    fireEvent.click(screen.getByText('30 minutes or less'));
    
    // Check summary shows all selections - use more flexible text matching
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText(/Vegetarian, Gluten-Free/)).toBeInTheDocument();
    expect(screen.getByText('30 minutes or less')).toBeInTheDocument();
  });

  test('displays correct serving text (singular vs plural)', () => {
    render(<MealTypeSelector onSelectionChange={mockOnSelectionChange} />);
    
    // Default should show "servings" (plural) - check for the number and text separately
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText(/servings/)).toBeInTheDocument();
    
    // Change to 1 serving
    const minusButton = screen.getByText('-');
    fireEvent.click(minusButton);
    fireEvent.click(minusButton);
    fireEvent.click(minusButton);
    
    // Should now show "serving" (singular)
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/serving$/)).toBeInTheDocument(); // Use regex to match "serving" but not "servings"
  });
}); 