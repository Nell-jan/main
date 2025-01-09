const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
const db = require('./database');

// Routes
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

