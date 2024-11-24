import React, { useState } from 'react';
import { authService } from '../../services/auth';

const SignInForm = ({ onSuccess, switchToRegister }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await authService.login(formData.email, formData.password);
            onSuccess(user);
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                />
            </div>

            <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
            >
                {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="form-footer">
                <p>Don't have an account? <button type="button" onClick={switchToRegister} className="link-button">Create one</button></p>
            </div>
        </form>
    );
};

export default SignInForm;