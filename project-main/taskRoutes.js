// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../database');

// Middleware to verify user is logged in
const authenticateUser = (req, res, next) => {
    const userId = req.headers['user-id'];
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = userId;
    next();
};

router.use(authenticateUser);

// Get tasks for specific user
router.get('/', (req, res) => {
    const query = 'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC';
    
    db.query(query, [req.userId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching tasks' });
            return;
        }
        res.json(results);
    });
});

// Create task for specific user
router.post('/', (req, res) => {
    const { title, description } = req.body;
    const query = 'INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)';
    
    db.query(query, [req.userId, title, description], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error creating task' });
            return;
        }
        res.status(201).json({ id: result.insertId, title, description });
    });
});

// Update task
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const query = 'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?';
    
    db.query(query, [title, description, status, id, req.userId], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error updating task' });
            return;
        }
        res.json({ id, title, description, status });
    });
});

// Delete task
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
    
    db.query(query, [req.params.id, req.userId], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error deleting task' });
            return;
        }
        res.json({ message: 'Task deleted successfully' });
    });
});

module.exports = router;
