import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RestoraniList.css'; // We'll create this file next

const RestoraniList = () => {
    const [restorani, setRestorani] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestorani = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/restorani');
                setRestorani(response.data);
                setLoading(false);
            } catch (err) {
                setError('Neizdevās ielādēt restorānus');
                setLoading(false);
            }
        };

        fetchRestorani();
    }, []);

    if (loading) return (
        <div className="loading-container">
            <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Ielādē...</span>
            </div>
        </div>
    );

    if (error) return <div className="error-container">{error}</div>;

    return (
        <div className="main-container">
            <div className="content-wrapper">
                <h1 className="main-title">Restorānu Sistēma</h1>
                <h2 className="sub-title">Mūsu Restorāni</h2>

                <div className="restaurants-grid">
                    {restorani.map(restoran => (
                        <div key={restoran.id} className="restaurant-card">
                            {restoran.attels_url && (
                                <img
                                    src={restoran.attels_url}
                                    alt={restoran.nosaukums}
                                    className="restaurant-image"
                                />
                            )}
                            <div className="card-content">
                                <h3 className="restaurant-name">{restoran.nosaukums}</h3>
                                <div className="button-group">
                                    <button
                                        className="action-button primary"
                                        onClick={() => navigate(`/galdi/${restoran.id}`)}
                                    >
                                        Skatīt Galdiņus
                                    </button>
                                    <button
                                        className="action-button secondary"
                                        onClick={() => navigate(`/edienkarte/${restoran.id}`)}
                                    >
                                        Skatīt Ēdienkarti
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RestoraniList;