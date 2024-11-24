import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { username } = useParams(); // This will get the username from the URL
    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // TODO: Replace with actual API call
                const response = await fetch(`http://localhost:3000/api/users/${username}`);
                const data = await response.json();
                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
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
                            <span className="stat-number">0</span>
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
                    <button className="active">PROFILE</button>
                    <button>REVIEWS</button>
                    <button>LISTS</button>
                    <button>LIKES</button>
                </div>

                <div className="recent-activity">
                    <h2>Recent Activity</h2>
                    <div className="activity-feed">
                        <p>No recent activity</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;