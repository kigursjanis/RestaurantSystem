import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const LoggedInHome = () => {
    const [activeTab, setActiveTab] = useState('POPULAR');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (activeTab === 'POPULAR') {
            fetchAllReviews();
        }
    }, [activeTab]);

    const fetchAllReviews = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/reviews');
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="logged-in-container">
            <div className="feed-section">
                <div className="feed-filters">
                    <button 
                        className={activeTab === 'POPULAR' ? 'active' : ''}
                        onClick={() => setActiveTab('POPULAR')}
                    >
                        POPULAR
                    </button>
                    <button 
                        className={activeTab === 'NEW RELEASES' ? 'active' : ''}
                        onClick={() => setActiveTab('NEW RELEASES')}
                    >
                        NEW RELEASES
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading reviews...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : (
                    <div className="review-feed">
                        {reviews.map((review) => (
                            <div key={review.id} className="review-card">
                                <div className="review-header">
                                    <img 
                                        src={review.profile_picture_url} 
                                        alt={review.username}
                                        className="profile-pic"
                                    />
                                    <div className="review-meta">
                                        <span className="username">{review.username}</span>
                                        <span className="review-date">
                                            {format(new Date(review.created_at), 'PPP')}
                                        </span>
                                    </div>
                                </div>
                                <div className="review-content">
                                    <img 
                                        className="restaurant-poster"
                                        src={review.restaurant_image}
                                        alt={review.restaurant_name}
                                    />
                                    <div className="review-details">
                                        <h4 className="restaurant-name">{review.restaurant_name}</h4>
                                        <div className="rating">Rating: {review.rating} ★</div>
                                        <p className="review-text">{review.review_text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="sidebar">
                <div className="watchlist">
                    <h3>Restaurants to Try</h3>
                    <p>Coming soon: Restaurant watchlist</p>
                </div>
                <div className="recent-reviews">
                    <h3>Recent Reviews</h3>
                    <p>Coming soon: Recent reviews</p>
                </div>
            </div>
        </div>
    );
};

export default LoggedInHome;