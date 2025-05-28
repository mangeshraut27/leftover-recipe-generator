import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SavedRecipes from '../SavedRecipes';
import * as storageService from '../../services/storageService';

// Mock the storage service
jest.mock('../../services/storageService');

const mockRecipe = {
  id: 1,
  title: 'Test Recipe',
  description: 'A delicious test recipe',
  totalTime: 30,
  servings: 4,
  difficulty: 'Easy',
  ingredients: [
    { name: 'ingredient1', amount: '1', unit: 'cup' },
    { name: 'ingredient2', amount: '2', unit: 'tbsp' }
  ],
  instructions: [
    { step: 1, instruction: 'First step' },
    { step: 2, instruction: 'Second step' }
  ],
  nutrition: {
    calories: 300,
    protein: 15,
    carbs: 30,
    fat: 10,
    fiber: 5
  },
  tags: ['healthy', 'quick'],
  generatedAt: '2024-01-01T12:00:00Z',
  savedAt: '2024-01-01T12:00:00Z',
  viewCount: 3,
  category: 'dinner'
};

const mockStats = {
  totalRecipesGenerated: 10,
  totalSavedRecipes: 5,
  totalCategories: 3,
  mostViewedRecipe: mockRecipe,
  recentActivity: [mockRecipe],
  storageUsed: 1024
};

describe('SavedRecipes', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup default mock implementations
    storageService.recipeHistoryService.getHistory.mockReturnValue([mockRecipe]);
    storageService.savedRecipesService.getSavedRecipes.mockReturnValue([mockRecipe]);
    storageService.savedRecipesService.getCategories.mockReturnValue(['dinner', 'lunch']);
    storageService.savedRecipesService.isRecipeSaved.mockReturnValue(false);
    storageService.storageStatsService.getStats.mockReturnValue(mockStats);
    storageService.recipeExportService.copyToClipboard.mockResolvedValue(true);
    storageService.recipeExportService.shareRecipe.mockResolvedValue(true);
  });

  test('renders with default history tab', () => {
    render(<SavedRecipes />);

    expect(screen.getByText('My Recipe Collection')).toBeInTheDocument();
    expect(screen.getByText('Recipe History')).toBeInTheDocument();
    expect(screen.getByText('Saved Favorites')).toBeInTheDocument();
    expect(screen.getByText('Statistics')).toBeInTheDocument();
  });

  test('displays recipe history correctly', () => {
    render(<SavedRecipes />);

    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    expect(screen.getByText('A delicious test recipe')).toBeInTheDocument();
    expect(screen.getByText('⏱️ 30 min')).toBeInTheDocument();
    expect(screen.getByText('👥 4')).toBeInTheDocument();
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  test('switches to saved recipes tab', () => {
    render(<SavedRecipes />);

    const savedTab = screen.getByText('Saved Favorites');
    fireEvent.click(savedTab);

    // Should still show the same recipe but in saved context
    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
  });

  test('switches to statistics tab', () => {
    render(<SavedRecipes />);

    const statsTab = screen.getByText('Statistics');
    fireEvent.click(statsTab);

    expect(screen.getByText('Usage Statistics')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // totalRecipesGenerated
    expect(screen.getByText('5')).toBeInTheDocument(); // totalSavedRecipes
    expect(screen.getByText('Most Viewed Recipe')).toBeInTheDocument();
  });

  test('handles recipe search', () => {
    const recipes = [
      { ...mockRecipe, id: 1, title: 'Chicken Recipe' },
      { ...mockRecipe, id: 2, title: 'Beef Recipe' }
    ];
    storageService.recipeHistoryService.getHistory.mockReturnValue(recipes);

    render(<SavedRecipes />);

    const searchInput = screen.getByPlaceholderText('Search recipes...');
    fireEvent.change(searchInput, { target: { value: 'chicken' } });

    // Should filter recipes
    expect(screen.getByText('Chicken Recipe')).toBeInTheDocument();
    expect(screen.queryByText('Beef Recipe')).not.toBeInTheDocument();
  });

  test('handles recipe sorting', () => {
    render(<SavedRecipes />);

    const sortSelect = screen.getByDisplayValue('Most Recent');
    fireEvent.change(sortSelect, { target: { value: 'alphabetical' } });

    // Verify sort option is selected
    expect(sortSelect.value).toBe('alphabetical');
  });

  test('handles category filtering for saved recipes', () => {
    render(<SavedRecipes />);

    // Switch to saved recipes tab
    const savedTab = screen.getByText('Saved Favorites');
    fireEvent.click(savedTab);

    // Should show category filter
    const categorySelect = screen.getByDisplayValue('All Categories');
    expect(categorySelect).toBeInTheDocument();

    fireEvent.change(categorySelect, { target: { value: 'dinner' } });
    expect(categorySelect.value).toBe('dinner');
  });

  test('handles recipe click to view details', () => {
    render(<SavedRecipes />);

    const recipeCard = screen.getByText('Test Recipe');
    fireEvent.click(recipeCard);

    // Should show recipe details view
    expect(screen.getByText('Back to History')).toBeInTheDocument();
  });

  test('handles save recipe from history', async () => {
    render(<SavedRecipes />);

    const saveButton = screen.getByText('⭐ Save');
    fireEvent.click(saveButton);

    expect(storageService.savedRecipesService.saveRecipe).toHaveBeenCalledWith(mockRecipe);
  });

  test('handles unsave recipe from saved recipes', () => {
    render(<SavedRecipes />);

    // Switch to saved recipes tab
    const savedTab = screen.getByText('Saved Favorites');
    fireEvent.click(savedTab);

    const deleteButton = screen.getByText('🗑️');
    fireEvent.click(deleteButton);

    expect(storageService.savedRecipesService.unsaveRecipe).toHaveBeenCalledWith(mockRecipe.id);
  });

  test('handles delete from history', () => {
    render(<SavedRecipes />);

    const deleteButton = screen.getByText('🗑️');
    fireEvent.click(deleteButton);

    expect(storageService.recipeHistoryService.removeFromHistory).toHaveBeenCalledWith(mockRecipe.id);
  });

  test('handles clear history', () => {
    // Mock window.confirm
    window.confirm = jest.fn(() => true);

    render(<SavedRecipes />);

    const clearButton = screen.getByText('Clear History');
    fireEvent.click(clearButton);

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to clear all recipe history? This action cannot be undone.'
    );
    expect(storageService.recipeHistoryService.clearHistory).toHaveBeenCalled();
  });

  test('handles export recipe', async () => {
    render(<SavedRecipes />);

    const exportButton = screen.getByText('📋');
    fireEvent.click(exportButton);

    await waitFor(() => {
      expect(storageService.recipeExportService.copyToClipboard).toHaveBeenCalledWith(mockRecipe);
    });
  });

  test('handles share recipe', async () => {
    render(<SavedRecipes />);

    const shareButton = screen.getByText('📤');
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(storageService.recipeExportService.shareRecipe).toHaveBeenCalledWith(mockRecipe);
    });
  });

  test('shows empty state for no history', () => {
    storageService.recipeHistoryService.getHistory.mockReturnValue([]);

    render(<SavedRecipes />);

    expect(screen.getByText('No Recipe History')).toBeInTheDocument();
    expect(screen.getByText('Start generating recipes to see them appear here!')).toBeInTheDocument();
  });

  test('shows empty state for no saved recipes', () => {
    storageService.savedRecipesService.getSavedRecipes.mockReturnValue([]);

    render(<SavedRecipes />);

    // Switch to saved recipes tab
    const savedTab = screen.getByText('Saved Favorites');
    fireEvent.click(savedTab);

    expect(screen.getByText('No Saved Recipes')).toBeInTheDocument();
    expect(screen.getByText('Save your favorite recipes to access them quickly later.')).toBeInTheDocument();
  });

  test('displays recipe tags correctly', () => {
    render(<SavedRecipes />);

    expect(screen.getByText('#healthy')).toBeInTheDocument();
    expect(screen.getByText('#quick')).toBeInTheDocument();
  });

  test('displays recipe metadata correctly', () => {
    render(<SavedRecipes />);

    expect(screen.getByText(/Generated/)).toBeInTheDocument();
    expect(screen.getByText(/Viewed 3 times/)).toBeInTheDocument();
  });

  test('handles recipe view from statistics', () => {
    render(<SavedRecipes />);

    // Switch to statistics tab
    const statsTab = screen.getByText('Statistics');
    fireEvent.click(statsTab);

    const viewRecipeButton = screen.getByText('View Recipe');
    fireEvent.click(viewRecipeButton);

    // Should show recipe details - the back button shows "Back to Saved Recipes" not "Back to Statistics"
    expect(screen.getByText('Back to Saved Recipes')).toBeInTheDocument();
  });

  test('handles clear all data from statistics', () => {
    window.confirm = jest.fn(() => true);

    render(<SavedRecipes />);

    // Switch to statistics tab
    const statsTab = screen.getByText('Statistics');
    fireEvent.click(statsTab);

    const clearAllButton = screen.getByText('Clear All Data');
    fireEvent.click(clearAllButton);

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to clear all data? This action cannot be undone.'
    );
    expect(storageService.storageStatsService.clearAllData).toHaveBeenCalled();
  });

  test('displays recipe count correctly', () => {
    const recipes = [mockRecipe, { ...mockRecipe, id: 2 }];
    storageService.recipeHistoryService.getHistory.mockReturnValue(recipes);

    render(<SavedRecipes />);

    expect(screen.getByText('2 recipes found')).toBeInTheDocument();
  });

  test('handles recipe with no tags gracefully', () => {
    const recipeWithoutTags = { ...mockRecipe, tags: [] };
    storageService.recipeHistoryService.getHistory.mockReturnValue([recipeWithoutTags]);

    render(<SavedRecipes />);

    expect(screen.getByText('Test Recipe')).toBeInTheDocument();
    // Should not crash when no tags are present
  });

  test('shows correct difficulty styling', () => {
    render(<SavedRecipes />);

    const difficultyElement = screen.getByText('Easy');
    expect(difficultyElement).toHaveClass('text-green-600', 'bg-green-100');
  });

  test('handles recent activity clicks', () => {
    render(<SavedRecipes />);

    // Switch to statistics tab
    const statsTab = screen.getByText('Statistics');
    fireEvent.click(statsTab);

    // Click on recent activity item - use getAllByText to handle multiple elements
    const activityItems = screen.getAllByText('Test Recipe');
    // Click on the one in the recent activity section (should be the second one)
    fireEvent.click(activityItems[1]);

    // Should show recipe details
    expect(screen.getByText('Back to Saved Recipes')).toBeInTheDocument();
  });
}); 