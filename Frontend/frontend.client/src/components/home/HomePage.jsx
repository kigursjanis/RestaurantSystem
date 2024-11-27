import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import AuthModal from '../auth/AuthModal';
import ReviewModal from '../reviews/ReviewModal';
import LoggedOutHome from './LoggedOutHome';
import LoggedInHome from './LoggedInHome';
import UserMenu from '../nav/UserMenu';
import ThemeToggle from '../nav/ThemeToggle';

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [authModalView, setAuthModalView] = useState('signin');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);

    const handleAuthSuccess = (userData) => {
        setUser(userData);
        setIsLoggedIn(true);
        setShowAuthModal(false);
    };

    const handleSignOut = () => {
        localStorage.removeItem('user');
        setUser(null);
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <div className="letterboxd-style">
            <nav className="main-nav">
                <div className="nav-container">
                    <div className="nav-left">
                        <div className="logo-title">
                            <img
                                src="https://i.imgur.com/xmN7e0V.png"
                                alt="PlateRate Logo"
                                className="logo"
                            />
                            <h1>PlateRate</h1>
                        </div>
                        <ul className="nav-items">
                            {isLoggedIn && (
                                <li>
                                    <UserMenu user={user} onLogout={handleSignOut} />
                                </li>
                            )}
                            <li onClick={() => navigate('/restaurants')}>RESTAURANTS</li>
                            <li>REVIEWS</li>
                            <li>LISTS</li>
                            <li>MEMBERS</li>
                        </ul>
                    </div>
                    <div className="nav-right">
                        <ThemeToggle />
                        {!isLoggedIn ? (
                            <>
                                <button
                                    className="sign-in"
                                    onClick={() => {
                                        setAuthModalView('signin');
                                        setShowAuthModal(true);
                                    }}
                                >
                                    SIGN IN
                                </button>
                                <button
                                    className="create-account"
                                    onClick={() => {
                                        setAuthModalView('register');
                                        setShowAuthModal(true);
                                    }}
                                >
                                    CREATE ACCOUNT
                                </button>
                            </>
                        ) : (
                            <button 
                                className="add-review"
                                onClick={() => setShowReviewModal(true)}
                            >
                                + ADD REVIEW
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <div className="content-container">
                {isLoggedIn ? (
                    <LoggedInHome />
                ) : (
                    <LoggedOutHome />
                )}
            </div>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialView={authModalView}
                onAuthSuccess={handleAuthSuccess}
            />

            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
            />

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
        </div>
    );
};

export default HomePage;