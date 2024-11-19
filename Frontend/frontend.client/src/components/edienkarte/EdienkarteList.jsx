import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EdienkarteList = () => {
    const { restoranaId } = useParams();
    const [edieni, setEdieni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEdienkarte = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/eedienkarte/${restoranaId}`);
                setEdieni(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Full error:', err);
                console.error('Response data:', err.response?.data);
                console.error('Response status:', err.response?.status);
                setError(`Neizdevās ielādēt: ${err.message}`);
                setLoading(false);
            }
        };

        fetchEdienkarte();
    }, [restoranaId]);

    if (loading) return <div>Ielādē ēdienkarti...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mt-4">
            <h3>Ēdienkarte</h3>
            <div className="row">
                {edieni.map(ediens => (
                    <div key={ediens.id} className="col-md-4 mb-3">
                        <div className="card">
                            {ediens.attels_url && (
                                <img
                                    src={ediens.attels_url}
                                    className="card-img-top"
                                    alt={ediens.nosaukums}
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{ediens.nosaukums}</h5>
                                <p className="card-text">{ediens.apraksts}</p>
                                <p>Cena: €{ediens.cena}</p>
                                <p>Kategorija: {ediens.kategorija}</p>
                                {ediens.alergeni && (
                                    <p>Alergēni: {ediens.alergeni}</p>
                                )}
                                <p>Status: {ediens.pieejams ? 'Pieejams' : 'Nav pieejams'}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EdienkarteList;