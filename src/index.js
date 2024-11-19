const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Serveris darbojas!' });
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