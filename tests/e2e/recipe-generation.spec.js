import { test, expect } from '@playwright/test';

test.describe('Recipe Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should complete full recipe generation flow @smoke', async ({ page }) => {
    // Step 1: Add ingredients
    const ingredientInput = page.getByTestId('ingredient-input');
    await expect(ingredientInput).toBeVisible();
    
    // Add multiple ingredients
    await ingredientInput.fill('chicken');
    await page.keyboard.press('Enter');
    await expect(page.getByText('chicken')).toBeVisible();
    
    await ingredientInput.fill('rice');
    await page.keyboard.press('Enter');
    await expect(page.getByText('rice')).toBeVisible();
    
    await ingredientInput.fill('broccoli');
    await page.keyboard.press('Enter');
    await expect(page.getByText('broccoli')).toBeVisible();

    // Step 2: Select meal type
    await page.getByText('Dinner').click();
    await expect(page.getByText('Dinner')).toHaveClass(/bg-blue-500/);

    // Step 3: Select dietary preferences
    await page.getByText('Gluten-Free').click();
    await expect(page.getByText('Gluten-Free')).toHaveClass(/bg-green-500/);

    // Step 4: Set cooking time
    await page.getByText('30 minutes or less').click();

    // Step 5: Adjust serving size
    const servingPlus = page.getByRole('button', { name: '+' });
    await servingPlus.click();
    await expect(page.getByText('5')).toBeVisible();

    // Step 6: Generate recipe
    const generateButton = page.getByText('🚀 Generate My Recipe!');
    await expect(generateButton).toBeEnabled();
    await generateButton.click();

    // Step 7: Wait for recipe generation
    await expect(page.getByText('Generating your recipe...')).toBeVisible();
    
    // Wait for recipe to be generated (with timeout)
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
    
    // Step 8: Verify recipe is displayed
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(page.getByText('Ingredients')).toBeVisible();
    await expect(page.getByText('Instructions')).toBeVisible();
    await expect(page.getByText('Nutrition')).toBeVisible();
  });

  test('should show autocomplete suggestions', async ({ page }) => {
    const ingredientInput = page.getByTestId('ingredient-input');
    
    // Type partial ingredient name
    await ingredientInput.fill('tom');
    
    // Wait for suggestions to appear
    await expect(page.getByText('tomatoes')).toBeVisible({ timeout: 5000 });
    
    // Click on suggestion
    await page.getByText('tomatoes').click();
    
    // Verify ingredient was added
    await expect(page.getByText('tomatoes')).toBeVisible();
  });

  test('should prevent duplicate ingredients', async ({ page }) => {
    const ingredientInput = page.getByTestId('ingredient-input');
    
    // Add ingredient twice
    await ingredientInput.fill('chicken');
    await page.keyboard.press('Enter');
    
    await ingredientInput.fill('chicken');
    await page.keyboard.press('Enter');
    
    // Should only have one chicken ingredient
    const chickenElements = page.getByText('chicken');
    await expect(chickenElements).toHaveCount(1);
  });

  test('should remove ingredients when X is clicked', async ({ page }) => {
    const ingredientInput = page.getByTestId('ingredient-input');
    
    // Add ingredient
    await ingredientInput.fill('chicken');
    await page.keyboard.press('Enter');
    await expect(page.getByText('chicken')).toBeVisible();
    
    // Remove ingredient
    await page.getByRole('button', { name: '×' }).click();
    await expect(page.getByText('chicken')).toBeHidden();
  });

  test('should disable generate button when no ingredients', async ({ page }) => {
    const generateButton = page.getByText('Add Ingredients First');
    await expect(generateButton).toBeDisabled();
    await expect(page.getByText('Please add at least one ingredient to get started')).toBeVisible();
  });

  test('should update selection summary in real-time', async ({ page }) => {
    // Add ingredient
    const ingredientInput = page.getByTestId('ingredient-input');
    await ingredientInput.fill('chicken');
    await page.keyboard.press('Enter');
    
    // Select meal type
    await page.getByText('Lunch').click();
    
    // Check summary updates
    await expect(page.getByText('lunch')).toBeVisible();
    await expect(page.getByText('chicken')).toBeVisible();
    
    // Select dietary preference
    await page.getByText('Vegetarian').click();
    await expect(page.getByText('vegetarian')).toBeVisible();
  });

  test('should handle recipe generation error gracefully', async ({ page }) => {
    // Mock API failure by intercepting requests
    await page.route('https://api.openai.com/v1/chat/completions', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'API Error' })
      });
    });

    // Add ingredients and generate
    const ingredientInput = page.getByTestId('ingredient-input');
    await ingredientInput.fill('chicken');
    await page.keyboard.press('Enter');
    
    await page.getByText('Dinner').click();
    await page.getByText('🚀 Generate My Recipe!').click();
    
    // Should fall back to local generation
    await expect(page.getByText('Generating your recipe...')).toBeVisible();
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
    
    // Should still show a recipe (fallback)
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
  });

  test('should save and display recipe in history', async ({ page }) => {
    // Generate a recipe first
    const ingredientInput = page.getByTestId('ingredient-input');
    await ingredientInput.fill('pasta');
    await page.keyboard.press('Enter');
    
    await page.getByText('Dinner').click();
    await page.getByText('🚀 Generate My Recipe!').click();
    
    // Wait for recipe generation
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
    
    // Save the recipe
    await page.getByText('💾 Save Recipe').click();
    await expect(page.getByText('Recipe saved!')).toBeVisible();
    
    // Navigate to saved recipes
    await page.getByText('📚 View Saved Recipes').click();
    
    // Verify recipe appears in history
    await expect(page.getByText('Recipe History')).toBeVisible();
    await expect(page.getByText('pasta')).toBeVisible();
  });
}); 