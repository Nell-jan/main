// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt');

// Register new user
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        
        db.query(query, [username, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.status(400).json({ error: 'Username already exists' });
                } else {
                    res.status(500).json({ error: 'Error registering user' });
                }
                return;
            }
            res.status(201).json({ id: result.insertId, username });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error hashing password' });
    }
});

// Login user
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    
    db.query(query, [username], async (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error logging in' });
            return;
        }
        
        if (results.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        
        const user = results[0];
        
        try {
            if (await bcrypt.compare(password, user.password)) {
                res.json({ id: user.id, username: user.username });
            } else {
                res.status(401).json({ error: 'Invalid credentials' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Error verifying password' });
        }
    });
});

module.exports = router;