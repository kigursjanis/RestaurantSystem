const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Serveris darbojas!' });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const db = require('./db');
        
        // Check if user exists
        const userCheck = await db.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ 
                error: 'User with this email or username already exists' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create user
        const result = await db.query(
            `INSERT INTO users (username, email, password_hash, profile_picture_url) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, username, email, profile_picture_url`,
            [username, email, password_hash, 'https://via.placeholder.com/150']
        );

        // Send back user data (now auto-logged in)
        res.status(201).json({
            user: result.rows[0],
            message: 'Registration successful'
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = require('./db');

        // Find user
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create a clean user object without password_hash
        const userResponse = {
            id: user.id,
            username: user.username,
            email: user.email,
            profile_picture_url: user.profile_picture_url
        };

        res.json({
            user: userResponse,
            message: 'Login successful'
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});



app.get('/api/users/:username', async (req, res) => {
    try {
        const db = require('./db');
        const result = await db.query(
            'SELECT id, username, email, profile_picture_url, created_at FROM users WHERE username = $1',
            [req.params.username]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Restoranu route -  uses 'restoraani' table
app.get('/api/restorani', async (req, res) => {
    try {
        const db = require('./db');
        const result = await db.query(`
            SELECT 
                id, 
                nosaukums, 
                apraksts, 
                virtuves_tips, 
                videja_cena, 
                vertejums, 
                attels_url, 
                izveidots, 
                outdoor,
                rajons  -- Added this field
            FROM restoraani
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Datubazes kluda:', err);
        res.status(500).json({ error: 'Servera kluda', details: err.message });
    }
});

// Galdinu route 
app.get('/api/galdins/:restoranaId', async (req, res) => { 
    try {
        const db = require('./db');
        const result = await db.query(
            'SELECT * FROM galdins WHERE restorana_id = $1', // This is correct
            [req.params.restoranaId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Datubazes kluda:', err);
        res.status(500).json({ error: 'Servera kluda', details: err.message });
    }
});

// Edienkartes route 
app.get('/api/eedienkarte/:restoranaId', async (req, res) => { 
    try {
        const db = require('./db');
        const result = await db.query(
            'SELECT * FROM eedienkarte WHERE restorana_id = $1', // This is correct
            [req.params.restoranaId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Datubazes kluda:', err);
        res.status(500).json({ error: 'Servera kluda', details: err.message });
    }
});



// Get user's friends (accepted status only)
app.get('/api/friends/:userId', async (req, res) => {
    try {
        const db = require('./db');
        const result = await db.query(
            `SELECT users.id, users.username, users.profile_picture_url 
             FROM friends 
             JOIN users ON friends.friend_id = users.id 
             WHERE friends.user_id = $1 AND friends.status = 'accepted'`,
            [req.params.userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching friends:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Get reviews from friends
app.get('/api/reviews/following/:userId', async (req, res) => {
    try {
        console.log('Fetching reviews for user:', req.params.userId);
        const db = require('./db');
        const result = await db.query(
            `SELECT 
                reviews.*,
                users.username,
                users.profile_picture_url,
                restoraani.nosaukums as restaurant_name,
                restoraani.attels_url as restaurant_image
             FROM reviews
             JOIN friends ON reviews.user_id = friends.friend_id
             JOIN users ON reviews.user_id = users.id
             JOIN restoraani ON reviews.restaurant_id = restoraani.id
             WHERE friends.user_id = $1 
             AND friends.status = 'accepted'
             ORDER BY reviews.created_at DESC
             LIMIT 10`,
            [req.params.userId]
        );
        console.log('Query result:', result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error('Error details:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

//  all reviews
app.get('/api/reviews', async (req, res) => {
    try {
        const db = require('./db');
        const result = await db.query(
            `SELECT 
                reviews.*,
                users.username,
                users.profile_picture_url,
                restoraani.nosaukums as restaurant_name,
                restoraani.attels_url as restaurant_image
             FROM reviews
             JOIN users ON reviews.user_id = users.id
             JOIN restoraani ON reviews.restaurant_id = restoraani.id
             ORDER BY reviews.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// get unique districts
app.get('/api/rajoni', async (req, res) => {
    try {
        console.log('Server: Fetching districts...');
        const db = require('./db');
        
        const result = await db.query(`
            SELECT DISTINCT rajons 
            FROM restoraani 
            WHERE rajons IS NOT NULL
            ORDER BY rajons
        `);
        
        console.log('Server: Districts found:', result.rows);
        
        // Send just the array of district names
        const districts = result.rows.map(row => row.rajons);
        res.json(districts);
        
    } catch (err) {
        console.error('Error in /api/rajoni:', err);
        res.status(500).json({ 
            error: 'Server error', 
            details: err.message
        });
    }
});

// Add review endpoint
app.post('/api/reviews/add', async (req, res) => {
    try {
        const { user_id, restaurant_id, rating, review_text } = req.body;
        const db = require('./db');
        
        const result = await db.query(
            `INSERT INTO reviews (user_id, restaurant_id, rating, review_text, created_at)
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
             RETURNING *`,
            [user_id, restaurant_id, rating, review_text]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding review:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Add restaurant endpoint with better error handling
app.post('/api/restorani/add', async (req, res) => {
    try {
        const { nosaukums, apraksts, virtuves_tips, videja_cena, attels_url } = req.body;
        
        // Validate required fields
        if (!nosaukums || !apraksts || !virtuves_tips || !videja_cena || !attels_url) {
            return res.status(400).json({ 
                error: 'All fields are required' 
            });
        }

        const db = require('./db');
        
        // Set default values
        const vertejums = 0;
        const outdoor = 'NO';
        const izveidots = new Date().toISOString();

        // Log the values being inserted
        console.log('Inserting restaurant with values:', {
            nosaukums,
            apraksts,
            virtuves_tips,
            videja_cena,
            vertejums,
            attels_url,
            izveidots,
            outdoor
        });
        
        const result = await db.query(
            `INSERT INTO restoraani (
                nosaukums, 
                apraksts, 
                virtuves_tips, 
                videja_cena, 
                vertejums, 
                attels_url, 
                izveidots, 
                outdoor
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                nosaukums,
                apraksts,
                virtuves_tips,
                parseFloat(videja_cena), // Convert to float
                vertejums,
                attels_url,
                izveidots,
                outdoor
            ]
        );

        // Log successful insertion
        console.log('Restaurant added successfully:', result.rows[0]);

        // Return the newly created restaurant
        res.status(201).json(result.rows[0]);
    } catch (err) {
        // Detailed error logging
        console.error('Error adding restaurant:', {
            message: err.message,
            stack: err.stack,
            details: err.detail
        });
        
        // Send appropriate error message
        res.status(500).json({ 
            error: 'Failed to add restaurant', 
            details: err.message,
            hint: err.hint
        });
    }
});



// Get user's reviews
app.get('/api/users/:userId/reviews', async (req, res) => {
    try {
        const db = require('./db');
        const result = await db.query(
            `SELECT 
                reviews.*,
                restoraani.nosaukums as restaurant_name,
                restoraani.attels_url as restaurant_image
             FROM reviews
             JOIN restoraani ON reviews.restaurant_id = restoraani.id
             WHERE reviews.user_id = $1
             ORDER BY reviews.created_at DESC`,
            [req.params.userId]
        );
        
        console.log('Fetched reviews for user:', req.params.userId, result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching user reviews:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Delete a review
app.delete('/api/reviews/:reviewId', async (req, res) => {
    try {
        const db = require('./db');
        
        // First, check if the review exists and belongs to the user
        const checkResult = await db.query(
            'SELECT user_id FROM reviews WHERE id = $1',
            [req.params.reviewId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Delete the review
        await db.query(
            'DELETE FROM reviews WHERE id = $1',
            [req.params.reviewId]
        );

        res.json({ message: 'Review deleted successfully' });
    } catch (err) {
        console.error('Error deleting review:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveris darbojas uz porta ${port}`);
    console.log('Meginiet:');
    console.log('- http://localhost:3000/api/restorani');
    console.log('- http://localhost:3000/api/galdini/1');
    console.log('- http://localhost:3000/api/edienkarte/1');
});