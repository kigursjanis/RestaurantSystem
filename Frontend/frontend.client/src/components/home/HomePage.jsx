import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="sidebar">
                <div className="profile-section">
                    {/* Profile picture and name will go here */}
                </div>
                <nav className="main-nav">
                    <button onClick={() => navigate('/restaurants')}>Restaurants</button>
                    <button>Friends</button>
                    <button>Messages</button>
                    {/* Add more navigation items as needed */}
                </nav>
            </div>

            <main className="main-content">
                <div className="feed-section">
                    <h2>Recent Activity</h2>
                    {/* Feed content will go here */}
                </div>

                <div className="friends-section">
                    <h2>Friends</h2>
                    {/* Friends list will go here */}
                </div>
            </main>
        </div>
    );
};

export default HomePage;