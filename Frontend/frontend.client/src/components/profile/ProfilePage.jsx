import React, { useState, useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import AuthModal from '../auth/AuthModal';
import UserMenu from '../nav/UserMenu';
import ThemeToggle from '../nav/ThemeToggle';
import './ProfilePage.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userReviews, setUserReviews] = useState([]);
    const [activeTab, setActiveTab] = useState('PROFILE');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalView, setAuthModalView] = useState('signin');
    const { username } = useParams();
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const isOwnProfile = currentUser?.username === username;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/users/${username}`);
                const data = await response.json();
                setProfile(data);
                
                // Use the user's ID to fetch their reviews
                console.log('Fetching reviews for user ID:', data.id);
                const reviewsResponse = await fetch(`http://localhost:3000/api/users/${data.id}/reviews`);
                if (!reviewsResponse.ok) throw new Error('Failed to fetch reviews');
                const reviewsData = await reviewsResponse.json();
                console.log('Received reviews:', reviewsData);
                setUserReviews(reviewsData);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            const response = await fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete review');

            // Remove the deleted review from state
            setUserReviews(prev => prev.filter(review => review.id !== reviewId));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const handleAuthSuccess = (userData) => {
        setProfile(userData);
        setShowAuthModal(false);
    };

    const handleSignOut = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="letterboxd-style">
            <nav className="main-nav">
                <div className="nav-container">
                    <div className="nav-left">
                        <div className="logo-title" onClick={() => navigate('/')}>
                            <img
                                src="https://i.imgur.com/xmN7e0V.png"
                                alt="PlateRate Logo"
                                className="logo"
                            />
                            <h1>PlateRate</h1>
                        </div>
                        <ul className="nav-items">
                            <li>
                                <UserMenu user={currentUser} onLogout={handleSignOut} />
                            </li>
                            <li onClick={() => navigate('/restaurants')}>RESTAURANTS</li>
                            <li>REVIEWS</li>
                            <li>LISTS</li>
                            <li>MEMBERS</li>
                        </ul>
                    </div>
                    <div className="nav-right">
                        <ThemeToggle />
                        <button className="add-review">+ ADD REVIEW</button>
                    </div>
                </div>
            </nav>

            <div className="profile-page">
                <div className="profile-header">
                    <div className="profile-cover"></div>
                    <div className="profile-info">
                        <img
                            src={profile?.profile_picture_url || "https://via.placeholder.com/150"}
                            alt="Profile"
                            className="profile-picture"
                        />
                        <h1>{profile?.username}</h1>
                        <div className="profile-stats">
                            <div className="stat">
                                <span className="stat-number">{userReviews.length}</span>
                                <span className="stat-label">REVIEWS</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">0</span>
                                <span className="stat-label">LISTS</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">0</span>
                                <span className="stat-label">FOLLOWING</span>
                            </div>
                            <div className="stat">
                                <span className="stat-number">0</span>
                                <span className="stat-label">FOLLOWERS</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-content">
                    <div className="profile-nav">
                        <button 
                            className={activeTab === 'PROFILE' ? 'active' : ''}
                            onClick={() => setActiveTab('PROFILE')}
                        >
                            PROFILE
                        </button>
                        <button 
                            className={activeTab === 'REVIEWS' ? 'active' : ''}
                            onClick={() => setActiveTab('REVIEWS')}
                        >
                            REVIEWS
                        </button>
                        <button 
                            className={activeTab === 'LISTS' ? 'active' : ''}
                            onClick={() => setActiveTab('LISTS')}
                        >
                            LISTS
                        </button>
                        <button 
                            className={activeTab === 'LIKES' ? 'active' : ''}
                            onClick={() => setActiveTab('LIKES')}
                        >
                            LIKES
                        </button>
                    </div>

                    <div className="recent-activity">
                        <h2>Recent Activity</h2>
                        <div className="activity-feed">
                            {userReviews.length > 0 ? (
                                userReviews.map(review => (
                                    <div key={review.id} className="review-card">
                                        <div className="review-header">
                                            <img 
                                                src={review.restaurant_image} 
                                                alt={review.restaurant_name}
                                                className="restaurant-thumbnail"
                                            />
                                            <div className="review-info">
                                                <h3>{review.restaurant_name}</h3>
                                                <div className="review-meta">
                                                    <span className="rating">★ {review.rating}</span>
                                                    <span className="review-date">
                                                        {format(new Date(review.created_at), 'PPP')}
                                                    </span>
                                                </div>
                                            </div>
                                            {isOwnProfile && (
                                                <button 
                                                    className="delete-review"
                                                    onClick={() => handleDeleteReview(review.id)}
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                        <p className="review-text">{review.review_text}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="main-footer">
                <div className="footer-content">
                    <div className="footer-links">
                        <a href="/about">About</a>
                        <a href="/terms">Terms</a>
                        <a href="/privacy">Privacy</a>
                    </div>
                    <div className="footer-copyright">
                        © 2024 PlateRate
                    </div>
                </div>
            </footer>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialView={authModalView}
                onAuthSuccess={handleAuthSuccess}
            />
        </div>
    );
};

export default ProfilePage;