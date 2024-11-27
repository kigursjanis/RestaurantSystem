import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../auth/AuthModal';
import UserMenu from '../nav/UserMenu';
import ThemeToggle from '../nav/ThemeToggle';
import './RestoraniList.css';

const RestoraniList = () => {
    const [restorani, setRestorani] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalView, setAuthModalView] = useState('signin');
    const [user, setUser] = useState(null);
    const carouselRef = useRef(null);
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        rajons: [],
        virtuves_tips: [],
        outdoor: null,
        cena: {
            min: 0,
            max: 100
        },
        vertejums: 0
    });
    const [uniqueDistricts, setUniqueDistricts] = useState([]);
    const [uniqueCuisines, setUniqueCuisines] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        const fetchRestorani = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/restorani');
                if (!response.ok) throw new Error('Failed to fetch restaurants');
                const data = await response.json();
                setRestorani(data);
            } catch (err) {
                setError('Could not load restaurants');
            } finally {
                setLoading(false);
            }
        };

        fetchRestorani();
    }, []);

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                console.log('Frontend: Fetching districts...');
                const response = await fetch('http://localhost:3000/api/rajoni');
                
                if (!response.ok) {
                    console.error('Response not OK:', response.status, response.statusText);
                    throw new Error('Failed to fetch districts');
                }
                
                const districts = await response.json();
                console.log('Frontend: Received districts:', districts);
                
                // districts should now be a simple array of strings
                setUniqueDistricts(districts);
                
            } catch (err) {
                console.error('Error fetching districts:', err);
            }
        };

        fetchDistricts();
    }, []);

    useEffect(() => {
        const cuisines = [...new Set(restorani.map(r => r.virtuves_tips))];
        setUniqueCuisines(cuisines);
    }, [restorani]);

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

    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Sort restaurants by rating to get popular ones
    const popularRestorani = [...restorani].sort((a, b) => b.vertejums - a.vertejums).slice(0, 8);

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const filteredRestorani = () => {
        return restorani.filter(restaurant => {
            // District filter
            if (filters.rajons.length > 0 && !filters.rajons.includes(restaurant.rajons)) {
                return false;
            }

            // Cuisine filter
            if (filters.virtuves_tips.length > 0 && !filters.virtuves_tips.includes(restaurant.virtuves_tips)) {
                return false;
            }

            // Outdoor filter
            if (filters.outdoor !== null && restaurant.outdoor !== filters.outdoor) {
                return false;
            }

            // Price filter
            if (restaurant.videja_cena < filters.cena.min || restaurant.videja_cena > filters.cena.max) {
                return false;
            }

            // Rating filter
            if (restaurant.vertejums < filters.vertejums) {
                return false;
            }

            return true;
        });
    };

    if (loading) return (
        <div className="loading-state">
            <div className="loader"></div>
            <p>Loading restaurants...</p>
        </div>
    );

    if (error) return (
        <div className="error-state">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
    );

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
                            <button className="add-review">+ ADD REVIEW</button>
                        )}
                    </div>
                </div>
            </nav>

            <div className="content-container">
                <div className="restaurants-page">
                    {/* Popular This Week Section */}
                    <div className="popular-section">
                        <h2 className="popular-title">Popular this week</h2>
                        <div className="carousel-container">
                            <button 
                                className="carousel-button left"
                                onClick={() => scrollCarousel('left')}
                            >
                                ‹
                            </button>
                            <div className="carousel-wrapper" ref={carouselRef}>
                                {popularRestorani.map(restaurant => (
                                    <div key={restaurant.id} className="carousel-card">
                                        <div className="carousel-poster-wrapper">
                                            <img 
                                                src={restaurant.attels_url} 
                                                alt={restaurant.nosaukums}
                                                className="carousel-poster"
                                            />
                                            <div className="carousel-hover-info">
                                                <div className="carousel-quick-stats">
                                                    <span className="rating">★ {restaurant.vertejums}</span>
                                                    <span className="price">€{restaurant.videja_cena}</span>
                                                </div>
                                                <div className="carousel-actions">
                                                    <button onClick={() => navigate(`/galdi/${restaurant.id}`)}>
                                                        View Tables
                                                    </button>
                                                    <button onClick={() => navigate(`/edienkarte/${restaurant.id}`)}>
                                                        Menu
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="carousel-title">{restaurant.nosaukums}</h3>
                                        <p className="carousel-cuisine">{restaurant.virtuves_tips}</p>
                                    </div>
                                ))}
                            </div>
                            <button 
                                className="carousel-button right"
                                onClick={() => scrollCarousel('right')}
                            >
                                ›
                            </button>
                        </div>
                    </div>

                    {/* New Browse Section */}
                    <div className="browse-section">
                        <div className="browse-header">
                            <h2>Browse Restaurants</h2>
                            <button 
                                className="toggle-filters"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>
                        </div>

                        {showFilters && (
                            <div className="filters-panel">
                                {/* District Filter */}
                                <div className="filter-group">
                                    <h3>District</h3>
                                    <div className="checkbox-group">
                                        {uniqueDistricts.map(district => (
                                            <label key={district} className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.rajons.includes(district)}
                                                    onChange={(e) => {
                                                        const newDistricts = e.target.checked
                                                            ? [...filters.rajons, district]
                                                            : filters.rajons.filter(d => d !== district);
                                                        handleFilterChange('rajons', newDistricts);
                                                    }}
                                                />
                                                {district}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Cuisine Filter */}
                                <div className="filter-group">
                                    <h3>Cuisine</h3>
                                    <div className="checkbox-group">
                                        {uniqueCuisines.map(cuisine => (
                                            <label key={cuisine} className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.virtuves_tips.includes(cuisine)}
                                                    onChange={(e) => {
                                                        const newCuisines = e.target.checked
                                                            ? [...filters.virtuves_tips, cuisine]
                                                            : filters.virtuves_tips.filter(c => c !== cuisine);
                                                        handleFilterChange('virtuves_tips', newCuisines);
                                                    }}
                                                />
                                                {cuisine}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Seating Filter */}
                                <div className="filter-group">
                                    <h3>Seating</h3>
                                    <div className="radio-group">
                                        <label>
                                            <input
                                                type="radio"
                                                name="outdoor"
                                                checked={filters.outdoor === null}
                                                onChange={() => handleFilterChange('outdoor', null)}
                                            />
                                            All
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="outdoor"
                                                checked={filters.outdoor === 'YES'}
                                                onChange={() => handleFilterChange('outdoor', 'YES')}
                                            />
                                            Outdoor
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="outdoor"
                                                checked={filters.outdoor === 'NO'}
                                                onChange={() => handleFilterChange('outdoor', 'NO')}
                                            />
                                            Indoor
                                        </label>
                                    </div>
                                </div>

                                {/* Price Range Filter */}
                                <div className="filter-group">
                                    <h3>Price Range</h3>
                                    <div className="range-inputs">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={filters.cena.max}
                                            onChange={(e) => handleFilterChange('cena', {
                                                ...filters.cena,
                                                max: parseInt(e.target.value)
                                            })}
                                        />
                                        <span>€{filters.cena.max}</span>
                                    </div>
                                </div>

                                {/* Rating Filter */}
                                <div className="filter-group">
                                    <h3>Minimum Rating</h3>
                                    <div className="rating-input">
                                        <input
                                            type="range"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            value={filters.vertejums}
                                            onChange={(e) => handleFilterChange('vertejums', parseFloat(e.target.value))}
                                        />
                                        <span>★ {filters.vertejums}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Filtered Results */}
                        <div className="filtered-results">
                            <div className="results-header">
                                <h3>Results ({filteredRestorani().length})</h3>
                            </div>
                            <div className="restaurants-grid">
                                {filteredRestorani().map(restaurant => (
                                    <div key={restaurant.id} className="restaurant-card">
                                        <div className="poster-wrapper">
                                            <img 
                                                src={restaurant.attels_url} 
                                                alt={restaurant.nosaukums}
                                                className="restaurant-poster"
                                            />
                                            <div className="hover-info">
                                                <div className="quick-stats">
                                                    <span className="rating">★ {restaurant.vertejums}</span>
                                                    <span className="price">€{restaurant.videja_cena}</span>
                                                </div>
                                                <div className="actions">
                                                    <button onClick={() => navigate(`/galdi/${restaurant.id}`)}>
                                                        View Tables
                                                    </button>
                                                    <button onClick={() => navigate(`/edienkarte/${restaurant.id}`)}>
                                                        Menu
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="restaurant-title">{restaurant.nosaukums}</h3>
                                        <p className="restaurant-cuisine">{restaurant.virtuves_tips}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                initialView={authModalView}
                onAuthSuccess={handleAuthSuccess}
            />
        </div>
    );
};

export default RestoraniList;