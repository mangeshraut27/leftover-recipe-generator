import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load the application within acceptable time @performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    const loadTime = Date.now() - startTime;
    console.log(`Page load time: ${loadTime}ms`);
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Verify critical elements are visible
    await expect(page.getByTestId('ingredient-input')).toBeVisible();
    await expect(page.getByText('Breakfast')).toBeVisible();
  });

  test('should generate recipes within acceptable time @performance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Add ingredients
    const ingredientInput = page.getByTestId('ingredient-input');
    await ingredientInput.fill('chicken');
    await page.keyboard.press('Enter');
    
    await page.getByText('Dinner').click();
    
    // Measure recipe generation time
    const startTime = Date.now();
    await page.getByText('🚀 Generate My Recipe!').click();
    
    await expect(page.getByText('Generating your recipe...')).toBeVisible();
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
    
    const generationTime = Date.now() - startTime;
    console.log(`Recipe generation time: ${generationTime}ms`);
    
    // Should generate within 10 seconds (including API calls)
    expect(generationTime).toBeLessThan(10000);
    
    // Verify recipe is displayed
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
  });

  test('should handle multiple rapid interactions @performance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const startTime = Date.now();
    
    // Rapidly add multiple ingredients
    const ingredientInput = page.getByTestId('ingredient-input');
    const ingredients = ['chicken', 'rice', 'broccoli', 'onion', 'garlic'];
    
    for (const ingredient of ingredients) {
      await ingredientInput.fill(ingredient);
      await page.keyboard.press('Enter');
    }
    
    // Rapidly click meal type buttons
    await page.getByText('Breakfast').click();
    await page.getByText('Lunch').click();
    await page.getByText('Dinner').click();
    
    // Rapidly click dietary preferences
    await page.getByText('Vegetarian').click();
    await page.getByText('Gluten-Free').click();
    await page.getByText('Dairy-Free').click();
    
    const interactionTime = Date.now() - startTime;
    console.log(`Multiple interactions time: ${interactionTime}ms`);
    
    // Should handle rapid interactions smoothly
    expect(interactionTime).toBeLessThan(2000);
    
    // Verify final state is correct
    await expect(page.getByText('Dinner')).toHaveClass(/bg-blue-500/);
    await expect(page.getByText('dairy-free')).toBeVisible();
  });

  test('should maintain performance with large ingredient lists @performance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const startTime = Date.now();
    
    // Add many ingredients
    const ingredientInput = page.getByTestId('ingredient-input');
    const manyIngredients = [
      'chicken', 'beef', 'pork', 'fish', 'eggs', 'milk', 'cheese', 'yogurt',
      'rice', 'pasta', 'bread', 'quinoa', 'oats', 'flour', 'noodles',
      'tomatoes', 'onions', 'garlic', 'carrots', 'potatoes', 'bell peppers',
      'spinach', 'broccoli', 'mushrooms', 'zucchini', 'cucumber', 'lettuce'
    ];
    
    for (const ingredient of manyIngredients) {
      await ingredientInput.fill(ingredient);
      await page.keyboard.press('Enter');
    }
    
    const addTime = Date.now() - startTime;
    console.log(`Time to add ${manyIngredients.length} ingredients: ${addTime}ms`);
    
    // Should handle large lists efficiently
    expect(addTime).toBeLessThan(5000);
    
    // Verify all ingredients are displayed
    for (const ingredient of manyIngredients.slice(0, 5)) {
      await expect(page.getByText(ingredient)).toBeVisible();
    }
  });

  test('should have efficient DOM updates @performance', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Measure DOM query performance
    const startTime = Date.now();
    
    // Perform multiple DOM queries
    for (let i = 0; i < 100; i++) {
      await page.getByTestId('ingredient-input').isVisible();
      await page.getByText('Breakfast').isVisible();
      await page.getByText('Lunch').isVisible();
    }
    
    const queryTime = Date.now() - startTime;
    console.log(`100 DOM queries time: ${queryTime}ms`);
    
    // Should handle DOM queries efficiently
    expect(queryTime).toBeLessThan(1000);
  });

  test('should handle browser resource usage efficiently @performance', async ({ page, context }) => {
    // Monitor memory usage
    const startMemory = await page.evaluate(() => performance.memory?.usedJSHeapSize || 0);
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Perform typical user actions
    const ingredientInput = page.getByTestId('ingredient-input');
    await ingredientInput.fill('chicken');
    await page.keyboard.press('Enter');
    
    await page.getByText('Dinner').click();
    await page.getByText('🚀 Generate My Recipe!').click();
    
    await expect(page.getByText('Generating your recipe...')).toBeVisible();
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
    
    const endMemory = await page.evaluate(() => performance.memory?.usedJSHeapSize || 0);
    
    if (startMemory && endMemory) {
      const memoryIncrease = endMemory - startMemory;
      console.log(`Memory increase: ${memoryIncrease} bytes`);
      
      // Should not have excessive memory usage (less than 50MB increase)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    }
  });

  test('should handle network latency gracefully @performance', async ({ page }) => {
    // Simulate slow network
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100); // Add 100ms delay
    });

    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    console.log(`Load time with network delay: ${loadTime}ms`);
    
    // Should still be usable with network delays
    await expect(page.getByTestId('ingredient-input')).toBeVisible();
    
    // Test that interactions still work
    const ingredientInput = page.getByTestId('ingredient-input');
    await ingredientInput.fill('chicken');
    await page.keyboard.press('Enter');
    await expect(page.getByText('chicken')).toBeVisible();
  });
}); 