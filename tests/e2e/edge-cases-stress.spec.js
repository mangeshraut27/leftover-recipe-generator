import { test, expect } from '@playwright/test';

test.describe('Edge Cases & Stress Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should handle very long ingredient names @edge-case', async ({ page }) => {
    const longIngredient = 'supercalifragilisticexpialidocious-extra-long-ingredient-name-that-exceeds-normal-length';
    
    const ingredientInput = page.getByTestId('ingredient-input');
    await ingredientInput.fill(longIngredient);
    await page.keyboard.press('Enter');
    
    // Verify ingredient is added and displayed properly
    await expect(page.getByText(longIngredient)).toBeVisible();
    
    // Verify UI doesn't break with long text
    const ingredientTag = page.locator('[data-testid="ingredient-tag"]').first();
    const boundingBox = await ingredientTag.boundingBox();
    expect(boundingBox.width).toBeLessThan(500); // Should not exceed reasonable width
  });

  test('should handle special characters in ingredient names @edge-case', async ({ page }) => {
    const specialIngredients = [
      'jalapeño peppers',
      'crème fraîche',
      'café au lait',
      'piña colada mix',
      'naïve herbs',
      'résumé sauce'
    ];
    
    const ingredientInput = page.getByTestId('ingredient-input');
    
    for (const ingredient of specialIngredients) {
      await ingredientInput.fill(ingredient);
      await page.keyboard.press('Enter');
      await expect(page.getByText(ingredient)).toBeVisible();
    }
    
    // Verify all special character ingredients are preserved
    for (const ingredient of specialIngredients) {
      await expect(page.getByText(ingredient)).toBeVisible();
    }
  });

  test('should handle maximum number of ingredients @edge-case', async ({ page }) => {
    const ingredientInput = page.getByTestId('ingredient-input');
    const maxIngredients = 50; // Test with large number
    
    // Add maximum number of ingredients
    for (let i = 1; i <= maxIngredients; i++) {
      await ingredientInput.fill(`ingredient${i}`);
      await page.keyboard.press('Enter');
    }
    
    // Verify all ingredients are added
    await expect(page.getByText('ingredient1')).toBeVisible();
    await expect(page.getByText(`ingredient${maxIngredients}`)).toBeVisible();
    
    // Try to add one more and verify behavior
    await ingredientInput.fill('extraIngredient');
    await page.keyboard.press('Enter');
    
    // Should either add it or show a limit message
    const extraIngredient = page.getByText('extraIngredient');
    const limitMessage = page.getByText('Maximum ingredients reached');
    
    const extraVisible = await extraIngredient.isVisible();
    const limitVisible = await limitMessage.isVisible();
    
    expect(extraVisible || limitVisible).toBe(true);
  });

  test('should handle rapid clicking on buttons @stress-test', async ({ page }) => {
    // Add an ingredient first
    await page.getByTestId('ingredient-input').fill('chicken');
    await page.keyboard.press('Enter');
    
    // Rapidly click meal type buttons
    const dinnerButton = page.getByText('Dinner');
    const lunchButton = page.getByText('Lunch');
    
    // Click rapidly between buttons
    for (let i = 0; i < 10; i++) {
      await dinnerButton.click();
      await lunchButton.click();
    }
    
    // Verify final state is consistent
    await expect(lunchButton).toHaveClass(/bg-blue-500/);
    await expect(dinnerButton).not.toHaveClass(/bg-blue-500/);
    
    // Rapidly click dietary preferences
    const vegetarianButton = page.getByText('Vegetarian');
    const veganButton = page.getByText('Vegan');
    
    for (let i = 0; i < 5; i++) {
      await vegetarianButton.click();
      await veganButton.click();
    }
    
    // Verify UI remains responsive
    await expect(page.getByTestId('ingredient-input')).toBeVisible();
  });

  test('should handle browser navigation (back/forward) @edge-case', async ({ page }) => {
    // Add ingredients and select preferences
    await page.getByTestId('ingredient-input').fill('pasta');
    await page.keyboard.press('Enter');
    await page.getByText('Lunch').click();
    
    // Navigate to a different page (if app has multiple pages)
    await page.getByText('📚 View Saved Recipes').click();
    
    // Use browser back button
    await page.goBack();
    
    // Verify state is preserved
    await expect(page.getByText('pasta')).toBeVisible();
    await expect(page.getByText('Lunch')).toHaveClass(/bg-blue-500/);
    
    // Use browser forward button
    await page.goForward();
    
    // Verify navigation works
    await expect(page.getByText('Recipe History')).toBeVisible();
  });

  test('should handle clearing browser data during session @edge-case', async ({ page }) => {
    // Add ingredients and generate recipe
    await page.getByTestId('ingredient-input').fill('chicken');
    await page.keyboard.press('Enter');
    await page.getByText('Dinner').click();
    await page.getByText('🚀 Generate My Recipe!').click();
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
    
    // Save the recipe
    await page.getByText('💾 Save Recipe').click();
    
    // Clear localStorage programmatically
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify app handles cleared data gracefully
    await expect(page.getByTestId('ingredient-input')).toBeVisible();
    
    // Check saved recipes
    await page.getByText('📚 View Saved Recipes').click();
    await expect(page.getByText('No saved recipes yet')).toBeVisible();
  });

  test('should handle network interruption during recipe generation @edge-case', async ({ page }) => {
    // Add ingredients
    await page.getByTestId('ingredient-input').fill('fish');
    await page.keyboard.press('Enter');
    await page.getByText('Dinner').click();
    
    // Simulate network failure during API call
    await page.route('https://api.openai.com/v1/chat/completions', route => {
      route.abort('failed');
    });
    
    // Try to generate recipe
    await page.getByText('🚀 Generate My Recipe!').click();
    
    // Should fall back to local generation
    await expect(page.getByText('Generating your recipe...')).toBeVisible();
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
    
    // Verify recipe is still generated (fallback)
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
  });

  test('should handle concurrent recipe generations @stress-test', async ({ page, context }) => {
    // Open multiple tabs
    const page2 = await context.newPage();
    const page3 = await context.newPage();
    
    // Navigate all pages to the app
    await page2.goto('/');
    await page3.goto('/');
    await page2.waitForLoadState('networkidle');
    await page3.waitForLoadState('networkidle');
    
    // Start recipe generation on all pages simultaneously
    const pages = [page, page2, page3];
    const ingredients = ['chicken', 'pasta', 'vegetables'];
    
    for (let i = 0; i < pages.length; i++) {
      const currentPage = pages[i];
      await currentPage.getByTestId('ingredient-input').fill(ingredients[i]);
      await currentPage.keyboard.press('Enter');
      await currentPage.getByText('Dinner').click();
    }
    
    // Generate recipes simultaneously
    await Promise.all(pages.map(p => p.getByText('🚀 Generate My Recipe!').click()));
    
    // Wait for all generations to complete
    await Promise.all(pages.map(p => 
      expect(p.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 })
    ));
    
    // Verify all recipes were generated successfully
    for (const currentPage of pages) {
      await expect(currentPage.getByRole('heading', { level: 2 })).toBeVisible();
    }
    
    // Clean up
    await page2.close();
    await page3.close();
  });

  test('should handle extremely fast typing in ingredient input @stress-test', async ({ page }) => {
    const ingredientInput = page.getByTestId('ingredient-input');
    
    // Type very quickly
    const fastText = 'quicktypingtest';
    await ingredientInput.focus();
    
    // Type each character with minimal delay
    for (const char of fastText) {
      await page.keyboard.type(char, { delay: 10 });
    }
    
    await page.keyboard.press('Enter');
    
    // Verify input was handled correctly
    await expect(page.getByText(fastText)).toBeVisible();
  });

  test('should handle window resize during recipe generation @edge-case', async ({ page }) => {
    // Start recipe generation
    await page.getByTestId('ingredient-input').fill('rice');
    await page.keyboard.press('Enter');
    await page.getByText('Lunch').click();
    await page.getByText('🚀 Generate My Recipe!').click();
    
    // Resize window during generation
    await page.setViewportSize({ width: 400, height: 600 }); // Mobile size
    await page.waitForTimeout(1000);
    
    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop size
    await page.waitForTimeout(1000);
    
    await page.setViewportSize({ width: 768, height: 1024 }); // Tablet size
    
    // Wait for generation to complete
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
    
    // Verify recipe displays correctly at current size
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
    
    // Test responsive behavior
    await page.setViewportSize({ width: 320, height: 568 }); // Small mobile
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
  });

  test('should handle invalid or corrupted localStorage data @edge-case', async ({ page }) => {
    // Set invalid localStorage data
    await page.evaluate(() => {
      localStorage.setItem('savedRecipes', 'invalid-json-data');
      localStorage.setItem('recipeHistory', '{broken json}');
      localStorage.setItem('userPreferences', 'null');
    });
    
    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Verify app handles corrupted data gracefully
    await expect(page.getByTestId('ingredient-input')).toBeVisible();
    
    // Try to use the app normally
    await page.getByTestId('ingredient-input').fill('test');
    await page.keyboard.press('Enter');
    await expect(page.getByText('test')).toBeVisible();
    
    // Check saved recipes doesn't crash
    await page.getByText('📚 View Saved Recipes').click();
    await expect(page.getByText('No saved recipes yet')).toBeVisible();
  });

  test('should handle memory pressure with large recipe history @stress-test', async ({ page }) => {
    // Generate and save many recipes to test memory usage
    const recipeCount = 20;
    
    for (let i = 1; i <= recipeCount; i++) {
      await page.getByTestId('ingredient-input').fill(`ingredient${i}`);
      await page.keyboard.press('Enter');
      await page.getByText('Dinner').click();
      await page.getByText('🚀 Generate My Recipe!').click();
      await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
      await page.getByText('💾 Save Recipe').click();
      await expect(page.getByText('Recipe saved!')).toBeVisible();
      
      if (i < recipeCount) {
        await page.getByText('🔄 Generate Another Recipe').click();
      }
    }
    
    // Navigate to saved recipes
    await page.getByText('📚 View Saved Recipes').click();
    
    // Verify all recipes are listed and app remains responsive
    await expect(page.getByText('ingredient1')).toBeVisible();
    await expect(page.getByText(`ingredient${recipeCount}`)).toBeVisible();
    
    // Test scrolling through large list
    await page.mouse.wheel(0, 1000);
    await page.mouse.wheel(0, -1000);
    
    // Verify app is still responsive
    await expect(page.getByText('Recipe History')).toBeVisible();
  });
}); 