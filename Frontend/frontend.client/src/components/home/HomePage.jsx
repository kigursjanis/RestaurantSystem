import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import AuthModal from '../auth/AuthModal';
import LoggedOutHome from './LoggedOutHome';
import LoggedInHome from './LoggedInHome';

const HomePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalView, setAuthModalView] = useState('signin');
    const navigate = useNavigate();

    const handleAuthSuccess = (user) => {
        setIsLoggedIn(true);
        setShowAuthModal(false);
    };

    const handleSignOut = () => {
        setIsLoggedIn(false);
        // TODO: Add actual sign out logic (clear tokens, etc.)
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
                        <ul>
                            <li onClick={() => navigate('/restaurants')}>RESTAURANTS</li>
                            <li>REVIEWS</li>
                            <li>LISTS</li>
                            <li>MEMBERS</li>
                        </ul>
                    </div>
                    <div className="nav-right">
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
                            <>
                                <button className="add-review">+ ADD REVIEW</button>
                                <div className="user-menu">
                                    <img
                                        src="https://via.placeholder.com/30"
                                        alt="Profile"
                                        className="profile-pic"
                                        onClick={handleSignOut} // For demo; replace with proper menu
                                    />
                                    {/* TODO: Add dropdown menu */}
                                </div>
                            </>
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

            {/* Optional: Add footer */}
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