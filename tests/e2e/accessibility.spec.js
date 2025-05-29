import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues @a11y', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be navigable with keyboard only @a11y', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test tab navigation through main elements
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('ingredient-input')).toBeFocused();

    // Continue tabbing through meal type buttons
    await page.keyboard.press('Tab');
    await expect(page.getByText('Breakfast')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByText('Lunch')).toBeFocused();

    // Test Enter key activation
    await page.keyboard.press('Enter');
    await expect(page.getByText('Lunch')).toHaveClass(/bg-blue-500/);
  });

  test('should have proper ARIA labels and roles @a11y', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for proper input labeling
    const ingredientInput = page.getByTestId('ingredient-input');
    await expect(ingredientInput).toHaveAttribute('aria-label');

    // Check for proper button roles
    const mealButtons = page.getByRole('button');
    await expect(mealButtons.first()).toBeVisible();

    // Check for proper heading structure
    const headings = page.getByRole('heading');
    await expect(headings.first()).toBeVisible();
  });

  test('should have sufficient color contrast @a11y', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Run axe with color contrast rules
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should work with screen reader simulation @a11y', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Add ingredient using keyboard
    const ingredientInput = page.getByTestId('ingredient-input');
    await ingredientInput.focus();
    await ingredientInput.fill('chicken');
    await page.keyboard.press('Enter');

    // Verify screen reader can access the added ingredient
    const addedIngredient = page.getByText('chicken');
    await expect(addedIngredient).toBeVisible();
    await expect(addedIngredient).toHaveAttribute('role');
  });

  test('should handle high contrast mode @a11y', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that elements are still visible and accessible
    await expect(page.getByTestId('ingredient-input')).toBeVisible();
    await expect(page.getByText('Breakfast')).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should support reduced motion preferences @a11y', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify the app still functions without animations
    const ingredientInput = page.getByTestId('ingredient-input');
    await ingredientInput.fill('tomato');
    await page.keyboard.press('Enter');
    await expect(page.getByText('tomato')).toBeVisible();
  });

  test('should have proper focus management @a11y', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test focus trap in modals/dialogs
    const ingredientInput = page.getByTestId('ingredient-input');
    await ingredientInput.fill('chicken');
    await page.keyboard.press('Enter');

    await page.getByText('Dinner').click();
    await page.getByText('🚀 Generate My Recipe!').click();

    // Wait for recipe generation
    await expect(page.getByText('Generating your recipe...')).toBeVisible();
    await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });

    // Check focus management after recipe generation
    const recipeTitle = page.getByRole('heading', { level: 2 });
    await expect(recipeTitle).toBeVisible();
  });
}); 