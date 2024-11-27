import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RestoraniList from './components/restorani/RestoraniList';
import GaldiList from './components/galdi/GaldiList';
import EdienkarteList from './components/edienkarte/EdienkarteList';
import HomePage from './components/home/HomePage';
import ProfilePage from './components/profile/ProfilePage';
import ReviewsPage from './components/reviews/ReviewsPage';
import ListsPage from './components/lists/ListsPage';
import MembersPage from './components/members/MembersPage';
import AboutPage from './components/about/AboutPage';
import TermsPage from './components/terms/TermsPage';
import PrivacyPage from './components/privacy/PrivacyPage';
import NotFound from './components/common/NotFound';
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
                        <Route path="/edienkarte/:restoranaId" element={<EdienkarteList />} />
                        <Route path="/user/:username" element={<ProfilePage />} />
                        <Route path="/reviews" element={<ReviewsPage />} />
                        <Route path="/lists" element={<ListsPage />} />
                        <Route path="/members" element={<MembersPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;