# 🧪 Manual Test Case Plan - Leftover Recipe Generator

## 📋 Test Overview

**Application:** Leftover Recipe Generator  
**Version:** Production  
**Test Environment:** https://hackathon-test-8ua2743d9-mangeshs-projects-59059c2a.vercel.app  
**Browser Support:** Chrome, Firefox, Safari, Edge  
**Device Support:** Desktop, Tablet, Mobile  

---

## 🎯 Test Objectives

1. Verify all core functionality works as expected
2. Ensure UI/UX enhancements provide clear user feedback
3. Validate responsive design across devices
4. Test error handling and edge cases
5. Confirm data persistence and storage functionality

---

## 📱 Test Categories

### **1. INGREDIENT INPUT SYSTEM**

#### **TC-001: Basic Ingredient Input**
- **Objective:** Verify ingredient input functionality
- **Steps:**
  1. Navigate to the application
  2. Click on the ingredient input field
  3. Type "chicken"
  4. Verify autocomplete suggestions appear
  5. Click on "chicken" from suggestions
  6. Verify ingredient is added to the list
- **Expected Result:** Ingredient appears as a tag with × button
- **Priority:** High

#### **TC-002: Multiple Ingredient Selection**
- **Objective:** Test adding multiple ingredients
- **Steps:**
  1. Add "chicken" using autocomplete
  2. Add "rice" by typing and pressing Enter
  3. Add "broccoli" using autocomplete
  4. Verify all three ingredients are displayed
- **Expected Result:** All ingredients shown as separate tags
- **Priority:** High

#### **TC-003: Duplicate Prevention**
- **Objective:** Ensure duplicates are prevented
- **Steps:**
  1. Add "chicken" to ingredients
  2. Try to add "chicken" again
  3. Verify duplicate is not added
- **Expected Result:** Only one "chicken" ingredient exists
- **Priority:** Medium

#### **TC-004: Ingredient Removal**
- **Objective:** Test removing ingredients
- **Steps:**
  1. Add multiple ingredients
  2. Click × button on one ingredient
  3. Verify ingredient is removed
  4. Verify other ingredients remain
- **Expected Result:** Selected ingredient removed, others intact
- **Priority:** High

#### **TC-005: Empty State Handling**
- **Objective:** Test behavior with no ingredients
- **Steps:**
  1. Ensure no ingredients are added
  2. Try to proceed to next step
  3. Verify appropriate messaging
- **Expected Result:** Clear indication that ingredients are required
- **Priority:** Medium

---

### **2. MEAL TYPE & PREFERENCES SELECTION**

#### **TC-006: Meal Type Selection**
- **Objective:** Verify meal type selection works
- **Steps:**
  1. Add at least one ingredient
  2. Scroll to meal type section
  3. Click on "Breakfast" option
  4. Verify visual feedback (blue border, checkmark)
  5. Verify selection summary appears at top
- **Expected Result:** 
  - Button shows selected state with blue styling
  - Checkmark badge appears
  - Selection summary displays at top with "Ready to Generate!" badge
- **Priority:** High

#### **TC-007: Meal Type Change**
- **Objective:** Test changing meal type selection
- **Steps:**
  1. Select "Breakfast"
  2. Click on "Dinner"
  3. Verify previous selection is deselected
  4. Verify new selection is highlighted
  5. Check selection summary updates
- **Expected Result:** Only "Dinner" is selected, summary updates
- **Priority:** High

#### **TC-008: Dietary Preferences Multi-Select**
- **Objective:** Test multiple dietary preference selection
- **Steps:**
  1. Click on "Vegetarian" option
  2. Click on "Gluten-Free" option
  3. Verify both show selected state with different colors
  4. Verify preference tags appear below grid
  5. Check selection summary shows "2 preferences"
- **Expected Result:** 
  - Both options show selected state with color coding
  - Tags appear below with × removal buttons
  - Summary shows count or individual preference if only one
- **Priority:** High

#### **TC-009: Dietary Preference Removal**
- **Objective:** Test removing dietary preferences
- **Steps:**
  1. Select multiple dietary preferences
  2. Click × on one preference tag
  3. Verify preference is deselected
  4. Click directly on selected preference button
  5. Verify it toggles off
- **Expected Result:** Preferences can be removed via tag × or button click
- **Priority:** Medium

#### **TC-010: Cooking Time Selection**
- **Objective:** Test cooking time selection
- **Steps:**
  1. Click on "15 min" option
  2. Verify orange styling and checkmark
  3. Select different time option
  4. Verify previous selection is cleared
  5. Check selection summary updates
- **Expected Result:** Single selection with orange styling, summary updates
- **Priority:** High

#### **TC-011: Serving Size Adjustment**
- **Objective:** Test serving size controls
- **Steps:**
  1. Note default serving size (4)
  2. Click + button twice
  3. Verify size increases to 6
  4. Click - button once
  5. Verify size decreases to 5
  6. Try to go below 1 and above 12
- **Expected Result:** 
  - Size adjusts correctly
  - Cannot go below 1 or above 12
  - Summary updates with each change
- **Priority:** Medium

#### **TC-012: Selection Summary Visibility**
- **Objective:** Verify selection summary behavior
- **Steps:**
  1. Start with no meal type selected
  2. Verify no summary is shown
  3. Select a meal type
  4. Verify summary appears with gradient background
  5. Modify other preferences
  6. Verify summary updates in real-time
- **Expected Result:** Summary only appears after meal type selection and updates dynamically
- **Priority:** High

---

### **3. RECIPE GENERATION**

#### **TC-013: Basic Recipe Generation**
- **Objective:** Test successful recipe generation
- **Steps:**
  1. Add ingredients: "chicken", "rice", "broccoli"
  2. Select "Dinner" meal type
  3. Click "Generate My Recipe!" button
  4. Wait for loading animation
  5. Verify recipe is generated and displayed
- **Expected Result:** 
  - Loading spinner appears
  - Recipe displays with title, ingredients, instructions
  - Recipe uses provided ingredients
- **Priority:** High

#### **TC-014: Recipe Generation with All Preferences**
- **Objective:** Test generation with full preferences
- **Steps:**
  1. Add multiple ingredients
  2. Select meal type, dietary preferences, cooking time, serving size
  3. Generate recipe
  4. Verify recipe respects all preferences
- **Expected Result:** Recipe reflects all selected preferences
- **Priority:** High

#### **TC-015: Loading State Verification**
- **Objective:** Test loading experience
- **Steps:**
  1. Initiate recipe generation
  2. Observe loading spinner animation
  3. Verify loading text updates
  4. Time the loading duration (should be 1.5-3 seconds)
- **Expected Result:** Smooth loading animation with appropriate duration
- **Priority:** Medium

#### **TC-016: Recipe Content Validation**
- **Objective:** Verify recipe content quality
- **Steps:**
  1. Generate recipe with specific ingredients
  2. Check recipe title includes main ingredients
  3. Verify all user ingredients are included
  4. Check for complementary ingredients
  5. Verify instructions are logical and complete
- **Expected Result:** 
  - Title reflects main ingredients
  - All user ingredients present
  - Logical complementary ingredients added
  - Clear, step-by-step instructions
- **Priority:** High

#### **TC-017: Error Handling**
- **Objective:** Test error scenarios
- **Steps:**
  1. Try to generate recipe with no ingredients
  2. Verify error message appears
  3. Add ingredients and try again
  4. Verify successful generation
- **Expected Result:** Clear error message, then successful generation
- **Priority:** Medium

---

### **4. RECIPE DISPLAY & INTERACTION**

#### **TC-018: Recipe Tabs Navigation**
- **Objective:** Test tabbed interface
- **Steps:**
  1. Generate a recipe
  2. Click on "Ingredients" tab
  3. Verify ingredients list with checkboxes
  4. Click on "Instructions" tab
  5. Verify step-by-step instructions
  6. Test "Nutrition" and "AI Insights" tabs
- **Expected Result:** All tabs work with appropriate content
- **Priority:** High

#### **TC-019: Interactive Ingredients Checklist**
- **Objective:** Test ingredient checking functionality
- **Steps:**
  1. Navigate to Ingredients tab
  2. Click checkboxes next to ingredients
  3. Verify visual feedback (strikethrough, color change)
  4. Uncheck some ingredients
  5. Verify state reverts
- **Expected Result:** Ingredients can be checked/unchecked with visual feedback
- **Priority:** Medium

#### **TC-020: Step-by-Step Instructions**
- **Objective:** Test instruction interaction
- **Steps:**
  1. Navigate to Instructions tab
  2. Click on step numbers or content
  3. Verify any interactive elements work
  4. Check if steps can be marked as complete
- **Expected Result:** Instructions are clear and any interactive elements function
- **Priority:** Medium

#### **TC-021: Nutrition Information Display**
- **Objective:** Verify nutrition tab content
- **Steps:**
  1. Navigate to Nutrition tab
  2. Verify calories, protein, carbs, fat, fiber are displayed
  3. Check values are reasonable for recipe
- **Expected Result:** Complete nutrition information with realistic values
- **Priority:** Low

#### **TC-022: AI Insights Content**
- **Objective:** Test AI insights quality
- **Steps:**
  1. Navigate to AI Insights tab
  2. Read through insights
  3. Verify insights are relevant to ingredients/preferences
  4. Check for recipe alternatives
- **Expected Result:** Relevant, helpful insights and alternatives
- **Priority:** Medium

---

### **5. RECIPE SAVING & HISTORY**

#### **TC-023: Save Recipe Functionality**
- **Objective:** Test recipe saving
- **Steps:**
  1. Generate a recipe
  2. Click "Save Recipe" button
  3. Verify success message
  4. Navigate to "My Recipes" section
  5. Verify recipe appears in saved list
- **Expected Result:** Recipe successfully saved and appears in history
- **Priority:** High

#### **TC-024: Recipe History Display**
- **Objective:** Test saved recipes view
- **Steps:**
  1. Save multiple recipes
  2. Navigate to saved recipes section
  3. Verify all saved recipes are listed
  4. Check recipe cards show title, date, view count
- **Expected Result:** All saved recipes displayed with metadata
- **Priority:** High

#### **TC-025: Recipe Search & Filter**
- **Objective:** Test search functionality
- **Steps:**
  1. Save recipes with different names
  2. Use search box to find specific recipe
  3. Verify search results are accurate
  4. Test filter options if available
- **Expected Result:** Search returns relevant results
- **Priority:** Medium

#### **TC-026: Recipe Deletion**
- **Objective:** Test removing saved recipes
- **Steps:**
  1. Save a recipe
  2. Find delete option in saved recipes
  3. Delete the recipe
  4. Verify it's removed from list
  5. Verify deletion is permanent
- **Expected Result:** Recipe successfully deleted and doesn't reappear
- **Priority:** Medium

#### **TC-027: Data Persistence**
- **Objective:** Test data persistence across sessions
- **Steps:**
  1. Save multiple recipes
  2. Close browser/tab
  3. Reopen application
  4. Navigate to saved recipes
  5. Verify all recipes are still there
- **Expected Result:** Saved recipes persist across browser sessions
- **Priority:** High

---

### **6. SOCIAL FEATURES**

#### **TC-028: Recipe Rating**
- **Objective:** Test recipe rating system
- **Steps:**
  1. Generate or view a recipe
  2. Find rating component (stars)
  3. Click on different star ratings
  4. Verify rating is saved
  5. Check rating persists on reload
- **Expected Result:** Rating can be set and persists
- **Priority:** Medium

#### **TC-029: Recipe Comments**
- **Objective:** Test commenting functionality
- **Steps:**
  1. Navigate to a recipe
  2. Find comment section
  3. Add a comment
  4. Verify comment appears
  5. Test comment editing/deletion if available
- **Expected Result:** Comments can be added and managed
- **Priority:** Medium

#### **TC-030: Recipe Sharing**
- **Objective:** Test sharing functionality
- **Steps:**
  1. Generate a recipe
  2. Find share options
  3. Test different sharing methods
  4. Verify shared links work
- **Expected Result:** Recipes can be shared via various methods
- **Priority:** Low

---

### **7. RESPONSIVE DESIGN & ACCESSIBILITY**

#### **TC-031: Mobile Responsiveness**
- **Objective:** Test mobile device compatibility
- **Steps:**
  1. Open application on mobile device or use browser dev tools
  2. Test all functionality on mobile
  3. Verify touch interactions work
  4. Check text readability and button sizes
- **Expected Result:** Full functionality on mobile with good UX
- **Priority:** High

#### **TC-032: Tablet Responsiveness**
- **Objective:** Test tablet compatibility
- **Steps:**
  1. Test on tablet or tablet viewport
  2. Verify layout adapts appropriately
  3. Test all interactions
- **Expected Result:** Optimized layout for tablet screens
- **Priority:** Medium

#### **TC-033: Keyboard Navigation**
- **Objective:** Test keyboard accessibility
- **Steps:**
  1. Navigate entire app using only keyboard
  2. Use Tab to move between elements
  3. Use Enter/Space to activate buttons
  4. Verify focus indicators are visible
- **Expected Result:** Full keyboard navigation support
- **Priority:** Medium

#### **TC-034: Screen Reader Compatibility**
- **Objective:** Test with screen readers
- **Steps:**
  1. Use screen reader software
  2. Navigate through application
  3. Verify content is properly announced
  4. Check for proper ARIA labels
- **Expected Result:** Screen reader can access all content
- **Priority:** Low

---

### **8. PERFORMANCE & ERROR HANDLING**

#### **TC-035: Page Load Performance**
- **Objective:** Test initial load speed
- **Steps:**
  1. Clear browser cache
  2. Navigate to application
  3. Measure load time
  4. Verify all assets load properly
- **Expected Result:** Page loads within 3 seconds
- **Priority:** Medium

#### **TC-036: Recipe Generation Performance**
- **Objective:** Test generation speed
- **Steps:**
  1. Generate multiple recipes
  2. Time each generation
  3. Verify consistent performance
- **Expected Result:** Consistent 1.5-3 second generation time
- **Priority:** Low

#### **TC-037: Network Error Handling**
- **Objective:** Test offline/network error scenarios
- **Steps:**
  1. Disconnect internet
  2. Try to use application
  3. Verify appropriate error messages
  4. Reconnect and verify recovery
- **Expected Result:** Graceful error handling and recovery
- **Priority:** Low

#### **TC-038: Browser Compatibility**
- **Objective:** Test across different browsers
- **Steps:**
  1. Test in Chrome, Firefox, Safari, Edge
  2. Verify all functionality works
  3. Check for visual consistency
- **Expected Result:** Consistent experience across browsers
- **Priority:** Medium

---

## 🚨 Critical Test Scenarios

### **High Priority Test Flow**
1. **Complete User Journey:**
   - Add ingredients → Select preferences → Generate recipe → Save recipe → View saved recipes

2. **Core Functionality:**
   - Ingredient input with autocomplete
   - Meal type selection with visual feedback
   - Recipe generation with loading states
   - Recipe display with tabbed interface

3. **Data Persistence:**
   - Save recipes and verify persistence across sessions

### **Edge Cases to Test**
- Very long ingredient names
- Special characters in ingredient names
- Maximum number of ingredients
- Rapid clicking on buttons
- Browser back/forward navigation
- Clearing browser data

---

## 📊 Test Execution Tracking

### **Test Status Template**
```
TC-XXX: [Test Case Name]
Status: [ ] Pass [ ] Fail [ ] Blocked [ ] Not Tested
Browser: ___________
Device: ____________
Date: ______________
Tester: ____________
Notes: _____________
```

### **Bug Report Template**
```
Bug ID: BUG-XXX
Title: [Brief description]
Severity: [ ] Critical [ ] High [ ] Medium [ ] Low
Steps to Reproduce:
1. 
2. 
3. 

Expected Result:
Actual Result:
Browser/Device:
Screenshot/Video:
```

---

## ✅ Test Completion Criteria

- [ ] All High priority test cases pass
- [ ] No Critical or High severity bugs remain
- [ ] Core user journey works end-to-end
- [ ] Application works on primary browsers
- [ ] Mobile responsiveness verified
- [ ] Data persistence confirmed
- [ ] Performance meets requirements

---

## 📝 Notes for Testers

1. **Test Data:** Use realistic ingredient combinations
2. **Browser Cache:** Clear cache between test sessions when testing persistence
3. **Screenshots:** Capture screenshots for any visual issues
4. **Performance:** Note any slow loading or unresponsive behavior
5. **Accessibility:** Test with keyboard navigation and screen readers when possible

---

**Document Version:** 1.0  
**Last Updated:** [Current Date]  
**Next Review:** [Date + 1 week] 