# Test info

- Name: Recipe Generation Flow >> should complete full recipe generation flow @smoke
- Location: /Users/mangeshraut/Development/hackathon test/tests/e2e/recipe-generation.spec.js:9:3

# Error details

```
Error: browserType.launch: Chromium distribution 'msedge' is not found at /Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge
Run "npx playwright install msedge"
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Recipe Generation Flow', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto('/');
   6 |     await page.waitForLoadState('networkidle');
   7 |   });
   8 |
>  9 |   test('should complete full recipe generation flow @smoke', async ({ page }) => {
     |   ^ Error: browserType.launch: Chromium distribution 'msedge' is not found at /Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge
   10 |     // Step 1: Add ingredients
   11 |     const ingredientInput = page.getByTestId('ingredient-input');
   12 |     await expect(ingredientInput).toBeVisible();
   13 |     
   14 |     // Add multiple ingredients
   15 |     await ingredientInput.fill('chicken');
   16 |     await page.keyboard.press('Enter');
   17 |     await expect(page.getByText('chicken')).toBeVisible();
   18 |     
   19 |     await ingredientInput.fill('rice');
   20 |     await page.keyboard.press('Enter');
   21 |     await expect(page.getByText('rice')).toBeVisible();
   22 |     
   23 |     await ingredientInput.fill('broccoli');
   24 |     await page.keyboard.press('Enter');
   25 |     await expect(page.getByText('broccoli')).toBeVisible();
   26 |
   27 |     // Step 2: Select meal type
   28 |     await page.getByText('Dinner').click();
   29 |     await expect(page.getByText('Dinner')).toHaveClass(/bg-blue-500/);
   30 |
   31 |     // Step 3: Select dietary preferences
   32 |     await page.getByText('Gluten-Free').click();
   33 |     await expect(page.getByText('Gluten-Free')).toHaveClass(/bg-green-500/);
   34 |
   35 |     // Step 4: Set cooking time
   36 |     await page.getByText('30 minutes or less').click();
   37 |
   38 |     // Step 5: Adjust serving size
   39 |     const servingPlus = page.getByRole('button', { name: '+' });
   40 |     await servingPlus.click();
   41 |     await expect(page.getByText('5')).toBeVisible();
   42 |
   43 |     // Step 6: Generate recipe
   44 |     const generateButton = page.getByText('🚀 Generate My Recipe!');
   45 |     await expect(generateButton).toBeEnabled();
   46 |     await generateButton.click();
   47 |
   48 |     // Step 7: Wait for recipe generation
   49 |     await expect(page.getByText('Generating your recipe...')).toBeVisible();
   50 |     
   51 |     // Wait for recipe to be generated (with timeout)
   52 |     await expect(page.getByText('Generating your recipe...')).toBeHidden({ timeout: 30000 });
   53 |     
   54 |     // Step 8: Verify recipe is displayed
   55 |     await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
   56 |     await expect(page.getByText('Ingredients')).toBeVisible();
   57 |     await expect(page.getByText('Instructions')).toBeVisible();
   58 |     await expect(page.getByText('Nutrition')).toBeVisible();
   59 |   });
   60 |
   61 |   test('should show autocomplete suggestions', async ({ page }) => {
   62 |     const ingredientInput = page.getByTestId('ingredient-input');
   63 |     
   64 |     // Type partial ingredient name
   65 |     await ingredientInput.fill('tom');
   66 |     
   67 |     // Wait for suggestions to appear
   68 |     await expect(page.getByText('tomatoes')).toBeVisible({ timeout: 5000 });
   69 |     
   70 |     // Click on suggestion
   71 |     await page.getByText('tomatoes').click();
   72 |     
   73 |     // Verify ingredient was added
   74 |     await expect(page.getByText('tomatoes')).toBeVisible();
   75 |   });
   76 |
   77 |   test('should prevent duplicate ingredients', async ({ page }) => {
   78 |     const ingredientInput = page.getByTestId('ingredient-input');
   79 |     
   80 |     // Add ingredient twice
   81 |     await ingredientInput.fill('chicken');
   82 |     await page.keyboard.press('Enter');
   83 |     
   84 |     await ingredientInput.fill('chicken');
   85 |     await page.keyboard.press('Enter');
   86 |     
   87 |     // Should only have one chicken ingredient
   88 |     const chickenElements = page.getByText('chicken');
   89 |     await expect(chickenElements).toHaveCount(1);
   90 |   });
   91 |
   92 |   test('should remove ingredients when X is clicked', async ({ page }) => {
   93 |     const ingredientInput = page.getByTestId('ingredient-input');
   94 |     
   95 |     // Add ingredient
   96 |     await ingredientInput.fill('chicken');
   97 |     await page.keyboard.press('Enter');
   98 |     await expect(page.getByText('chicken')).toBeVisible();
   99 |     
  100 |     // Remove ingredient
  101 |     await page.getByRole('button', { name: '×' }).click();
  102 |     await expect(page.getByText('chicken')).toBeHidden();
  103 |   });
  104 |
  105 |   test('should disable generate button when no ingredients', async ({ page }) => {
  106 |     const generateButton = page.getByText('Add Ingredients First');
  107 |     await expect(generateButton).toBeDisabled();
  108 |     await expect(page.getByText('Please add at least one ingredient to get started')).toBeVisible();
  109 |   });
```