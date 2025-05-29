import { test, expect } from '@playwright/test';

test.describe('Recipe Display & Interaction', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Generate a recipe first
    await page.getByTestId('ingredient-input').fill('chicken');
    await page.keyboard.press('Enter');
    await page.getByTestId('ingredient-input').fill('rice');
    await page.keyboard.press('Enter');
    
    await page.getByText('Dinner').click();
    await page.getByText('🚀 Generate My Recipe!').click();
    
    // Wait for recipe generation
    await expect(page.getByText('Generating your recipe...')).toBeVisible();
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
  });

  test('should navigate between recipe tabs @regression', async ({ page }) => {
    // Test Ingredients tab
    await page.getByText('Ingredients').click();
    await expect(page.getByText('Ingredients')).toHaveClass(/active|selected/);
    
    // Verify ingredients list with checkboxes
    await expect(page.getByRole('checkbox').first()).toBeVisible();
    await expect(page.getByText('chicken')).toBeVisible();
    await expect(page.getByText('rice')).toBeVisible();
    
    // Test Instructions tab
    await page.getByText('Instructions').click();
    await expect(page.getByText('Instructions')).toHaveClass(/active|selected/);
    
    // Verify step-by-step instructions
    await expect(page.getByText('Step 1')).toBeVisible();
    
    // Test Nutrition tab
    await page.getByText('Nutrition').click();
    await expect(page.getByText('Nutrition')).toHaveClass(/active|selected/);
    
    // Verify nutrition information
    await expect(page.getByText('Calories')).toBeVisible();
    await expect(page.getByText('Protein')).toBeVisible();
    
    // Test AI Insights tab
    await page.getByText('AI Insights').click();
    await expect(page.getByText('AI Insights')).toHaveClass(/active|selected/);
    
    // Verify AI insights content
    await expect(page.getByText('Tips')).toBeVisible();
  });

  test('should allow checking/unchecking ingredients @regression', async ({ page }) => {
    // Navigate to Ingredients tab
    await page.getByText('Ingredients').click();
    
    // Find first ingredient checkbox
    const firstCheckbox = page.getByRole('checkbox').first();
    const firstIngredient = page.locator('[data-testid="ingredient-item"]').first();
    
    // Check the ingredient
    await firstCheckbox.check();
    await expect(firstCheckbox).toBeChecked();
    
    // Verify visual feedback (strikethrough or color change)
    await expect(firstIngredient).toHaveClass(/checked|completed|strikethrough/);
    
    // Uncheck the ingredient
    await firstCheckbox.uncheck();
    await expect(firstCheckbox).not.toBeChecked();
    
    // Verify visual state reverts
    await expect(firstIngredient).not.toHaveClass(/checked|completed|strikethrough/);
  });

  test('should display step-by-step instructions with interaction @regression', async ({ page }) => {
    // Navigate to Instructions tab
    await page.getByText('Instructions').click();
    
    // Verify multiple steps are present
    await expect(page.getByText('Step 1')).toBeVisible();
    await expect(page.getByText('Step 2')).toBeVisible();
    
    // Test step interaction (if clickable)
    const firstStep = page.locator('[data-testid="instruction-step"]').first();
    if (await firstStep.isVisible()) {
      await firstStep.click();
      // Verify any interactive behavior (highlighting, completion marking, etc.)
    }
    
    // Verify instruction content is meaningful
    const instructionText = await page.locator('[data-testid="instruction-text"]').first().textContent();
    expect(instructionText).toBeTruthy();
    expect(instructionText.length).toBeGreaterThan(10);
  });

  test('should display comprehensive nutrition information @regression', async ({ page }) => {
    // Navigate to Nutrition tab
    await page.getByText('Nutrition').click();
    
    // Verify all nutrition components are present
    await expect(page.getByText('Calories')).toBeVisible();
    await expect(page.getByText('Protein')).toBeVisible();
    await expect(page.getByText('Carbohydrates')).toBeVisible();
    await expect(page.getByText('Fat')).toBeVisible();
    await expect(page.getByText('Fiber')).toBeVisible();
    
    // Verify nutrition values are reasonable numbers
    const caloriesText = await page.locator('[data-testid="calories-value"]').textContent();
    const calories = parseInt(caloriesText.replace(/\D/g, ''));
    expect(calories).toBeGreaterThan(0);
    expect(calories).toBeLessThan(2000); // Reasonable upper limit
    
    // Verify protein value
    const proteinText = await page.locator('[data-testid="protein-value"]').textContent();
    const protein = parseInt(proteinText.replace(/\D/g, ''));
    expect(protein).toBeGreaterThan(0);
    expect(protein).toBeLessThan(200);
  });

  test('should display relevant AI insights and alternatives @regression', async ({ page }) => {
    // Navigate to AI Insights tab
    await page.getByText('AI Insights').click();
    
    // Verify AI insights sections
    await expect(page.getByText('Chef Tips')).toBeVisible();
    await expect(page.getByText('Health Benefits')).toBeVisible();
    await expect(page.getByText('Recipe Variations')).toBeVisible();
    
    // Verify content quality
    const tipsContent = await page.locator('[data-testid="chef-tips"]').textContent();
    expect(tipsContent).toBeTruthy();
    expect(tipsContent.length).toBeGreaterThan(20);
    
    // Check for recipe alternatives
    await expect(page.getByText('Alternative Recipes')).toBeVisible();
    const alternativeTitle = await page.locator('[data-testid="alternative-title"]').first().textContent();
    expect(alternativeTitle).toBeTruthy();
    
    // Verify alternatives contain ingredient references
    expect(alternativeTitle.toLowerCase()).toMatch(/chicken|rice|dinner/);
  });

  test('should handle recipe content validation @regression', async ({ page }) => {
    // Verify recipe title includes main ingredients
    const recipeTitle = await page.getByRole('heading', { level: 2 }).textContent();
    expect(recipeTitle.toLowerCase()).toMatch(/chicken|rice/);
    
    // Navigate to Ingredients tab and verify all user ingredients are included
    await page.getByText('Ingredients').click();
    await expect(page.getByText('chicken')).toBeVisible();
    await expect(page.getByText('rice')).toBeVisible();
    
    // Verify complementary ingredients are added
    const ingredientsList = await page.locator('[data-testid="ingredients-list"]').textContent();
    expect(ingredientsList.toLowerCase()).toMatch(/onion|garlic|salt|pepper|oil/);
    
    // Navigate to Instructions and verify logical flow
    await page.getByText('Instructions').click();
    const instructions = await page.locator('[data-testid="instructions-list"]').textContent();
    expect(instructions.toLowerCase()).toMatch(/cook|heat|add|season/);
  });

  test('should maintain tab state during interaction @regression', async ({ page }) => {
    // Switch between tabs multiple times
    await page.getByText('Ingredients').click();
    await page.getByText('Instructions').click();
    await page.getByText('Nutrition').click();
    await page.getByText('AI Insights').click();
    await page.getByText('Ingredients').click();
    
    // Verify final tab is active
    await expect(page.getByText('Ingredients')).toHaveClass(/active|selected/);
    
    // Verify content is still displayed correctly
    await expect(page.getByRole('checkbox').first()).toBeVisible();
  });
}); 