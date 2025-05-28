import React, { useState, useEffect } from 'react';
import {
  recipeRatingService,
  recipeCommentsService,
  recipeCollectionsService,
  socialMediaService,
  advancedExportService,
  userProfileService
} from '../services/socialService';
import './SocialFeatures.css';

const SocialFeatures = ({ recipe, onClose }) => {
  const [activeTab, setActiveTab] = useState('rating');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    loadSocialData();
  }, [recipe.id]);

  const loadSocialData = () => {
    // Load user rating
    const userRating = recipeRatingService.getRecipeRating(recipe.id);
    if (userRating) {
      setRating(userRating.rating);
      setReview(userRating.review);
    }

    // Load average rating
    const avgRating = recipeRatingService.getAverageRating(recipe.id);
    setAverageRating(avgRating);

    // Load comments
    const recipeComments = recipeCommentsService.getRecipeComments(recipe.id);
    setComments(recipeComments);

    // Load collections
    const userCollections = recipeCollectionsService.getCollections();
    setCollections(userCollections);

    // Load user profile
    const profile = userProfileService.getUserProfile();
    setUserProfile(profile);
  };

  const handleRating = (newRating) => {
    setRating(newRating);
    recipeRatingService.rateRecipe(recipe.id, newRating, review);
    loadSocialData(); // Refresh data
  };

  const handleReviewSubmit = () => {
    if (rating > 0) {
      recipeRatingService.rateRecipe(recipe.id, rating, review);
      loadSocialData();
    }
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      recipeCommentsService.addComment(recipe.id, newComment);
      setNewComment('');
      loadSocialData();
    }
  };

  const handleCommentLike = (commentId) => {
    recipeCommentsService.likeComment(recipe.id, commentId);
    loadSocialData();
  };

  const handleCommentDelete = (commentId) => {
    recipeCommentsService.deleteComment(recipe.id, commentId);
    loadSocialData();
  };

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      recipeCollectionsService.createCollection(
        newCollectionName,
        newCollectionDescription,
        false
      );
      setNewCollectionName('');
      setNewCollectionDescription('');
      setShowNewCollection(false);
      loadSocialData();
    }
  };

  const handleAddToCollection = (collectionId) => {
    recipeCollectionsService.addRecipeToCollection(collectionId, recipe);
    loadSocialData();
  };

  const handleShare = (platform) => {
    switch (platform) {
      case 'facebook':
        socialMediaService.shareToFacebook(recipe);
        break;
      case 'twitter':
        socialMediaService.shareToTwitter(recipe);
        break;
      case 'pinterest':
        socialMediaService.shareToPinterest(recipe);
        break;
      case 'email':
        socialMediaService.shareViaEmail(recipe);
        break;
      default:
        break;
    }
    setShowShareMenu(false);
  };

  const handleExport = async (format) => {
    switch (format) {
      case 'pdf':
        await advancedExportService.exportAsPDF(recipe);
        break;
      case 'shopping':
        advancedExportService.exportShoppingList(recipe);
        break;
      case 'print':
        advancedExportService.printRecipe(recipe);
        break;
      default:
        break;
    }
    setShowExportMenu(false);
  };

  const renderStars = (currentRating, onStarClick = null, size = 'medium') => {
    const stars = [];
    const starSize = size === 'large' ? '24px' : size === 'small' ? '16px' : '20px';
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= currentRating ? 'filled' : 'empty'} ${onStarClick ? 'clickable' : ''}`}
          style={{ fontSize: starSize }}
          onClick={() => onStarClick && onStarClick(i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="social-features-overlay">
      <div className="social-features-modal">
        <div className="social-features-header">
          <h2>Social Features</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="recipe-summary">
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
          {averageRating && (
            <div className="average-rating">
              <div className="stars">
                {renderStars(Math.round(averageRating.average), null, 'small')}
              </div>
              <span className="rating-text">
                {averageRating.average} ({averageRating.count} ratings)
              </span>
            </div>
          )}
        </div>

        <div className="social-tabs">
          <button
            className={`tab ${activeTab === 'rating' ? 'active' : ''}`}
            onClick={() => setActiveTab('rating')}
          >
            Rate & Review
          </button>
          <button
            className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            Comments ({comments.length})
          </button>
          <button
            className={`tab ${activeTab === 'collections' ? 'active' : ''}`}
            onClick={() => setActiveTab('collections')}
          >
            Collections
          </button>
          <button
            className={`tab ${activeTab === 'share' ? 'active' : ''}`}
            onClick={() => setActiveTab('share')}
          >
            Share & Export
          </button>
        </div>

        <div className="social-content">
          {activeTab === 'rating' && (
            <div className="rating-section">
              <h4>Rate this Recipe</h4>
              <div className="rating-input">
                <div className="stars-input">
                  {renderStars(rating, handleRating, 'large')}
                </div>
                <span className="rating-label">
                  {rating === 0 ? 'Click to rate' : `${rating} star${rating !== 1 ? 's' : ''}`}
                </span>
              </div>

              <div className="review-input">
                <h5>Write a Review (Optional)</h5>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your thoughts about this recipe..."
                  rows="4"
                />
                <button
                  className="submit-review-btn"
                  onClick={handleReviewSubmit}
                  disabled={rating === 0}
                >
                  Submit Rating & Review
                </button>
              </div>

              {rating > 0 && (
                <div className="user-rating-display">
                  <h5>Your Rating</h5>
                  <div className="user-rating">
                    <div className="stars">
                      {renderStars(rating, null, 'medium')}
                    </div>
                    {review && <p className="user-review">"{review}"</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="comments-section">
              <div className="add-comment">
                <h4>Add a Comment</h4>
                <div className="comment-input">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your cooking tips or experience..."
                    rows="3"
                  />
                  <button
                    className="submit-comment-btn"
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim()}
                  >
                    Post Comment
                  </button>
                </div>
              </div>

              <div className="comments-list">
                <h4>Comments</h4>
                {comments.length === 0 ? (
                  <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-date">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="comment-text">{comment.comment}</p>
                      <div className="comment-actions">
                        <button
                          className="like-btn"
                          onClick={() => handleCommentLike(comment.id)}
                        >
                          👍 {comment.likes || 0}
                        </button>
                        {comment.userId === userProfile?.id && (
                          <button
                            className="delete-btn"
                            onClick={() => handleCommentDelete(comment.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'collections' && (
            <div className="collections-section">
              <h4>Add to Collection</h4>
              
              <div className="collections-list">
                {collections.length === 0 ? (
                  <p className="no-collections">No collections yet. Create your first collection!</p>
                ) : (
                  collections.map((collection) => (
                    <div key={collection.id} className="collection-item">
                      <div className="collection-info">
                        <h5>{collection.name}</h5>
                        <p>{collection.description}</p>
                        <span className="collection-meta">
                          {collection.recipes.length} recipes • Created {formatDate(collection.createdAt)}
                        </span>
                      </div>
                      <button
                        className="add-to-collection-btn"
                        onClick={() => handleAddToCollection(collection.id)}
                        disabled={collection.recipes.some(r => r.id === recipe.id)}
                      >
                        {collection.recipes.some(r => r.id === recipe.id) ? 'Added' : 'Add Recipe'}
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="create-collection">
                {!showNewCollection ? (
                  <button
                    className="create-collection-btn"
                    onClick={() => setShowNewCollection(true)}
                  >
                    + Create New Collection
                  </button>
                ) : (
                  <div className="new-collection-form">
                    <h5>Create New Collection</h5>
                    <input
                      type="text"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="Collection name"
                    />
                    <textarea
                      value={newCollectionDescription}
                      onChange={(e) => setNewCollectionDescription(e.target.value)}
                      placeholder="Description (optional)"
                      rows="2"
                    />
                    <div className="form-actions">
                      <button
                        className="create-btn"
                        onClick={handleCreateCollection}
                        disabled={!newCollectionName.trim()}
                      >
                        Create
                      </button>
                      <button
                        className="cancel-btn"
                        onClick={() => {
                          setShowNewCollection(false);
                          setNewCollectionName('');
                          setNewCollectionDescription('');
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div className="share-section">
              <div className="share-options">
                <h4>Share Recipe</h4>
                <div className="share-buttons">
                  <button
                    className="share-btn facebook"
                    onClick={() => handleShare('facebook')}
                  >
                    📘 Facebook
                  </button>
                  <button
                    className="share-btn twitter"
                    onClick={() => handleShare('twitter')}
                  >
                    🐦 Twitter
                  </button>
                  <button
                    className="share-btn pinterest"
                    onClick={() => handleShare('pinterest')}
                  >
                    📌 Pinterest
                  </button>
                  <button
                    className="share-btn email"
                    onClick={() => handleShare('email')}
                  >
                    📧 Email
                  </button>
                </div>
              </div>

              <div className="export-options">
                <h4>Export Recipe</h4>
                <div className="export-buttons">
                  <button
                    className="export-btn"
                    onClick={() => handleExport('pdf')}
                  >
                    📄 Export as PDF
                  </button>
                  <button
                    className="export-btn"
                    onClick={() => handleExport('shopping')}
                  >
                    🛒 Shopping List
                  </button>
                  <button
                    className="export-btn"
                    onClick={() => handleExport('print')}
                  >
                    🖨️ Print Recipe
                  </button>
                </div>
              </div>

              <div className="shareable-link">
                <h4>Shareable Link</h4>
                <div className="link-container">
                  <input
                    type="text"
                    value={socialMediaService.generateShareableLink(recipe)}
                    readOnly
                    className="shareable-link-input"
                  />
                  <button
                    className="copy-link-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(socialMediaService.generateShareableLink(recipe));
                      alert('Link copied to clipboard!');
                    }}
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialFeatures; 