import React from 'react';

const LoggedOutHome = () => {
    return (
        <>
            <div className="hero-section">
                <h1>Track restaurants you've visited.</h1>
                <h2>Save those you want to try.</h2>
                <h3>Tell your friends what's good.</h3>
            </div>

            <div className="popular-section">
                <h2>Popular restaurants this week</h2>
                <div className="restaurant-grid">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="restaurant-card">
                            <div className="restaurant-poster"></div>
                            <h3>Restaurant Name</h3>
                            <div className="rating">★★★★☆</div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default LoggedOutHome;