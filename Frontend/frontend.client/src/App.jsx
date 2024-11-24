import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RestoraniList from './components/restorani/RestoraniList';
import GaldiList from './components/galdi/GaldiList';
import EdienkarteList from './components/edienkarte/EdienkarteList';
import HomePage from './components/home/HomePage';
import ProfilePage from './components/profile/ProfilePage';
import { ThemeProvider } from './context/ThemeContext';
import './styles/themes.css';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <div className="app-container">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/restaurants" element={<RestoraniList />} />
                        <Route path="/galdi/:restoranaId" element={<GaldiList />} />
                        <Route path="/user/:username" element={<ProfilePage />} />
                        <Route path="/edienkarte/:restoranaId" element={<EdienkarteList />} />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;