import { test, expect } from '@playwright/test';

test.describe('Recipe History & Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Clear any existing saved recipes for clean test state
    await page.evaluate(() => {
      localStorage.removeItem('savedRecipes');
      localStorage.removeItem('recipeHistory');
    });
  });

  test('should save recipe and display in history @regression', async ({ page }) => {
    // Generate a recipe
    await page.getByTestId('ingredient-input').fill('pasta');
    await page.keyboard.press('Enter');
    await page.getByTestId('ingredient-input').fill('tomatoes');
    await page.keyboard.press('Enter');
    
    await page.getByText('Lunch').click();
    await page.getByText('🚀 Generate My Recipe!').click();
    
    // Wait for recipe generation
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
    
    // Save the recipe
    const saveButton = page.getByText('💾 Save Recipe');
    await expect(saveButton).toBeVisible();
    await saveButton.click();
    
    // Verify success message
    await expect(page.getByText('Recipe saved!')).toBeVisible();
    
    // Navigate to saved recipes
    await page.getByText('📚 View Saved Recipes').click();
    
    // Verify recipe appears in history
    await expect(page.getByText('Recipe History')).toBeVisible();
    await expect(page.getByText('pasta')).toBeVisible();
    await expect(page.getByText('tomatoes')).toBeVisible();
  });

  test('should display multiple saved recipes with metadata @regression', async ({ page }) => {
    // Generate and save first recipe
    await page.getByTestId('ingredient-input').fill('chicken');
    await page.keyboard.press('Enter');
    await page.getByText('Dinner').click();
    await page.getByText('🚀 Generate My Recipe!').click();
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
    await page.getByText('💾 Save Recipe').click();
    await expect(page.getByText('Recipe saved!')).toBeVisible();
    
    // Generate and save second recipe
    await page.getByText('🔄 Generate Another Recipe').click();
    await page.getByTestId('ingredient-input').fill('eggs');
    await page.keyboard.press('Enter');
    await page.getByText('Breakfast').click();
    await page.getByText('🚀 Generate My Recipe!').click();
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
    await page.getByText('💾 Save Recipe').click();
    await expect(page.getByText('Recipe saved!')).toBeVisible();
    
    // Navigate to saved recipes
    await page.getByText('📚 View Saved Recipes').click();
    
    // Verify both recipes are listed
    await expect(page.getByText('chicken')).toBeVisible();
    await expect(page.getByText('eggs')).toBeVisible();
    
    // Verify metadata is displayed (date, view count, etc.)
    await expect(page.locator('[data-testid="recipe-date"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="recipe-views"]').first()).toBeVisible();
  });

  test('should search and filter saved recipes @regression', async ({ page }) => {
    // Generate and save multiple recipes with different names
    const recipes = [
      { ingredient: 'chicken', meal: 'Dinner' },
      { ingredient: 'pasta', meal: 'Lunch' },
      { ingredient: 'eggs', meal: 'Breakfast' }
    ];
    
    for (const recipe of recipes) {
      await page.getByTestId('ingredient-input').fill(recipe.ingredient);
      await page.keyboard.press('Enter');
      await page.getByText(recipe.meal).click();
      await page.getByText('🚀 Generate My Recipe!').click();
      await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
      await page.getByText('💾 Save Recipe').click();
      await expect(page.getByText('Recipe saved!')).toBeVisible();
      
      if (recipe !== recipes[recipes.length - 1]) {
        await page.getByText('🔄 Generate Another Recipe').click();
      }
    }
    
    // Navigate to saved recipes
    await page.getByText('📚 View Saved Recipes').click();
    
    // Test search functionality
    const searchBox = page.getByTestId('recipe-search');
    await expect(searchBox).toBeVisible();
    
    // Search for specific recipe
    await searchBox.fill('chicken');
    await expect(page.getByText('chicken')).toBeVisible();
    await expect(page.getByText('pasta')).toBeHidden();
    await expect(page.getByText('eggs')).toBeHidden();
    
    // Clear search and verify all recipes return
    await searchBox.clear();
    await expect(page.getByText('chicken')).toBeVisible();
    await expect(page.getByText('pasta')).toBeVisible();
    await expect(page.getByText('eggs')).toBeVisible();
    
    // Test filter by meal type if available
    const mealFilter = page.getByTestId('meal-filter');
    if (await mealFilter.isVisible()) {
      await mealFilter.selectOption('Breakfast');
      await expect(page.getByText('eggs')).toBeVisible();
      await expect(page.getByText('chicken')).toBeHidden();
    }
  });

  test('should delete saved recipes @regression', async ({ page }) => {
    // Generate and save a recipe
    await page.getByTestId('ingredient-input').fill('fish');
    await page.keyboard.press('Enter');
    await page.getByText('Dinner').click();
    await page.getByText('🚀 Generate My Recipe!').click();
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
    await page.getByText('💾 Save Recipe').click();
    await expect(page.getByText('Recipe saved!')).toBeVisible();
    
    // Navigate to saved recipes
    await page.getByText('📚 View Saved Recipes').click();
    
    // Verify recipe is present
    await expect(page.getByText('fish')).toBeVisible();
    
    // Find and click delete button
    const deleteButton = page.locator('[data-testid="delete-recipe"]').first();
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    
    // Confirm deletion if confirmation dialog appears
    const confirmButton = page.getByText('Confirm Delete');
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    
    // Verify recipe is removed
    await expect(page.getByText('fish')).toBeHidden();
    
    // Verify deletion success message
    await expect(page.getByText('Recipe deleted')).toBeVisible();
  });

  test('should persist saved recipes across browser sessions @regression', async ({ page, context }) => {
    // Generate and save a recipe
    await page.getByTestId('ingredient-input').fill('beef');
    await page.keyboard.press('Enter');
    await page.getByText('Dinner').click();
    await page.getByText('🚀 Generate My Recipe!').click();
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
    await page.getByText('💾 Save Recipe').click();
    await expect(page.getByText('Recipe saved!')).toBeVisible();
    
    // Close the page
    await page.close();
    
    // Create a new page (simulating browser restart)
    const newPage = await context.newPage();
    await newPage.goto('/');
    await newPage.waitForLoadState('networkidle');
    
    // Navigate to saved recipes
    await newPage.getByText('📚 View Saved Recipes').click();
    
    // Verify recipe persists
    await expect(newPage.getByText('beef')).toBeVisible();
    await expect(newPage.getByText('Recipe History')).toBeVisible();
  });

  test('should handle empty recipe history state @regression', async ({ page }) => {
    // Navigate to saved recipes without saving any
    await page.getByText('📚 View Saved Recipes').click();
    
    // Verify empty state message
    await expect(page.getByText('No saved recipes yet')).toBeVisible();
    await expect(page.getByText('Generate and save your first recipe')).toBeVisible();
    
    // Verify call-to-action button
    const generateButton = page.getByText('Generate Recipe');
    await expect(generateButton).toBeVisible();
    await generateButton.click();
    
    // Verify navigation back to main page
    await expect(page.getByTestId('ingredient-input')).toBeVisible();
  });

  test('should display recipe view count and update on access @regression', async ({ page }) => {
    // Generate and save a recipe
    await page.getByTestId('ingredient-input').fill('salmon');
    await page.keyboard.press('Enter');
    await page.getByText('Dinner').click();
    await page.getByText('🚀 Generate My Recipe!').click();
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
    await page.getByText('💾 Save Recipe').click();
    
    // Navigate to saved recipes
    await page.getByText('📚 View Saved Recipes').click();
    
    // Check initial view count
    const viewCount = page.locator('[data-testid="recipe-views"]').first();
    await expect(viewCount).toBeVisible();
    const initialCount = await viewCount.textContent();
    
    // Click on recipe to view it
    await page.getByText('salmon').click();
    
    // Go back to saved recipes
    await page.getByText('📚 View Saved Recipes').click();
    
    // Verify view count increased
    const updatedCount = await viewCount.textContent();
    expect(parseInt(updatedCount)).toBeGreaterThan(parseInt(initialCount));
  });

  test('should handle recipe categories and organization @regression', async ({ page }) => {
    // Generate recipes for different meal types
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];
    
    for (const mealType of mealTypes) {
      await page.getByTestId('ingredient-input').fill(`${mealType.toLowerCase()}-ingredient`);
      await page.keyboard.press('Enter');
      await page.getByText(mealType).click();
      await page.getByText('🚀 Generate My Recipe!').click();
      await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
      await page.getByText('💾 Save Recipe').click();
      await expect(page.getByText('Recipe saved!')).toBeVisible();
      
      if (mealType !== mealTypes[mealTypes.length - 1]) {
        await page.getByText('🔄 Generate Another Recipe').click();
      }
    }
    
    // Navigate to saved recipes
    await page.getByText('📚 View Saved Recipes').click();
    
    // Verify recipes are organized by category if feature exists
    const categoryTabs = page.locator('[data-testid="category-tab"]');
    if (await categoryTabs.count() > 0) {
      // Test category filtering
      await page.getByText('Breakfast').click();
      await expect(page.getByText('breakfast-ingredient')).toBeVisible();
      
      await page.getByText('Dinner').click();
      await expect(page.getByText('dinner-ingredient')).toBeVisible();
    }
  });

  test('should export and share recipes @regression', async ({ page }) => {
    // Generate and save a recipe
    await page.getByTestId('ingredient-input').fill('vegetables');
    await page.keyboard.press('Enter');
    await page.getByText('Lunch').click();
    await page.getByText('🚀 Generate My Recipe!').click();
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
    await page.getByText('💾 Save Recipe').click();
    
    // Navigate to saved recipes
    await page.getByText('📚 View Saved Recipes').click();
    
    // Test export functionality if available
    const exportButton = page.getByText('Export Recipe');
    if (await exportButton.isVisible()) {
      await exportButton.click();
      
      // Verify export options
      await expect(page.getByText('Export as PDF')).toBeVisible();
      await expect(page.getByText('Share via Email')).toBeVisible();
    }
    
    // Test share functionality if available
    const shareButton = page.getByText('Share Recipe');
    if (await shareButton.isVisible()) {
      await shareButton.click();
      
      // Verify share options
      await expect(page.getByText('Copy Link')).toBeVisible();
      await expect(page.getByText('Social Media')).toBeVisible();
    }
  });
}); 