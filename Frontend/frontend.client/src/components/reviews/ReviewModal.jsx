import React, { useState, useEffect } from 'react';
import './ReviewModal.css';

const ReviewModal = ({ isOpen, onClose }) => {
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [showAddRestaurant, setShowAddRestaurant] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);
    const [newRestaurant, setNewRestaurant] = useState({
        nosaukums: '',
        apraksts: '',
        virtuves_tips: '',
        videja_cena: '',
        attels_url: ''
    });
    
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/restorani');
            if (!response.ok) throw new Error('Failed to fetch restaurants');
            const data = await response.json();
            setRestaurants(data);
        } catch (error) {
            showNotification('Error loading restaurants', 'error');
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRestaurant) {
            showNotification('Please select a restaurant', 'error');
            return;
        }
        
        try {
            const response = await fetch('http://localhost:3000/api/reviews/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    restaurant_id: selectedRestaurant.id,
                    rating,
                    review_text: reviewText,
                }),
            });

            if (!response.ok) throw new Error('Failed to submit review');

            showNotification('Review posted successfully!');
            setTimeout(() => {
                setRating(0);
                setReviewText('');
                setSelectedRestaurant(null);
                onClose();
            }, 2000);
            
        } catch (error) {
            showNotification('Failed to post review', 'error');
        }
    };

    const handleAddNewRestaurant = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/api/restorani/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRestaurant),
            });

            if (!response.ok) throw new Error('Failed to add restaurant');

            const addedRestaurant = await response.json();
            setRestaurants(prev => [...prev, addedRestaurant]);
            setSelectedRestaurant(addedRestaurant);
            setShowAddRestaurant(false);
            showNotification('Restaurant added successfully!');
            
        } catch (error) {
            showNotification('Failed to add restaurant', 'error');
        }
    };

    const filteredRestaurants = restaurants.filter(restaurant => 
        restaurant.nosaukums.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map(star => (
            <span
                key={star}
                className={`star ${star <= (hoveredStar || rating) ? 'filled' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
            >
                ★
            </span>
        ));
    };

    if (!isOpen) return null;

    return (
        <div className="review-modal-overlay">
            <div className="review-modal-content">
                <button className="close-button" onClick={onClose}>×</button>
                
                <h2>Write a Review</h2>

                {notification && (
                    <div className={`notification ${notification.type}`}>
                        {notification.message}
                    </div>
                )}

                {!showAddRestaurant ? (
                    <div className="restaurant-selection">
                        <input
                            type="text"
                            placeholder="Search for a restaurant..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <div className="restaurants-list">
                            {filteredRestaurants.map(restaurant => (
                                <div
                                    key={restaurant.id}
                                    className={`restaurant-option ${selectedRestaurant?.id === restaurant.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedRestaurant(restaurant)}
                                >
                                    <img src={restaurant.attels_url} alt={restaurant.nosaukums} />
                                    <div>
                                        <h4>{restaurant.nosaukums}</h4>
                                        <p>{restaurant.virtuves_tips}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button 
                            className="add-restaurant-button"
                            onClick={() => setShowAddRestaurant(true)}
                        >
                            + Add New Restaurant
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleAddNewRestaurant} className="add-restaurant-form">
                        <h3>Add New Restaurant</h3>
                        <input
                            type="text"
                            placeholder="Restaurant Name"
                            value={newRestaurant.nosaukums}
                            onChange={(e) => setNewRestaurant(prev => ({
                                ...prev,
                                nosaukums: e.target.value
                            }))}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newRestaurant.apraksts}
                            onChange={(e) => setNewRestaurant(prev => ({
                                ...prev,
                                apraksts: e.target.value
                            }))}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Cuisine Type"
                            value={newRestaurant.virtuves_tips}
                            onChange={(e) => setNewRestaurant(prev => ({
                                ...prev,
                                virtuves_tips: e.target.value
                            }))}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Average Price"
                            value={newRestaurant.videja_cena}
                            onChange={(e) => setNewRestaurant(prev => ({
                                ...prev,
                                videja_cena: e.target.value
                            }))}
                            required
                        />
                        <input
                            type="url"
                            placeholder="Image URL"
                            value={newRestaurant.attels_url}
                            onChange={(e) => setNewRestaurant(prev => ({
                                ...prev,
                                attels_url: e.target.value
                            }))}
                            required
                        />
                        <div className="button-group">
                            <button type="button" onClick={() => setShowAddRestaurant(false)}>
                                Cancel
                            </button>
                            <button type="submit">
                                Add Restaurant
                            </button>
                        </div>
                    </form>
                )}

                {selectedRestaurant && (
                    <form onSubmit={handleSubmit}>
                        <div className="rating-section">
                            <label>Your Rating</label>
                            <div className="stars-container">
                                {renderStars()}
                            </div>
                            <span className="rating-value">{rating} of 5</span>
                        </div>

                        <div className="review-section">
                            <label>Your Review</label>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="What did you think about this restaurant?"
                                rows="6"
                                required
                            />
                        </div>

                        <div className="button-group">
                            <button type="button" className="cancel-button" onClick={onClose}>
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="submit-button"
                                disabled={!rating || !reviewText.trim()}
                            >
                                Post Review
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ReviewModal; 