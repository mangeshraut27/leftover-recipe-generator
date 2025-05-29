# 🧪 Test Automation Framework - Leftover Recipe Generator

## 📋 Overview

This comprehensive test automation framework provides multi-layered testing for the Leftover Recipe Generator application, ensuring quality, performance, and reliability across all features.

## 🏗️ Framework Architecture

```
tests/
├── unit/                    # Jest unit tests
│   ├── components/         # React component tests
│   ├── services/          # Service layer tests
│   └── utils/             # Utility function tests
├── e2e/                    # Playwright end-to-end tests
│   ├── recipe-generation.spec.js
│   ├── accessibility.spec.js
│   ├── performance.spec.js
│   ├── mobile.spec.js
│   ├── global-setup.js
│   └── global-teardown.js
├── api/                    # API integration tests
│   └── openai-integration.test.js
└── visual/                 # Visual regression tests
    └── screenshots/
```

## 🛠️ Technology Stack

- **Unit Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright
- **API Testing**: Jest with fetch mocking
- **Accessibility Testing**: axe-playwright
- **Performance Testing**: Playwright + Lighthouse
- **Visual Testing**: Playwright screenshots
- **CI/CD**: GitHub Actions ready

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
npm run playwright:install
```

### 2. Run All Tests

```bash
# Run all tests
npm run test:all

# Run specific test types
npm run test              # Unit tests only
npm run test:e2e         # E2E tests only
npm run test:api         # API tests only
npm run test:performance # Performance tests only
npm run test:visual      # Visual regression tests
```

### 3. Interactive Testing

```bash
# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed

# Watch mode for unit tests
npm run test:watch
```

## 📊 Test Categories

### 🔧 Unit Tests (Jest + RTL)

**Location**: `src/components/__tests__/`, `src/services/__tests__/`

**Coverage**:
- ✅ Component rendering and interactions
- ✅ Service layer functionality
- ✅ State management
- ✅ Error handling
- ✅ Edge cases

**Example**:
```javascript
test('should add ingredient when Enter is pressed', async () => {
  const mockOnAdd = jest.fn();
  render(<IngredientInput onAdd={mockOnAdd} />);
  
  const input = screen.getByTestId('ingredient-input');
  await userEvent.type(input, 'chicken{enter}');
  
  expect(mockOnAdd).toHaveBeenCalledWith('chicken');
});
```

### 🌐 End-to-End Tests (Playwright)

**Location**: `tests/e2e/`

**Coverage**:
- ✅ Complete user journeys
- ✅ Cross-browser compatibility
- ✅ Mobile responsiveness
- ✅ Real API integration
- ✅ Error scenarios

**Browsers Tested**:
- Chrome (Desktop & Mobile)
- Firefox
- Safari/WebKit
- Edge

**Example**:
```javascript
test('should complete full recipe generation flow @smoke', async ({ page }) => {
  await page.goto('/');
  
  // Add ingredients
  await page.getByTestId('ingredient-input').fill('chicken');
  await page.keyboard.press('Enter');
  
  // Select preferences
  await page.getByText('Dinner').click();
  
  // Generate recipe
  await page.getByText('🚀 Generate My Recipe!').click();
  
  // Verify result
  await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
});
```

### ♿ Accessibility Tests (axe-playwright)

**Location**: `tests/e2e/accessibility.spec.js`

**Coverage**:
- ✅ WCAG 2.1 AA compliance
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Color contrast
- ✅ Focus management

**Example**:
```javascript
test('should not have accessibility violations @a11y', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### ⚡ Performance Tests (Playwright)

**Location**: `tests/e2e/performance.spec.js`

**Coverage**:
- ✅ Page load times
- ✅ Recipe generation speed
- ✅ Memory usage
- ✅ Network efficiency
- ✅ Large data handling

**Metrics**:
- Page load: < 3 seconds
- Recipe generation: < 10 seconds
- Memory increase: < 50MB
- DOM queries: < 1 second for 100 queries

### 🔌 API Tests (Jest)

**Location**: `tests/api/`

**Coverage**:
- ✅ OpenAI API integration
- ✅ Error handling and fallbacks
- ✅ Request/response validation
- ✅ Authentication
- ✅ Rate limiting

**Example**:
```javascript
test('should fall back to local generation when API fails', async () => {
  fetch.mockRejectedValueOnce(new Error('Network error'));
  
  const result = await generateRecipe(['chicken'], { mealType: 'dinner' });
  
  expect(result.success).toBe(true);
  expect(result.recipe.source).toBe('fallback');
});
```

## 🏷️ Test Tags and Organization

### Tag System

- `@smoke` - Critical path tests
- `@regression` - Full regression suite
- `@a11y` - Accessibility tests
- `@performance` - Performance tests
- `@visual` - Visual regression tests
- `@api` - API integration tests

### Running Tagged Tests

```bash
# Run only smoke tests
npx playwright test --grep @smoke

# Run accessibility tests
npx playwright test --grep @a11y

# Run performance tests
npx playwright test --grep @performance
```

## 📱 Mobile Testing

**Devices Tested**:
- iPhone 12 (iOS Safari)
- Pixel 5 (Android Chrome)
- iPad (tablet view)

**Coverage**:
- ✅ Touch interactions
- ✅ Responsive layouts
- ✅ Mobile-specific features
- ✅ Performance on mobile

## 🔄 CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Test Automation
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:coverage

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### Environment Variables

```bash
# Required for API tests
VITE_OPENAI_API_KEY=your_test_api_key

# Optional for production testing
BASE_URL=https://your-app.vercel.app
```

## 📊 Test Reports and Artifacts

### Playwright Reports

- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results/results.json`
- **JUnit XML**: `test-results/results.xml`

### Jest Coverage

```bash
npm run test:coverage
```

- **Coverage Report**: `coverage/lcov-report/index.html`
- **Coverage Data**: `coverage/lcov.info`

### Artifacts Generated

- Screenshots on failure
- Videos of test runs
- Trace files for debugging
- Performance metrics
- Accessibility scan results

## 🐛 Debugging Tests

### Playwright Debugging

```bash
# Debug mode with browser
npx playwright test --debug

# Headed mode
npx playwright test --headed

# Trace viewer
npx playwright show-trace trace.zip
```

### Jest Debugging

```bash
# Debug specific test
npm test -- --testNamePattern="specific test"

# Watch mode
npm run test:watch
```

## 📈 Test Metrics and KPIs

### Coverage Targets

- **Unit Test Coverage**: > 80%
- **E2E Critical Paths**: 100%
- **Accessibility Compliance**: 100%
- **Performance Benchmarks**: Met

### Quality Gates

- ✅ All smoke tests pass
- ✅ No accessibility violations
- ✅ Performance within limits
- ✅ API fallbacks working
- ✅ Cross-browser compatibility

## 🔧 Configuration Files

### Playwright Config (`playwright.config.js`)

```javascript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html'], ['json'], ['junit']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
    { name: 'Mobile Chrome', use: devices['Pixel 5'] },
    { name: 'Mobile Safari', use: devices['iPhone 12'] },
  ],
});
```

### Jest Config (`jest.config.cjs`)

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/**/*.test.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

## 🎯 Best Practices

### Test Writing Guidelines

1. **Descriptive Test Names**: Use clear, behavior-focused names
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Independent Tests**: Each test should be isolated
4. **Data-Driven**: Use test data factories
5. **Page Object Model**: For E2E tests

### Maintenance

1. **Regular Updates**: Keep dependencies current
2. **Flaky Test Management**: Monitor and fix unstable tests
3. **Performance Monitoring**: Track test execution times
4. **Documentation**: Keep test docs updated

## 🚨 Troubleshooting

### Common Issues

**Playwright Tests Failing**:
```bash
# Clear browser cache
npx playwright test --headed --project=chromium

# Update browsers
npx playwright install
```

**API Tests Failing**:
```bash
# Check environment variables
echo $VITE_OPENAI_API_KEY

# Verify mock setup
npm test -- --verbose
```

**Performance Tests Slow**:
```bash
# Run on specific browser
npx playwright test --project=chromium performance.spec.js
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)

## 🎉 Getting Started Checklist

- [ ] Install dependencies (`npm install`)
- [ ] Install Playwright browsers (`npm run playwright:install`)
- [ ] Set up environment variables
- [ ] Run smoke tests (`npx playwright test --grep @smoke`)
- [ ] Run full test suite (`npm run test:all`)
- [ ] Review test reports
- [ ] Set up CI/CD pipeline

---

**Framework Version**: 1.0  
**Last Updated**: [Current Date]  
**Maintained By**: Development Team 