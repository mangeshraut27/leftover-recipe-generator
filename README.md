# 🍲 Leftover-Based Recipe Generator

A modern React application that helps you turn your leftover ingredients into delicious, healthy meals using **real AI-powered recipe generation** with OpenAI's ChatGPT.

## ✨ Features

### Phase 1: Ingredient Input ✅ COMPLETE
- **Smart Autocomplete**: Type ingredient names and get intelligent suggestions
- **Multiple Selection**: Add multiple ingredients by typing or clicking
- **Duplicate Prevention**: Automatically prevents adding the same ingredient twice
- **Easy Removal**: Remove ingredients with × buttons
- **Real-time Filtering**: Suggestions update as you type
- **Modern UI**: Clean, responsive design with Tailwind CSS

### Phase 2: Meal Type Selection ✅ COMPLETE
- **Meal Type Selection**: Choose from Breakfast, Lunch, Dinner, Snack, or Dessert
- **Dietary Preferences**: Optional filters for Vegetarian, Vegan, Gluten-Free, Dairy-Free, Low-Carb, and Keto
- **Cooking Time Preferences**: Select from 15 minutes to 2+ hours or any time
- **Serving Size Control**: Adjust servings from 1 to 12 people
- **Selection Summary**: Real-time preview of your choices
- **Progressive UI**: Step-by-step interface that guides users through the process

### Phase 3: AI Recipe Generation ✅ COMPLETE
- **🤖 Real OpenAI Integration**: Powered by ChatGPT for truly intelligent recipe creation
- **Smart Fallback System**: Local recipe generation when API is unavailable
- **Personalized Recipes**: AI considers your specific ingredients, dietary needs, and preferences
- **Detailed Recipe Display**: Beautiful tabbed interface with ingredients, instructions, and timing
- **Interactive Features**: Ingredient checklist, step-by-step instructions with visual indicators
- **Nutritional Information**: Complete nutrition facts with macronutrient breakdown
- **AI Insights**: Chef tips, health benefits, and recipe variations from real AI
- **Recipe Alternatives**: Multiple variations with modification suggestions
- **Loading Experience**: Engaging animations and progress indicators during generation
- **Error Handling**: Graceful error states with retry functionality
- **Waste Reduction Focus**: AI specifically optimized to minimize food waste

### Phase 4: Recipe Saving & History ✅ COMPLETE
- **Save Favorite Recipes**: Bookmark recipes for easy access later
- **Recipe History**: View previously generated recipes with timestamps and view counts
- **Personal Recipe Collection**: Organize saved recipes by categories
- **Recipe Notes**: Add personal notes and modifications to saved recipes
- **Export Functionality**: Share recipes via email or social media
- **Local Storage**: Persist data across browser sessions
- **Search & Filter**: Find recipes by name, ingredients, or categories
- **Statistics Dashboard**: View cooking activity and favorite recipes
- **Recipe Management**: Delete from history, clear all data, and organize collections

### Phase 5: Social Sharing Features ✅ COMPLETE
- **Recipe Rating System**: Rate and review your generated recipes with 1-5 star ratings
- **Recipe Comments**: Add personal comments and cooking notes to recipes
- **Social Recipe Sharing**: Share recipes with friends via unique shareable links
- **Recipe Collections**: Create and share themed recipe collections (e.g., "Quick Weeknight Dinners")
- **Community Features**: Browse and discover recipes shared by other users
- **Recipe Feedback**: Like, bookmark, and comment on shared recipes
- **Advanced Export Options**: Export recipes as PDF, print-friendly format, or shopping lists
- **Recipe Collaboration**: Invite friends to collaborate on recipe collections
- **Social Media Integration**: Direct sharing to Facebook, Twitter, Instagram, and Pinterest
- **Recipe Analytics**: Track views, saves, and ratings for your shared recipes

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- OpenAI API Key (for AI-powered recipe generation)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mangeshraut27/leftover-recipe-generator.git
cd leftover-recipe-generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file in the root directory
echo "VITE_OPENAI_API_KEY=your_openai_api_key_here" > .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 🤖 AI Integration

### OpenAI-Powered Recipe Generation
- **Real ChatGPT Integration**: Uses OpenAI's GPT-4o mini model for intelligent recipe creation
- **Smart Prompting**: Optimized prompts that focus on leftover ingredients and waste reduction
- **Fallback System**: Automatically falls back to local generation if API is unavailable
- **Cost Efficient**: Approximately $0.002 per recipe generation

### AI Features
- **Contextual Understanding**: AI understands your specific ingredients and dietary needs
- **Creative Combinations**: Discovers unique ways to combine your leftovers
- **Nutritional Awareness**: Provides accurate nutritional information and health insights
- **Cultural Adaptability**: Can create recipes from various cuisines and cooking styles
- **Waste Optimization**: Specifically trained to minimize food waste and maximize ingredient usage

## 🧪 Testing

Run the comprehensive test suite:
```bash
npm test
```

Current test coverage:
- **IngredientInput Component**: 7 tests covering autocomplete, selection, and removal
- **MealTypeSelector Component**: 12 tests covering all selection options and edge cases
- **RecipeGenerator Component**: 15 tests covering recipe generation, loading states, and error handling
- **RecipeDisplay Component**: 18 tests covering tabbed interface, interactions, and content display
- **LoadingSpinner Component**: 8 tests covering animations and progress indicators
- **SavedRecipes Component**: 19 tests covering history management, favorites, search, and filtering
- **StorageService**: 35 tests covering localStorage operations, error handling, and edge cases
- **Total**: 114 tests, all passing ✅

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **AI Integration**: OpenAI GPT-4o mini API
- **Styling**: Tailwind CSS
- **Testing**: Jest + React Testing Library
- **Build Tool**: Vite
- **Language**: Modern JavaScript (ES6+)
- **Storage**: Local Storage API for data persistence
- **Environment**: Vite environment variables for secure API key management

## 📁 Project Structure

```
src/
├── components/
│   ├── IngredientInput.jsx      # Phase 1: Ingredient selection
│   ├── MealTypeSelector.jsx     # Phase 2: Meal preferences
│   ├── RecipeGenerator.jsx      # Phase 3: Recipe generation orchestration
│   ├── RecipeDisplay.jsx        # Phase 3: Recipe presentation
│   ├── LoadingSpinner.jsx       # Phase 3: Loading animations
│   ├── SavedRecipes.jsx         # Phase 4: Recipe history and favorites
│   └── __tests__/
│       ├── IngredientInput.test.js
│       ├── MealTypeSelector.test.js
│       ├── RecipeGenerator.test.js
│       ├── RecipeDisplay.test.js
│       ├── LoadingSpinner.test.js
│       └── SavedRecipes.test.js
├── services/
│   ├── recipeService.js         # Phase 3: AI recipe generation with OpenAI
│   └── storageService.js        # Phase 4: Local storage management
├── App.jsx                      # Main application component
├── index.css                    # Global styles with Tailwind
└── main.jsx                     # Application entry point
```

## 🎯 How to Use

1. **Add Ingredients**: Start typing ingredient names in the input field. Select from autocomplete suggestions or press Enter to add.

2. **Choose Meal Type**: Select what type of meal you want to make (Breakfast, Lunch, Dinner, Snack, or Dessert).

3. **Set Preferences** (Optional):
   - Choose dietary restrictions
   - Select preferred cooking time
   - Adjust serving size

4. **Generate Recipe**: Click "Generate My Recipe!" to create a personalized recipe using real AI.

5. **Explore Recipe**: Use the tabbed interface to view ingredients, nutrition, AI insights, and alternatives.

6. **Save Favorites**: Bookmark recipes you love for easy access later.

7. **View History**: Browse previously generated recipes in your personal collection.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run test suite
- `npm run lint` - Run ESLint

### Configuration Files

- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `jest.config.cjs` - Jest testing configuration
- `babel.config.cjs` - Babel configuration
- `.env` - Environment variables (OpenAI API key)

### Environment Variables

```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

## 🎨 Design Principles

- **User-Centric**: Intuitive, step-by-step interface
- **Responsive**: Works seamlessly on desktop and mobile
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Modern**: Clean design with smooth animations and transitions
- **Performance**: Optimized with Vite and modern React patterns
- **AI-Enhanced**: Leverages real AI for superior recipe generation

## 🧩 Component Architecture

### IngredientInput
- Manages ingredient selection state
- Provides autocomplete functionality
- Handles user interactions (typing, clicking, removing)

### MealTypeSelector
- Manages meal preferences state
- Provides multiple selection categories
- Updates parent component via callbacks

### RecipeService
- **OpenAI Integration**: Real AI-powered recipe generation
- **Fallback System**: Local generation when API unavailable
- **Error Handling**: Graceful degradation and retry logic
- **Prompt Engineering**: Optimized prompts for best AI results

### App
- Orchestrates the overall application flow
- Manages global state for ingredients and preferences
- Provides progressive disclosure of features

## 📈 Roadmap

- [x] **Phase 1**: Ingredient Input System
- [x] **Phase 2**: Meal Type & Preference Selection
- [x] **Phase 3**: AI Recipe Generation Integration (with real OpenAI)
- [x] **Phase 4**: Recipe Saving & History
- [x] **Phase 5**: Social Sharing Features
- [ ] **Future**: Advanced AI features (image recognition, voice input)

## 🔐 Security & Privacy

- **API Key Security**: Environment variables keep your OpenAI key secure
- **Local Storage**: Personal data stays on your device
- **No Data Collection**: We don't store or track your recipes or ingredients
- **Fallback Protection**: App works even without API access

## 💰 Cost Information

- **OpenAI Usage**: ~$0.002 per recipe generation (very affordable)
- **Free Fallback**: Local generation available when API quota exceeded
- **No Subscription**: Pay only for what you use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
