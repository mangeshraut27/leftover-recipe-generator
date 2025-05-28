import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IngredientInput from '../IngredientInput';

describe('IngredientInput', () => {
  test('should render input box', () => {
    render(<IngredientInput />);
    
    const inputElement = screen.getByTestId('ingredient-input');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('placeholder', 'Type an ingredient...');
  });

  test('should suggest autocomplete options as user types', async () => {
    const user = userEvent.setup();
    render(<IngredientInput />);
    
    const inputElement = screen.getByTestId('ingredient-input');
    
    // Type 'tom' to trigger autocomplete
    await user.type(inputElement, 'tom');
    
    // Should show suggestions containing 'tomatoes'
    await waitFor(() => {
      expect(screen.getByText('tomatoes')).toBeInTheDocument();
    });
  });

  test('should allow selecting multiple ingredients', async () => {
    const user = userEvent.setup();
    const mockOnIngredientsChange = jest.fn();
    render(<IngredientInput onIngredientsChange={mockOnIngredientsChange} />);
    
    const inputElement = screen.getByTestId('ingredient-input');
    
    // Add first ingredient by typing and pressing Enter
    await user.type(inputElement, 'tomatoes');
    await user.keyboard('{Enter}');
    
    // Add second ingredient by clicking suggestion
    await user.type(inputElement, 'oni');
    await waitFor(() => {
      expect(screen.getByText('onions')).toBeInTheDocument();
    });
    await user.click(screen.getByText('onions'));
    
    // Check that both ingredients are selected
    expect(screen.getByTestId('selected-ingredient-0')).toHaveTextContent('tomatoes');
    expect(screen.getByTestId('selected-ingredient-1')).toHaveTextContent('onions');
    
    // Check that callback was called with both ingredients
    expect(mockOnIngredientsChange).toHaveBeenLastCalledWith(['tomatoes', 'onions']);
  });

  test('should remove ingredients when clicking remove button', async () => {
    const user = userEvent.setup();
    const mockOnIngredientsChange = jest.fn();
    render(<IngredientInput onIngredientsChange={mockOnIngredientsChange} />);
    
    const inputElement = screen.getByTestId('ingredient-input');
    
    // Add an ingredient
    await user.type(inputElement, 'tomatoes');
    await user.keyboard('{Enter}');
    
    // Verify ingredient is added
    expect(screen.getByTestId('selected-ingredient-0')).toHaveTextContent('tomatoes');
    
    // Remove the ingredient
    await user.click(screen.getByTestId('remove-ingredient-0'));
    
    // Verify ingredient is removed
    expect(screen.queryByTestId('selected-ingredient-0')).not.toBeInTheDocument();
    expect(mockOnIngredientsChange).toHaveBeenLastCalledWith([]);
  });

  test('should not add duplicate ingredients', async () => {
    const user = userEvent.setup();
    const mockOnIngredientsChange = jest.fn();
    render(<IngredientInput onIngredientsChange={mockOnIngredientsChange} />);
    
    const inputElement = screen.getByTestId('ingredient-input');
    
    // Add same ingredient twice
    await user.type(inputElement, 'tomatoes');
    await user.keyboard('{Enter}');
    await user.type(inputElement, 'tomatoes');
    await user.keyboard('{Enter}');
    
    // Should only have one ingredient
    expect(screen.getAllByText(/tomatoes/)).toHaveLength(1);
    expect(mockOnIngredientsChange).toHaveBeenLastCalledWith(['tomatoes']);
  });

  test('should clear input after adding ingredient', async () => {
    const user = userEvent.setup();
    render(<IngredientInput />);
    
    const inputElement = screen.getByTestId('ingredient-input');
    
    // Add an ingredient
    await user.type(inputElement, 'tomatoes');
    await user.keyboard('{Enter}');
    
    // Input should be cleared
    expect(inputElement).toHaveValue('');
  });

  test('should hide suggestions when input is empty', async () => {
    const user = userEvent.setup();
    render(<IngredientInput />);
    
    const inputElement = screen.getByTestId('ingredient-input');
    
    // Type to show suggestions
    await user.type(inputElement, 'tom');
    await waitFor(() => {
      expect(screen.getByText('tomatoes')).toBeInTheDocument();
    });
    
    // Clear input
    await user.clear(inputElement);
    
    // Suggestions should be hidden
    expect(screen.queryByText('tomatoes')).not.toBeInTheDocument();
  });
}); 