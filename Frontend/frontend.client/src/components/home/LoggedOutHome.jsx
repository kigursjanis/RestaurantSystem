import React from 'react';
import './LoggedOutHome.css';

const LoggedOutHome = () => {
    return (
        <div className="logged-out-container">
            <div className="hero-section">
                <h1 className="main-title">Track, Rate, and Share Your Restaurant Experiences</h1>
                <div className="features">
                    <p className="feature-text">Track restaurants you've visited.</p>
                    <p className="feature-text">Save those you want to try.</p>
                    <p className="feature-text">Tell your friends what's good.</p>
                </div>
                <div className="stats-section">
                    <div className="stat-item">
                        <span className="stat-number">10M+</span>
                        <span className="stat-label">REVIEWS</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">25K+</span>
                        <span className="stat-label">RESTAURANTS</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">500K+</span>
                        <span className="stat-label">MEMBERS</span>
                    </div>
                </div>
                <div className="featured-section">
                    <h2>Popular Right Now</h2>
                    <div className="featured-restaurants">
                        {/* Placeholder for featured restaurants */}
                        <div className="restaurant-card">
                            <img src="https://via.placeholder.com/200x150" alt="Restaurant 1" />
                            <h3>Restaurant Name</h3>
                            <p>⭐ 4.5 • Italian • $$</p>
                        </div>
                        <div className="restaurant-card">
                            <img src="https://via.placeholder.com/200x150" alt="Restaurant 2" />
                            <h3>Restaurant Name</h3>
                            <p>⭐ 4.3 • Japanese • $$$</p>
                        </div>
                        <div className="restaurant-card">
                            <img src="https://via.placeholder.com/200x150" alt="Restaurant 3" />
                            <h3>Restaurant Name</h3>
                            <p>⭐ 4.7 • French • $$$$</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoggedOutHome;