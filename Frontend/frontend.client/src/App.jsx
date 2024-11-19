import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RestoraniList from './components/restorani/RestoraniList';
import GaldiList from './components/galdi/GaldiList';
import EdienkarteList from './components/edienkarte/EdienkarteList';
import HomePage from './components/home/HomePage';

function App() {
    return (
        <Router>
            <div style={{ 
                width: '100vw', 
                minHeight: '100vh', 
                backgroundColor: '#1a1a1a',
                margin: 0,
                padding: 0
            }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/restaurants" element={<RestoraniList />} />
                    <Route path="/galdi/:restoranaId" element={<GaldiList />} />
                    <Route path="/edienkarte/:restoranaId" element={<EdienkarteList />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;