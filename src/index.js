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

        res.status(201).json({
            user: result.rows[0]
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

        // Don't send password hash to client
        delete user.password_hash;
        
        res.json({
            user: user
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

// Restoranu route - this is correct as it uses 'restoraani' table
app.get('/api/restorani', async (req, res) => {
    try {
        const db = require('./db');
        const result = await db.query('SELECT * FROM restoraani'); // This is correct
        res.json(result.rows);
    } catch (err) {
        console.error('Datubazes kluda:', err);
        res.status(500).json({ error: 'Servera kluda', details: err.message });
    }
});

// Galdinu route - update route to match table name
app.get('/api/galdins/:restoranaId', async (req, res) => { // Changed from 'galdini' to 'galdins'
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

// Edienkartes route - update route to match table name
app.get('/api/eedienkarte/:restoranaId', async (req, res) => { // Changed from 'edienkarte' to 'eedienkarte'
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serveris darbojas uz porta ${port}`);
    console.log('Meginiet:');
    console.log('- http://localhost:3000/api/restorani');
    console.log('- http://localhost:3000/api/galdini/1');
    console.log('- http://localhost:3000/api/edienkarte/1');
});