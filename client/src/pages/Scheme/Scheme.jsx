import React, { useEffect, useState } from 'react';
import './Scheme.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const SchemeDetails = () => {
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { schemeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        setLoading(true);
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/user/scheme/${schemeId}`;
        const { data } = await axios.get(url);
        setScheme(data.data);
      } catch (error) {
        console.error("Error fetching scheme:", error);
        setError('Failed to load scheme details');
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [schemeId]);

  // Loading state
  if (loading) {
    return (
      <div className='scheme-page'>
        <div className="scheme-details-container">
          <div className="loading-container">
            <p>Loading scheme details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='scheme-page'>
        <div className="scheme-details-container">
          <div className="error-container">
            <p>{error}</p>
            <button onClick={() => navigate('/schemes')}>Back to Schemes</button>
          </div>
        </div>
      </div>
    );
  }

  // No scheme found
  if (!scheme) {
    return (
      <div className='scheme-page'>
        <div className="scheme-details-container">
          <div className="no-data-container">
            <p>Scheme not found</p>
            <button onClick={() => navigate('/schemes')}>Back to Schemes</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='scheme-page'>
      <div className="scheme-details-container">
        <header className="scheme-header">
          <button className="back-button" onClick={() => navigate('/schemes')}>
            <span className="back-arrow">←</span>
            Back to Schemes
          </button>
          <div className="scheme-type-badge">
            <span className={`scheme-type ${scheme.schemeType?.toLowerCase()}`}>
              {scheme.schemeType || 'General'} Scheme
            </span>
          </div>
        </header>

        <div className="scheme-content">
          <div className="scheme-image-section">
            <img 
              src={scheme.imageUrl} 
              alt={scheme.title || 'Scheme image'}
              className="scheme-image"

            />
          </div>

          <div className="scheme-info">
            <h1 className="scheme-title">{scheme.title}</h1>

            <div className="scheme-short-desc">
              <p>{scheme.shortdes}</p>
            </div>

            <div className="scheme-dates">
              <div className="date-item">
                <span className="date-label">Launch Date:</span>
                <span className="date-value">{scheme.launchDate.slice(0,10)}</span>
              </div>
              <div className="date-item">
                <span className="date-label">Deadline:</span>
                <span className="date-value deadline">{scheme.deadLine.slice(0,10)}</span>
              </div>
            </div>

            <div className="scheme-section">
              <h2>Full Description</h2>
              <div className="full-description">
                <p>{scheme.fullDescription}</p>
              </div>
            </div>

            <div className="scheme-section">
              <h2>Eligibility Criteria</h2>
              <div className="eligibility">
                <p>{scheme.eligibility}</p>
              </div>
            </div>

            <div className="scheme-section">
              <h2>Benefits</h2>
              <div className="benefits">
                <p>{scheme.benefits}</p>
              </div>
            </div>

            <div className="contact-section">
              <h2>Contact Information</h2>
              <div className="contact-info">
                <div className="helpline">
                  <span className="contact-label">Helpline:</span>
                  <a href={scheme.contactInfo} className="helpline-number">
                    {scheme.contactInfo || scheme.helpline || 'Contact information not available'}
                  </a>
                </div>
              </div>
            </div>

            <div className="action-section">
              <button 
                className="apply-button"
                disabled={!scheme.applyLink}
              >
                {scheme.applyLink ? 'Apply Now' : 'Application Link Not Available'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetails;
