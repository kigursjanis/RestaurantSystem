import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EdienkarteList.css';

const EdienkarteList = () => {
    const { restoranaId } = useParams();
    const navigate = useNavigate();
    const [edieni, setEdieni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchEdienkarte = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/eedienkarte/${restoranaId}`);
                if (!response.ok) throw new Error('Failed to fetch menu');
                const data = await response.json();
                setEdieni(data);
                
                // Extract unique categories
                const uniqueCategories = [...new Set(data.map(dish => dish.kategorija))];
                setCategories(uniqueCategories);
            } catch (err) {
                console.error('Error:', err);
                setError('Could not load menu');
            } finally {
                setLoading(false);
            }
        };

        fetchEdienkarte();
    }, [restoranaId]);

    const filteredDishes = activeCategory === 'all' 
        ? edieni 
        : edieni.filter(dish => dish.kategorija === activeCategory);

    if (loading) return (
        <div className="loading-state">
            <div className="loader"></div>
            <p>Loading menu...</p>
        </div>
    );

    if (error) return (
        <div className="error-state">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
    );

    return (
        <div className="edienkarte-page">
            <div className="back-button-container">
                <button 
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ← Back to Restaurant
                </button>
            </div>
            
            <div className="edienkarte-header">
                <h2>Menu</h2>
                <div className="category-filters">
                    <button 
                        className={`category-filter ${activeCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveCategory('all')}
                    >
                        All
                    </button>
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`category-filter ${activeCategory === category ? 'active' : ''}`}
                            onClick={() => setActiveCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="edienkarte-grid">
                {filteredDishes.map(dish => (
                    <div key={dish.id} className="dish-card">
                        <div className="dish-image-wrapper">
                            {dish.attels_url && (
                                <img
                                    src={dish.attels_url}
                                    alt={dish.nosaukums}
                                    className="dish-image"
                                />
                            )}
                            {dish.pieejams ? (
                                <div className="availability-badge available">Available</div>
                            ) : (
                                <div className="availability-badge unavailable">Unavailable</div>
                            )}
                        </div>
                        <div className="dish-content">
                            <h3 className="dish-title">{dish.nosaukums}</h3>
                            <p className="dish-description">{dish.apraksts}</p>
                            <div className="dish-meta">
                                <span className="dish-price">€{dish.cena}</span>
                                <span className="dish-category">{dish.kategorija}</span>
                            </div>
                            {dish.alergeni && (
                                <div className="allergens">
                                    {dish.alergeni.split(',').map(allergen => (
                                        <span key={allergen.trim()}>{allergen.trim()}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EdienkarteList;