import { chromium } from '@playwright/test';

async function globalSetup() {
  console.log('🚀 Starting global test setup...');
  
  // Create a browser instance for setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Check if the application is running
    console.log('🔍 Checking application availability...');
    await page.goto(process.env.BASE_URL || 'http://localhost:5173', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Verify the app loads correctly
    await page.waitForSelector('[data-testid="ingredient-input"]', { timeout: 10000 });
    console.log('✅ Application is running and accessible');

    // Setup test data in localStorage if needed
    await page.evaluate(() => {
      // Clear any existing test data
      localStorage.clear();
      
      // Set up test environment flags
      localStorage.setItem('test-mode', 'true');
      localStorage.setItem('test-timestamp', Date.now().toString());
    });

    console.log('✅ Test environment prepared');

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }

  console.log('🎉 Global setup completed successfully');
}

export default globalSetup; 