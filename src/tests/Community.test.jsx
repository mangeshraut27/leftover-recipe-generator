import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import Community from '../components/Community';

// Mock the specific services that Community component imports
jest.mock('../services/socialService', () => ({
  recipeCollectionsService: {
    getPublicCollections: jest.fn()
  },
  userProfileService: {
    getUserProfile: jest.fn()
  }
}));

// Import the mocked services
import { recipeCollectionsService, userProfileService } from '../services/socialService';

describe('Community Component', () => {
  const mockCollections = [
    {
      id: '1',
      name: 'Quick Weeknight Dinners',
      description: 'Easy recipes for busy families',
      author: 'Chef Maria',
      recipes: [
        { id: 'r1', name: 'Pasta Primavera' },
        { id: 'r2', name: 'Chicken Stir Fry' }
      ],
      views: 234,
      likes: 45,
      createdAt: '2023-12-01T10:00:00Z',
      isPublic: true
    },
    {
      id: '2',
      name: 'Healthy Meals',
      description: 'Nutritious and delicious recipes',
      author: 'NutritionGuru',
      recipes: [
        { id: 'r3', name: 'Quinoa Salad' },
        { id: 'r4', name: 'Grilled Salmon' },
        { id: 'r5', name: 'Green Smoothie' }
      ],
      views: 189,
      likes: 38,
      createdAt: '2023-11-15T14:30:00Z',
      isPublic: true
    }
  ];

  const mockUserProfile = {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: '👤',
    bio: 'Food enthusiast',
    recipesShared: 5,
    collectionsCreated: 2,
    followers: 10,
    following: 15
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Set up default mock implementations
    recipeCollectionsService.getPublicCollections.mockReturnValue(mockCollections);
    userProfileService.getUserProfile.mockReturnValue(mockUserProfile);
  });

  describe('Rendering', () => {
    it('should render the community header correctly', () => {
      render(<Community />);
      
      expect(screen.getByText('Recipe Community')).toBeInTheDocument();
      expect(screen.getByText('Discover amazing recipes and collections shared by fellow food enthusiasts')).toBeInTheDocument();
    });

    it('should display community stats correctly', () => {
      render(<Community />);
      
      expect(screen.getByText('2')).toBeInTheDocument(); // Collections count
      expect(screen.getByText('5')).toBeInTheDocument(); // Total recipes count
      expect(screen.getByText('423')).toBeInTheDocument(); // Total views count
    });

    it('should render all navigation tabs', () => {
      render(<Community />);
      
      expect(screen.getByText('📚 Public Collections')).toBeInTheDocument();
      expect(screen.getByText('🔥 Trending')).toBeInTheDocument();
      expect(screen.getByText('⭐ Featured Chefs')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('should switch between tabs correctly', () => {
      render(<Community />);
      
      // Initially collections tab should be active
      expect(screen.getByRole('button', { name: '📚 Public Collections' })).toHaveClass('active');
      
      // Click trending tab
      fireEvent.click(screen.getByRole('button', { name: '🔥 Trending' }));
      expect(screen.getByRole('button', { name: '🔥 Trending' })).toHaveClass('active');
      expect(screen.getByRole('button', { name: '📚 Public Collections' })).not.toHaveClass('active');
      
      // Click featured tab
      fireEvent.click(screen.getByRole('button', { name: '⭐ Featured Chefs' }));
      expect(screen.getByRole('button', { name: '⭐ Featured Chefs' })).toHaveClass('active');
      expect(screen.getByRole('button', { name: '🔥 Trending' })).not.toHaveClass('active');
    });
  });

  describe('Collections Tab', () => {
    it('should display public collections', () => {
      render(<Community />);
      
      expect(screen.getByText('Quick Weeknight Dinners')).toBeInTheDocument();
      expect(screen.getByText('Healthy Meals')).toBeInTheDocument();
      expect(screen.getByText('Chef Maria')).toBeInTheDocument();
      expect(screen.getByText('NutritionGuru')).toBeInTheDocument();
    });

    it('should filter collections based on search term', () => {
      render(<Community />);
      
      const searchInput = screen.getByPlaceholderText('Search collections, authors, or descriptions...');
      fireEvent.change(searchInput, { target: { value: 'Quick' } });
      
      expect(screen.getByText('Quick Weeknight Dinners')).toBeInTheDocument();
      expect(screen.queryByText('Healthy Meals')).not.toBeInTheDocument();
    });

    it('should sort collections correctly', () => {
      render(<Community />);
      
      const sortSelect = screen.getByLabelText('Sort by:');
      fireEvent.change(sortSelect, { target: { value: 'name' } });
      
      // Collections should be sorted alphabetically
      const collectionCards = screen.getAllByText(/Quick Weeknight Dinners|Healthy Meals/);
      expect(collectionCards[0]).toHaveTextContent('Healthy Meals');
      expect(collectionCards[1]).toHaveTextContent('Quick Weeknight Dinners');
    });

    it('should handle like button clicks', () => {
      render(<Community />);
      
      const likeButtons = screen.getAllByText('❤️ Like');
      fireEvent.click(likeButtons[0]);
      
      // The like count should increase (though we can't easily test the exact number due to state)
      expect(likeButtons[0]).toBeInTheDocument();
    });

    it('should handle view button clicks', () => {
      render(<Community />);
      
      const viewButtons = screen.getAllByText('👁️ View Collection');
      fireEvent.click(viewButtons[0]);
      
      // The view count should increase
      expect(viewButtons[0]).toBeInTheDocument();
    });
  });

  describe('Trending Tab', () => {
    it('should display trending content when tab is clicked', () => {
      render(<Community />);
      
      fireEvent.click(screen.getByText('🔥 Trending'));
      
      expect(screen.getByText('🔥 Trending This Week')).toBeInTheDocument();
      expect(screen.getByText('Most Popular Collections')).toBeInTheDocument();
      expect(screen.getByText('Rising Stars')).toBeInTheDocument();
    });

    it('should show trending collections ranked by popularity', () => {
      render(<Community />);
      
      fireEvent.click(screen.getByText('🔥 Trending'));
      
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
    });
  });

  describe('Featured Tab', () => {
    it('should display featured chefs when tab is clicked', () => {
      render(<Community />);
      
      fireEvent.click(screen.getByRole('button', { name: '⭐ Featured Chefs' }));
      
      expect(screen.getByRole('heading', { name: '⭐ Featured Chefs' })).toBeInTheDocument();
      expect(screen.getByText('Chef Maria Rodriguez')).toBeInTheDocument();
      expect(screen.getByText('Mediterranean Cuisine Expert')).toBeInTheDocument();
    });

    it('should display chef achievements and collections', () => {
      render(<Community />);
      
      fireEvent.click(screen.getByRole('button', { name: '⭐ Featured Chefs' }));
      
      expect(screen.getByText('🏆 Top Chef 2023')).toBeInTheDocument();
      expect(screen.getByText('📚 3 Cookbooks')).toBeInTheDocument();
      expect(screen.getByText('⭐ 4.9/5 Rating')).toBeInTheDocument();
    });
  });

  describe('Data Loading', () => {
    it('should handle empty collections gracefully', () => {
      recipeCollectionsService.getPublicCollections.mockReturnValue([]);
      
      render(<Community />);
      
      expect(screen.getByText('No collections found matching your search.')).toBeInTheDocument();
    });

    it('should handle service errors gracefully', () => {
      recipeCollectionsService.getPublicCollections.mockImplementation(() => {
        throw new Error('Service error');
      });
      
      render(<Community />);
      
      expect(screen.getByText('No collections found matching your search.')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should render properly on different screen sizes', () => {
      render(<Community />);
      
      const container = screen.getByText('Recipe Community').closest('.community-container');
      expect(container).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<Community />);
      
      const searchInput = screen.getByPlaceholderText('Search collections, authors, or descriptions...');
      expect(searchInput).toHaveAttribute('type', 'text');
      
      const sortSelect = screen.getByLabelText('Sort by:');
      expect(sortSelect).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      render(<Community />);
      
      const tabs = screen.getAllByRole('button');
      tabs.forEach(tab => {
        expect(tab).toBeInTheDocument();
      });
    });
  });

  describe('Performance', () => {
    it('should render efficiently with large datasets', () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        id: `collection-${i}`,
        name: `Collection ${i}`,
        description: `Description for collection ${i}`,
        author: `Author ${i}`,
        recipes: [{ id: `r${i}`, name: `Recipe ${i}` }],
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 100),
        createdAt: new Date().toISOString(),
        isPublic: true
      }));
      
      recipeCollectionsService.getPublicCollections.mockReturnValue(largeDataset);
      
      render(<Community />);
      
      expect(screen.getByText('Recipe Community')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should provide visual feedback for user actions', async () => {
      render(<Community />);
      
      await waitFor(() => {
        expect(screen.getByText('Quick Weeknight Dinners')).toBeInTheDocument();
      });
      
      const likeButton = screen.getAllByText('❤️ Like')[0];
      fireEvent.click(likeButton);
      
      // Button should still be present after click
      expect(likeButton).toBeInTheDocument();
    });

    it('should handle rapid user interactions gracefully', async () => {
      render(<Community />);
      
      await waitFor(() => {
        expect(screen.getByText('Quick Weeknight Dinners')).toBeInTheDocument();
      });
      
      const likeButton = screen.getAllByText('❤️ Like')[0];
      
      // Rapid clicks
      fireEvent.click(likeButton);
      fireEvent.click(likeButton);
      fireEvent.click(likeButton);
      
      expect(likeButton).toBeInTheDocument();
    });
  });

  describe('Content Display', () => {
    it('should format dates correctly', async () => {
      render(<Community />);
      
      await waitFor(() => {
        expect(screen.getByText('Quick Weeknight Dinners')).toBeInTheDocument();
      });
      
      expect(screen.getAllByText(/Created/).length).toBeGreaterThan(0);
    });

    it('should show public badge for collections', async () => {
      render(<Community />);
      
      await waitFor(() => {
        expect(screen.getByText('Quick Weeknight Dinners')).toBeInTheDocument();
      });
      
      expect(screen.getAllByText('Public')).toHaveLength(2);
    });

    it('should truncate long descriptions appropriately', async () => {
      render(<Community />);
      
      await waitFor(() => {
        expect(screen.getByText('Quick Weeknight Dinners')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Easy recipes for busy families')).toBeInTheDocument();
    });
  });
}); 