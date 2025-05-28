import React, { useState, useEffect } from 'react';
import { recipeCollectionsService, userProfileService } from '../services/socialService';
import './Community.css';

const Community = () => {
  const [activeTab, setActiveTab] = useState('collections');
  const [publicCollections, setPublicCollections] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = () => {
    try {
      // Load public collections
      const collections = recipeCollectionsService.getPublicCollections();
      setPublicCollections(collections || []);

      // Load user profile
      const profile = userProfileService.getUserProfile();
      setUserProfile(profile || null);
    } catch (error) {
      console.error('Error loading community data:', error);
      setPublicCollections([]);
      setUserProfile(null);
    }
  };

  const filteredCollections = publicCollections
    .filter(collection => 
      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.likes + b.views) - (a.likes + a.views);
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleLikeCollection = (collectionId) => {
    // Simulate liking a collection
    setPublicCollections(prev => 
      prev.map(collection => 
        collection.id === collectionId 
          ? { ...collection, likes: collection.likes + 1 }
          : collection
      )
    );
  };

  const handleViewCollection = (collectionId) => {
    // Simulate viewing a collection
    setPublicCollections(prev => 
      prev.map(collection => 
        collection.id === collectionId 
          ? { ...collection, views: collection.views + 1 }
          : collection
      )
    );
  };

  return (
    <div className="community-container">
      <div className="community-header">
        <div className="header-content">
          <h1>Recipe Community</h1>
          <p>Discover amazing recipes and collections shared by fellow food enthusiasts</p>
        </div>
        
        <div className="community-stats">
          <div className="stat-item">
            <span className="stat-number">{publicCollections.length}</span>
            <span className="stat-label">Collections</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {publicCollections.reduce((sum, c) => sum + c.recipes.length, 0)}
            </span>
            <span className="stat-label">Recipes</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {publicCollections.reduce((sum, c) => sum + c.views, 0)}
            </span>
            <span className="stat-label">Views</span>
          </div>
        </div>
      </div>

      <div className="community-tabs">
        <button
          className={`tab ${activeTab === 'collections' ? 'active' : ''}`}
          onClick={() => setActiveTab('collections')}
        >
          📚 Public Collections
        </button>
        <button
          className={`tab ${activeTab === 'trending' ? 'active' : ''}`}
          onClick={() => setActiveTab('trending')}
        >
          🔥 Trending
        </button>
        <button
          className={`tab ${activeTab === 'featured' ? 'active' : ''}`}
          onClick={() => setActiveTab('featured')}
        >
          ⭐ Featured Chefs
        </button>
      </div>

      <div className="community-content">
        {activeTab === 'collections' && (
          <div className="collections-tab">
            <div className="collections-controls">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search collections, authors, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
              
              <div className="sort-controls">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>

            <div className="collections-grid">
              {filteredCollections.length === 0 ? (
                <div className="no-results">
                  <p>No collections found matching your search.</p>
                </div>
              ) : (
                filteredCollections.map((collection) => (
                  <div key={collection.id} className="collection-card">
                    <div className="collection-header">
                      <h3 className="collection-title">{collection.name}</h3>
                      <div className="collection-author">
                        <span className="author-avatar">👨‍🍳</span>
                        <span className="author-name">{collection.author}</span>
                      </div>
                    </div>

                    <p className="collection-description">{collection.description}</p>

                    <div className="collection-stats">
                      <div className="stat">
                        <span className="stat-icon">📝</span>
                        <span>{collection.recipes.length} recipes</span>
                      </div>
                      <div className="stat">
                        <span className="stat-icon">👀</span>
                        <span>{collection.views} views</span>
                      </div>
                      <div className="stat">
                        <span className="stat-icon">❤️</span>
                        <span>{collection.likes} likes</span>
                      </div>
                    </div>

                    <div className="collection-meta">
                      <span className="created-date">
                        Created {formatDate(collection.createdAt)}
                      </span>
                      {collection.isPublic && (
                        <span className="public-badge">Public</span>
                      )}
                    </div>

                    <div className="collection-actions">
                      <button
                        className="view-btn"
                        onClick={() => handleViewCollection(collection.id)}
                      >
                        👁️ View Collection
                      </button>
                      <button
                        className="like-btn"
                        onClick={() => handleLikeCollection(collection.id)}
                      >
                        ❤️ Like
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'trending' && (
          <div className="trending-tab">
            <h2>🔥 Trending This Week</h2>
            
            <div className="trending-sections">
              <div className="trending-section">
                <h3>Most Popular Collections</h3>
                <div className="trending-list">
                  {publicCollections
                    .sort((a, b) => (b.likes + b.views) - (a.likes + a.views))
                    .slice(0, 5)
                    .map((collection, index) => (
                      <div key={collection.id} className="trending-item">
                        <span className="trending-rank">#{index + 1}</span>
                        <div className="trending-info">
                          <h4>{collection.name}</h4>
                          <p>by {collection.author}</p>
                          <div className="trending-stats">
                            <span>{collection.likes} likes</span>
                            <span>{collection.views} views</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="trending-section">
                <h3>Rising Stars</h3>
                <div className="rising-chefs">
                  {['Chef Maria', 'NutritionGuru', 'HomeChef123', 'VeganVibes', 'SpiceKing'].map((chef, index) => (
                    <div key={chef} className="chef-card">
                      <div className="chef-avatar">👨‍🍳</div>
                      <div className="chef-info">
                        <h4>{chef}</h4>
                        <p>{Math.floor(Math.random() * 50) + 10} recipes shared</p>
                        <p>{Math.floor(Math.random() * 1000) + 100} followers</p>
                      </div>
                      <button className="follow-btn">Follow</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'featured' && (
          <div className="featured-tab">
            <h2>⭐ Featured Chefs</h2>
            
            <div className="featured-chefs">
              <div className="chef-spotlight">
                <div className="chef-profile">
                  <div className="chef-avatar-large">👨‍🍳</div>
                  <div className="chef-details">
                    <h3>Chef Maria Rodriguez</h3>
                    <p className="chef-title">Mediterranean Cuisine Expert</p>
                    <p className="chef-bio">
                      Passionate about bringing authentic Mediterranean flavors to home kitchens. 
                      15+ years of culinary experience with a focus on healthy, seasonal ingredients.
                    </p>
                    <div className="chef-achievements">
                      <span className="achievement">🏆 Top Chef 2023</span>
                      <span className="achievement">📚 3 Cookbooks</span>
                      <span className="achievement">⭐ 4.9/5 Rating</span>
                    </div>
                  </div>
                </div>
                
                <div className="chef-collections">
                  <h4>Popular Collections</h4>
                  <div className="mini-collections">
                    <div className="mini-collection">
                      <h5>Quick Weeknight Dinners</h5>
                      <p>15 easy recipes for busy families</p>
                      <span className="collection-stats">234 views • 45 likes</span>
                    </div>
                    <div className="mini-collection">
                      <h5>Mediterranean Classics</h5>
                      <p>Traditional recipes with modern twists</p>
                      <span className="collection-stats">189 views • 38 likes</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="other-featured-chefs">
                <h4>Other Featured Chefs</h4>
                <div className="chef-grid">
                  {[
                    { name: 'NutritionGuru', specialty: 'Healthy Living', recipes: 42 },
                    { name: 'BakeQueen', specialty: 'Desserts & Pastries', recipes: 38 },
                    { name: 'SpiceMaster', specialty: 'Asian Fusion', recipes: 51 },
                    { name: 'VeganVibes', specialty: 'Plant-Based', recipes: 29 }
                  ].map((chef) => (
                    <div key={chef.name} className="featured-chef-card">
                      <div className="chef-avatar">👨‍🍳</div>
                      <h5>{chef.name}</h5>
                      <p className="chef-specialty">{chef.specialty}</p>
                      <p className="chef-recipe-count">{chef.recipes} recipes</p>
                      <button className="follow-btn">Follow</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community; 