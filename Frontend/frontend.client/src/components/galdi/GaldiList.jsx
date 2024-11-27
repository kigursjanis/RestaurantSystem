import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const GaldiList = () => {  
    const { restoranaId } = useParams();  
    const [galdi, setGaldi] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGaldi = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/galdins/${restoranaId}`);
                setGaldi(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Full error:', err);
                console.error('Response data:', err.response?.data);
                console.error('Response status:', err.response?.status);
                setError(`Neizdevās ielādēt: ${err.message}`);
                setLoading(false);
            }
        };

        fetchGaldi();
    }, [restoranaId]);

    if (loading) return <div>Ielādē galdiņus...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mt-4">
            <h3>sPieejamie Galdiņi</h3>
            <div className="row">
                {galdi.map(galds => (
                    <div key={galds.id} className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">Galdiņš #{galds.galda_numurs}</h5>
                                <p>Vietu skaits: {galds.vietu_skaits}</p>
                                <p>Atrašanās vieta: {galds.atrasanas_vieta}</p>
                                <p>Status: {galds.status}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GaldiList;