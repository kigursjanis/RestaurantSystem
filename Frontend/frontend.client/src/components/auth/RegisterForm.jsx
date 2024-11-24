import React, { useState } from 'react';
import { authService } from '@/services/auth';  // Using @ alias

const RegisterForm = ({ onSuccess, switchToSignIn }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const user = await authService.register(
                formData.username,
                formData.email,
                formData.password
            );
            onSuccess(user); // This will auto-login
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
                <input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    disabled={isLoading}
                />
            </div>

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

            <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    disabled={isLoading}
                />
            </div>

            <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
            >
                {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="form-footer">
                <p>Already have an account? <button type="button" onClick={switchToSignIn} className="link-button">Sign in</button></p>
            </div>
        </form>
    );
};

export default RegisterForm;