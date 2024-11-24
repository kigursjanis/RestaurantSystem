const API_URL = 'http://localhost:3000/api';

export const authService = {
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            return data.user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async register(username, email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            return data.user;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};