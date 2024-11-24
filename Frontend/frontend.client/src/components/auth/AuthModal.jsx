import React, { useState } from 'react';
import './AuthModal.css';
import SignInForm from './SignInForm';
import RegisterForm from './RegisterForm';

const AuthModal = ({ isOpen, onClose, initialView = 'signin', onAuthSuccess }) => {
    const [view, setView] = useState(initialView);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>

                <div className="auth-header">
                    <div className="auth-tabs">
                        <button
                            className={`tab ${view === 'signin' ? 'active' : ''}`}
                            onClick={() => setView('signin')}
                        >
                            SIGN IN
                        </button>
                        <button
                            className={`tab ${view === 'register' ? 'active' : ''}`}
                            onClick={() => setView('register')}
                        >
                            CREATE ACCOUNT
                        </button>
                    </div>
                </div>

                {view === 'signin' ? (
                    <SignInForm
                        onSuccess={onAuthSuccess}
                        switchToRegister={() => setView('register')}
                    />
                ) : (
                    <RegisterForm
                        onSuccess={onAuthSuccess}
                        switchToSignIn={() => setView('signin')}
                    />
                )}
            </div>
        </div>
    );
};

export default AuthModal;