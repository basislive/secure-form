const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('responses.db');

// Database setup
db.serialize(() => { /* ... */ });

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // 👈 Static files

// Root route
app.get('/', (req, res) => { // 👈 ADDED THIS
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Form submission handler
app.post('/submit', (req, res) => { /* ... */ });

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { /* ... */ });
