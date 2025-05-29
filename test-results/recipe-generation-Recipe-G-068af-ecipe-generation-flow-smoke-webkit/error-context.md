# Test info

- Name: Recipe Generation Flow >> should complete full recipe generation flow @smoke
- Location: /Users/mangeshraut/Development/hackathon test/tests/e2e/recipe-generation.spec.js:9:3

# Error details

```
Error: expect.toBeVisible: Error: strict mode violation: getByText('chicken') resolved to 2 elements:
    1) <span data-testid="selected-ingredient-0" class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">…</span> aka getByTestId('selected-ingredient-0')
    2) <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">chicken</span> aka getByText('chicken', { exact: true })

Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByText('chicken')

    at /Users/mangeshraut/Development/hackathon test/tests/e2e/recipe-generation.spec.js:17:45
```

# Page snapshot

```yaml
- banner:
  - heading "🍲 Leftover Recipe Generator" [level=1]
  - paragraph: Turn your leftover ingredients into delicious, healthy meals with AI
  - button "🤖 Generate Recipe"
  - button "📚 My Recipes"
  - button "👥 Community"
- main:
  - text: "1"
  - heading "What ingredients do you have?" [level=2]
  - text: Add your leftover ingredients
  - textbox "Add your leftover ingredients"
  - heading "Selected ingredients:" [level=3]
  - text: chicken
  - button "×"
  - text: "2"
  - heading "What would you like to make?" [level=2]
  - heading "What would you like to make?" [level=2]
  - paragraph: Choose your preferences to get the perfect recipe
  - heading "🍽️ Choose Your Meal Type" [level=3]
  - button "🍳 Breakfast Start your day right"
  - button "🥗 Lunch Midday fuel"
  - button "🍽️ Dinner Evening feast"
  - button "🍿 Snack Quick bite"
  - button "🍰 Dessert Sweet treat"
  - heading "🌱 Dietary Preferences (Optional - select any that apply)" [level=3]
  - button "🥬 Vegetarian"
  - button "🌱 Vegan"
  - button "🌾 Gluten-Free"
  - button "🥛 Dairy-Free"
  - button "🥩 Low-Carb"
  - button "🥑 Keto"
  - heading "⏰ How much time do you have?" [level=3]
  - button "⚡ 15 min Super quick"
  - button "⏰ 30 min Quick & easy"
  - button "🕐 1 hour Moderate time"
  - button "⏳ 2 hours Take your time"
  - button "🍳 Any time No rush"
  - heading "👥 How many people are you cooking for?" [level=3]
  - button "-"
  - text: 👥 4 servings
  - button "+"
  - text: "3"
  - heading "Generate Your Recipe" [level=2]
  - text: 🤖👨‍🍳
  - heading "Ready to Cook?" [level=3]
  - paragraph: Let our AI chef create a personalized recipe based on your ingredients and preferences!
  - heading "Your Ingredients:" [level=4]
  - text: chicken
  - button "🚀 Generate My Recipe!"
- contentinfo:
  - paragraph: Made with ❤️ and AI • Reduce food waste, one recipe at a time
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
   9 |   test('should complete full recipe generation flow @smoke', async ({ page }) => {
   10 |     // Step 1: Add ingredients
   11 |     const ingredientInput = page.getByTestId('ingredient-input');
   12 |     await expect(ingredientInput).toBeVisible();
   13 |     
   14 |     // Add multiple ingredients
   15 |     await ingredientInput.fill('chicken');
   16 |     await page.keyboard.press('Enter');
>  17 |     await expect(page.getByText('chicken')).toBeVisible();
      |                                             ^ Error: expect.toBeVisible: Error: strict mode violation: getByText('chicken') resolved to 2 elements:
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
  110 |
  111 |   test('should update selection summary in real-time', async ({ page }) => {
  112 |     // Add ingredient
  113 |     const ingredientInput = page.getByTestId('ingredient-input');
  114 |     await ingredientInput.fill('chicken');
  115 |     await page.keyboard.press('Enter');
  116 |     
  117 |     // Select meal type
```