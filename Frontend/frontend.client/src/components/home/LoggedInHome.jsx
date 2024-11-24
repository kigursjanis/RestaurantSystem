import React from 'react';

const LoggedInHome = () => {
    return (
        <div className="logged-in-container">
            <div className="feed-section">
                <div className="feed-filters">
                    <button className="active">FOLLOWING</button>
                    <button>POPULAR</button>
                    <button>NEW RELEASES</button>
                </div>

                <div className="review-feed">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="review-card">
                            <div className="review-header">
                                <img src="https://placeholder.com/30x30" alt="User" />
                                <span className="username">User Name</span>
                                <span className="review-date">2 hours ago</span>
                            </div>
                            <div className="review-content">
                                <div className="restaurant-poster"></div>
                                <div className="review-text">
                                    <h4>Restaurant Name</h4>
                                    <div className="rating">★★★★☆</div>
                                    <p>Great experience! The food was amazing...</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sidebar">
                <div className="watchlist">
                    <h3>Restaurants to Try</h3>
                    {/* Watchlist items */}
                </div>
                <div className="recent-reviews">
                    <h3>Recent Reviews</h3>
                    {/* Recent reviews */}
                </div>
            </div>
        </div>
    );
};

export default LoggedInHome;