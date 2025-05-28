// Social Sharing Service for Recipe Community Features
// Handles ratings, comments, social sharing, and community interactions

const SOCIAL_STORAGE_KEYS = {
  RECIPE_RATINGS: 'leftover_generator_recipe_ratings',
  RECIPE_COMMENTS: 'leftover_generator_recipe_comments',
  SHARED_RECIPES: 'leftover_generator_shared_recipes',
  RECIPE_COLLECTIONS: 'leftover_generator_recipe_collections',
  USER_PROFILE: 'leftover_generator_user_profile',
  COMMUNITY_RECIPES: 'leftover_generator_community_recipes'
};

// Helper functions for safe localStorage operations
const safeJSONParse = (item, fallback = []) => {
  try {
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error('Error parsing JSON from localStorage:', error);
    return fallback;
  }
};

const safeJSONStringify = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

// Recipe Rating System
export const recipeRatingService = {
  // Rate a recipe (1-5 stars)
  rateRecipe: (recipeId, rating, review = '') => {
    if (!recipeId || rating < 1 || rating > 5) return false;
    
    const ratings = safeJSONParse(localStorage.getItem(SOCIAL_STORAGE_KEYS.RECIPE_RATINGS), {});
    
    ratings[recipeId] = {
      rating: Math.round(rating),
      review: review.trim(),
      ratedAt: new Date().toISOString(),
      userId: getUserId()
    };
    
    return safeJSONStringify(SOCIAL_STORAGE_KEYS.RECIPE_RATINGS, ratings);
  },

  // Get rating for a recipe
  getRecipeRating: (recipeId) => {
    const ratings = safeJSONParse(localStorage.getItem(SOCIAL_STORAGE_KEYS.RECIPE_RATINGS), {});
    return ratings[recipeId] || null;
  },

  // Get all ratings
  getAllRatings: () => {
    return safeJSONParse(localStorage.getItem(SOCIAL_STORAGE_KEYS.RECIPE_RATINGS), {});
  },

  // Get average rating for a recipe (simulated community rating)
  getAverageRating: (recipeId) => {
    const userRating = recipeRatingService.getRecipeRating(recipeId);
    if (!userRating) return null;
    
    // Simulate community ratings by adding some variance to user rating
    const baseRating = userRating.rating;
    const variance = (Math.random() - 0.5) * 0.8; // ±0.4 variance
    const communityRating = Math.max(1, Math.min(5, baseRating + variance));
    const totalRatings = Math.floor(Math.random() * 50) + 5; // 5-55 ratings
    
    return {
      average: Math.round(communityRating * 10) / 10,
      count: totalRatings,
      userRating: baseRating
    };
  }
};

// Recipe Comments System
export const recipeCommentsService = {
  // Add comment to a recipe
  addComment: (recipeId, comment) => {
    if (!recipeId || !comment.trim()) return false;
    
    const comments = safeJSONParse(localStorage.getItem(SOCIAL_STORAGE_KEYS.RECIPE_COMMENTS), {});
    
    if (!comments[recipeId]) {
      comments[recipeId] = [];
    }
    
    const newComment = {
      id: Date.now(),
      comment: comment.trim(),
      author: getUserProfile().name || 'Anonymous Chef',
      createdAt: new Date().toISOString(),
      likes: 0,
      userId: getUserId()
    };
    
    comments[recipeId].unshift(newComment);
    
    return safeJSONStringify(SOCIAL_STORAGE_KEYS.RECIPE_COMMENTS, comments);
  },

  // Get comments for a recipe
  getRecipeComments: (recipeId) => {
    const comments = safeJSONParse(localStorage.getItem(SOCIAL_STORAGE_KEYS.RECIPE_COMMENTS), {});
    const recipeComments = comments[recipeId] || [];
    
    // Add some simulated community comments for demo
    if (recipeComments.length === 0) {
      return generateSampleComments(recipeId);
    }
    
    return recipeComments;
  },

  // Delete comment
  deleteComment: (recipeId, commentId) => {
    const comments = safeJSONParse(localStorage.getItem(SOCIAL_STORAGE_KEYS.RECIPE_COMMENTS), {});
    
    if (comments[recipeId]) {
      comments[recipeId] = comments[recipeId].filter(comment => 
        comment.id !== commentId || comment.userId === getUserId()
      );
      return safeJSONStringify(SOCIAL_STORAGE_KEYS.RECIPE_COMMENTS, comments);
    }
    
    return false;
  },

  // Like a comment
  likeComment: (recipeId, commentId) => {
    const comments = safeJSONParse(localStorage.getItem(SOCIAL_STORAGE_KEYS.RECIPE_COMMENTS), {});
    
    if (comments[recipeId]) {
      const comment = comments[recipeId].find(c => c.id === commentId);
      if (comment) {
        comment.likes = (comment.likes || 0) + 1;
        return safeJSONStringify(SOCIAL_STORAGE_KEYS.RECIPE_COMMENTS, comments);
      }
    }
    
    return false;
  }
};

// Recipe Collections System
export const recipeCollectionsService = {
  // Create a new collection
  createCollection: (name, description = '', isPublic = false) => {
    if (!name.trim()) return false;
    
    const collections = safeJSONParse(localStorage.getItem(SOCIAL_STORAGE_KEYS.RECIPE_COLLECTIONS), []);
    
    const newCollection = {
      id: Date.now(),
      name: name.trim(),
      description: description.trim(),
      recipes: [],
      isPublic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: getUserProfile().name || 'Anonymous Chef',
      userId: getUserId(),
      views: 0,
      likes: 0
    };
    
    collections.unshift(newCollection);
    return safeJSONStringify(SOCIAL_STORAGE_KEYS.RECIPE_COLLECTIONS, collections);
  },

  // Get all collections
  getCollections: () => {
    return safeJSONParse(localStorage.getItem(SOCIAL_STORAGE_KEYS.RECIPE_COLLECTIONS), []);
  },

  // Get collection by ID
  getCollection: (collectionId) => {
    const collections = recipeCollectionsService.getCollections();
    return collections.find(c => c.id === collectionId) || null;
  },

  // Add recipe to collection
  addRecipeToCollection: (collectionId, recipe) => {
    const collections = recipeCollectionsService.getCollections();
    const collection = collections.find(c => c.id === collectionId);
    
    if (collection && collection.userId === getUserId()) {
      // Check if recipe already exists in collection
      if (!collection.recipes.find(r => r.id === recipe.id)) {
        collection.recipes.push({
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          totalTime: recipe.totalTime,
          difficulty: recipe.difficulty,
          addedAt: new Date().toISOString()
        });
        collection.updatedAt = new Date().toISOString();
        
        return safeJSONStringify(SOCIAL_STORAGE_KEYS.RECIPE_COLLECTIONS, collections);
      }
    }
    
    return false;
  },

  // Remove recipe from collection
  removeRecipeFromCollection: (collectionId, recipeId) => {
    const collections = recipeCollectionsService.getCollections();
    const collection = collections.find(c => c.id === collectionId);
    
    if (collection && collection.userId === getUserId()) {
      collection.recipes = collection.recipes.filter(r => r.id !== recipeId);
      collection.updatedAt = new Date().toISOString();
      
      return safeJSONStringify(SOCIAL_STORAGE_KEYS.RECIPE_COLLECTIONS, collections);
    }
    
    return false;
  },

  // Delete collection
  deleteCollection: (collectionId) => {
    const collections = recipeCollectionsService.getCollections();
    const filteredCollections = collections.filter(c => 
      c.id !== collectionId || c.userId === getUserId()
    );
    
    return safeJSONStringify(SOCIAL_STORAGE_KEYS.RECIPE_COLLECTIONS, filteredCollections);
  },

  // Get public collections (simulated community collections)
  getPublicCollections: () => {
    const userCollections = recipeCollectionsService.getCollections().filter(c => c.isPublic);
    
    // Add some sample public collections for demo
    const sampleCollections = [
      {
        id: 'sample-1',
        name: 'Quick Weeknight Dinners',
        description: 'Fast and easy recipes for busy weeknights',
        recipes: [],
        isPublic: true,
        author: 'Chef Maria',
        views: 234,
        likes: 45,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'sample-2',
        name: 'Healthy Breakfast Ideas',
        description: 'Nutritious ways to start your day',
        recipes: [],
        isPublic: true,
        author: 'NutritionGuru',
        views: 156,
        likes: 32,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    return [...userCollections, ...sampleCollections];
  }
};

// Social Media Sharing Service
export const socialMediaService = {
  // Generate shareable link for recipe
  generateShareableLink: (recipe) => {
    const baseUrl = window.location.origin;
    const recipeData = encodeURIComponent(JSON.stringify({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description
    }));
    
    return `${baseUrl}/shared-recipe?data=${recipeData}`;
  },

  // Share to Facebook
  shareToFacebook: (recipe) => {
    const url = socialMediaService.generateShareableLink(recipe);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(`Check out this amazing recipe: ${recipe.title}!`)}`;
    
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    return true;
  },

  // Share to Twitter
  shareToTwitter: (recipe) => {
    const url = socialMediaService.generateShareableLink(recipe);
    const text = `Just discovered this amazing recipe: ${recipe.title}! 🍽️ #RecipeGenerator #Cooking`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    return true;
  },

  // Share to Pinterest
  shareToPinterest: (recipe) => {
    const url = socialMediaService.generateShareableLink(recipe);
    const description = `${recipe.title} - ${recipe.description}`;
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(description)}`;
    
    window.open(pinterestUrl, '_blank', 'width=600,height=400');
    return true;
  },

  // Share via email
  shareViaEmail: (recipe) => {
    const url = socialMediaService.generateShareableLink(recipe);
    const subject = `Check out this recipe: ${recipe.title}`;
    const body = `Hi!\n\nI found this amazing recipe and thought you might like it:\n\n${recipe.title}\n${recipe.description}\n\nYou can view the full recipe here: ${url}\n\nHappy cooking!\n`;
    
    const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = emailUrl;
    return true;
  }
};

// Advanced Export Service
export const advancedExportService = {
  // Export recipe as PDF (simulated)
  exportAsPDF: async (recipe) => {
    try {
      // In a real app, you'd use a library like jsPDF
      const content = generatePDFContent(recipe);
      
      // Simulate PDF generation
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      return false;
    }
  },

  // Generate shopping list from recipe
  generateShoppingList: (recipe) => {
    let shoppingList = `Shopping List for: ${recipe.title}\n`;
    shoppingList += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    shoppingList += `INGREDIENTS NEEDED:\n`;
    shoppingList += `${'='.repeat(30)}\n\n`;
    
    recipe.ingredients.forEach((ingredient, index) => {
      if (typeof ingredient === 'string') {
        shoppingList += `☐ ${ingredient}\n`;
      } else {
        shoppingList += `☐ ${ingredient.amount} ${ingredient.unit} ${ingredient.name}\n`;
      }
    });
    
    shoppingList += `\nServes: ${recipe.servings} people\n`;
    shoppingList += `Cooking Time: ${recipe.totalTime} minutes\n`;
    shoppingList += `\nGenerated by Leftover Recipe Generator\n`;
    
    return shoppingList;
  },

  // Export shopping list
  exportShoppingList: (recipe) => {
    try {
      const content = advancedExportService.generateShoppingList(recipe);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `shopping_list_${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error exporting shopping list:', error);
      return false;
    }
  },

  // Print recipe
  printRecipe: (recipe) => {
    const printContent = generatePrintContent(recipe);
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Recipe: ${recipe.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; }
            h2 { color: #666; margin-top: 20px; }
            .recipe-meta { background: #f5f5f5; padding: 10px; margin: 10px 0; }
            .ingredients, .instructions { margin: 15px 0; }
            .ingredient { margin: 5px 0; }
            .instruction { margin: 10px 0; padding-left: 20px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    
    return true;
  }
};

// User Profile Management
export const userProfileService = {
  // Get or create user profile
  getUserProfile: () => {
    const profile = safeJSONParse(localStorage.getItem(SOCIAL_STORAGE_KEYS.USER_PROFILE), {});
    
    if (!profile.id) {
      // Create default profile
      const defaultProfile = {
        id: getUserId(),
        name: '',
        email: '',
        bio: '',
        favoriteIngredients: [],
        cookingLevel: 'beginner',
        dietaryPreferences: [],
        createdAt: new Date().toISOString(),
        recipesShared: 0,
        recipesRated: 0
      };
      
      safeJSONStringify(SOCIAL_STORAGE_KEYS.USER_PROFILE, defaultProfile);
      return defaultProfile;
    }
    
    return profile;
  },

  // Update user profile
  updateProfile: (updates) => {
    const profile = userProfileService.getUserProfile();
    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return safeJSONStringify(SOCIAL_STORAGE_KEYS.USER_PROFILE, updatedProfile);
  }
};

// Helper functions
const getUserId = () => {
  let userId = localStorage.getItem('leftover_generator_user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('leftover_generator_user_id', userId);
  }
  return userId;
};

const getUserProfile = () => {
  return userProfileService.getUserProfile();
};

const generateSampleComments = (recipeId) => {
  const sampleComments = [
    {
      id: 'sample-1',
      comment: 'This recipe turned out amazing! My family loved it.',
      author: 'FoodLover123',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 5,
      userId: 'sample-user-1'
    },
    {
      id: 'sample-2',
      comment: 'Great use of leftover ingredients. Very creative!',
      author: 'ChefMike',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 3,
      userId: 'sample-user-2'
    }
  ];
  
  return sampleComments.slice(0, Math.floor(Math.random() * 3));
};

const generatePDFContent = (recipe) => {
  return `
RECIPE: ${recipe.title.toUpperCase()}
${'='.repeat(50)}

Description: ${recipe.description}

Prep Time: ${recipe.timing?.prep || 'N/A'} minutes
Cook Time: ${recipe.timing?.cook || 'N/A'} minutes
Total Time: ${recipe.totalTime} minutes
Servings: ${recipe.servings}
Difficulty: ${recipe.difficulty}

INGREDIENTS:
${'-'.repeat(20)}
${recipe.ingredients.map((ing, i) => 
  typeof ing === 'string' 
    ? `${i + 1}. ${ing}`
    : `${i + 1}. ${ing.amount} ${ing.unit} ${ing.name}`
).join('\n')}

INSTRUCTIONS:
${'-'.repeat(20)}
${recipe.instructions.map((inst, i) => 
  `${i + 1}. ${typeof inst === 'string' ? inst : inst.instruction}`
).join('\n\n')}

${recipe.nutrition ? `
NUTRITION (per serving):
${'-'.repeat(20)}
Calories: ${recipe.nutrition.calories}
Protein: ${recipe.nutrition.protein}g
Carbs: ${recipe.nutrition.carbs}g
Fat: ${recipe.nutrition.fat}g
Fiber: ${recipe.nutrition.fiber}g
` : ''}

Generated by Leftover Recipe Generator
${new Date().toLocaleDateString()}
  `.trim();
};

const generatePrintContent = (recipe) => {
  return `
    <h1>${recipe.title}</h1>
    <div class="recipe-meta">
      <strong>Description:</strong> ${recipe.description}<br>
      <strong>Total Time:</strong> ${recipe.totalTime} minutes<br>
      <strong>Servings:</strong> ${recipe.servings}<br>
      <strong>Difficulty:</strong> ${recipe.difficulty}
    </div>
    
    <h2>Ingredients</h2>
    <div class="ingredients">
      ${recipe.ingredients.map(ing => 
        `<div class="ingredient">• ${typeof ing === 'string' ? ing : `${ing.amount} ${ing.unit} ${ing.name}`}</div>`
      ).join('')}
    </div>
    
    <h2>Instructions</h2>
    <div class="instructions">
      ${recipe.instructions.map((inst, i) => 
        `<div class="instruction">${i + 1}. ${typeof inst === 'string' ? inst : inst.instruction}</div>`
      ).join('')}
    </div>
    
    ${recipe.nutrition ? `
    <h2>Nutrition (per serving)</h2>
    <div class="nutrition">
      Calories: ${recipe.nutrition.calories} | 
      Protein: ${recipe.nutrition.protein}g | 
      Carbs: ${recipe.nutrition.carbs}g | 
      Fat: ${recipe.nutrition.fat}g
    </div>
    ` : ''}
  `;
};

export default {
  recipeRatingService,
  recipeCommentsService,
  recipeCollectionsService,
  socialMediaService,
  advancedExportService,
  userProfileService
}; 