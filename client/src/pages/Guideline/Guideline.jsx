
import React, { useEffect, useState } from 'react';
import './Guideline.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { assets } from '../../assets/assets';

const Guideline = () => {
  const [guideline, setGuideline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { guidelineId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuideline = async () => {
      try {
        setLoading(true);
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/user/guideline/${guidelineId}`;
        const { data } = await axios.get(url);
        setGuideline(data.data);
      } catch (error) {
        console.error("Error fetching guideline:", error);
        setError('Failed to load guideline details');
      } finally {
        setLoading(false);
      }
    };

    fetchGuideline();
  }, [guidelineId]);

  // Loading state
  if (loading) {
    return (
      <div className="guideline-page">
        <div className="guideline-details-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading guideline details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="guideline-page">
        <div className="guideline-details-container">
          <div className="error-state">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/guidelines')} className="back-button">
              <span className="back-arrow">←</span>
              Back to Guidelines
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No guideline found
  if (!guideline) {
    return (
      <div className="guideline-page">
        <div className="guideline-details-container">
          <div className="no-guideline">
            <h2>Guideline not found</h2>
            <p>The requested guideline could not be found.</p>
            <button onClick={() => navigate('/guidelines')} className="back-button">
              <span className="back-arrow">←</span>
              Back to Guidelines
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'crop management': return '🌱';
      case 'pest control': return '🛡️';
      case 'soil health': return '🌍';
      case 'irrigation': return '💧';
      case 'fertilizer': return '🧪';
      case 'harvesting': return '🌾';
      case 'storage': return '📦';
      case 'marketing': return '💰';
      default: return '📋';
    }
  };

  const getCategoryColor = (category) => {
    switch(category?.toLowerCase()) {
      case 'crop management': return '#4CAF50';
      case 'pest control': return '#FF5722';
      case 'soil health': return '#8D6E63';
      case 'irrigation': return '#2196F3';
      case 'fertilizer': return '#9C27B0';
      case 'harvesting': return '#FF9800';
      case 'storage': return '#607D8B';
      case 'marketing': return '#4CAF50';
      default: return '#2E7D32';
    }
  };

  return (
    <div className="guideline-page">
      <div className="guideline-details-container">
        <header className="guideline-header">
          <button 
            className="back-button" 
            onClick={() => navigate('/guidelines')}
          >
            <span className="back-arrow">←</span>
            Back to Guidelines
          </button>
          <div className="guideline-category-badge">
            <span 
              className="category-badge"
              style={{ backgroundColor: getCategoryColor(guideline.category) }}
            >
              {getCategoryIcon(guideline.category)} {guideline.category}
            </span>
          </div>
        </header>

        <div className="guideline-content">
          <div className="guideline-image-section">
            <img 
              src={guideline.imageUrl || assets.test} 
              alt={guideline.title}
              className="guideline-image"
              onError={(e) => {
                e.target.src = '/api/placeholder/800/400';
              }}
            />
          </div>

          <div className="guideline-info">
            <h1 className="guideline-title">{guideline.title}</h1>

            <div className="guideline-meta">
              <div className="meta-item">
                <span className="meta-label">Published:</span>
                <span className="meta-value">{formatDate(guideline.publishDate)}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Author:</span>
                <span className="meta-value">{guideline.author}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{guideline.category}</span>
              </div>
            </div>

            <div className="guideline-short-desc">
              <h2>Overview</h2>
              <p>{guideline.shortDesc}</p>
            </div>

            <div className="guideline-section">
              <h2>Detailed Guidelines</h2>
              <div className="guideline-content-area">
                <div 
                  className="content-html"
                  dangerouslySetInnerHTML={{ __html: guideline.content }}
                />
              </div>
            </div>

            <div className="guideline-footer">
              <div className="guidelines-actions">
                <button 
                  className="print-button"
                  onClick={() => window.print()}
                >
                  <span>🖨️</span>
                  Print Guidelines
                </button>

                <button 
                  className="share-button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: guideline.title,
                        text: guideline.shortDesc,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                >
                  <span>📤</span>
                  Share
                </button>
              </div>

              <div className="related-note">
                <p>
                  <strong>Note:</strong> These guidelines are provided for educational purposes. 
                  Always consult with local agricultural experts for region-specific advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guideline;
