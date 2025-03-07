const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const db = new sqlite3.Database('responses.db');

// Database setup
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      message TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Debug route to verify paths
app.get('/debug', (req, res) => {
  const debugInfo = {
    currentDir: __dirname,
    publicDir: path.join(__dirname, 'public'),
    indexHtmlPath: path.join(__dirname, 'public', 'index.html'),
    publicDirExists: fs.existsSync(path.join(__dirname, 'public')),
    indexHtmlExists: fs.existsSync(path.join(__dirname, 'public', 'index.html'))
  };
  res.json(debugInfo);
});

// Root route
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('ERROR: File not found at', indexPath);
      res.status(404).send('File not found');
    }
  });
});

// Form submission handler
app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;
  db.run(
    'INSERT INTO responses (name, email, message) VALUES (?, ?, ?)',
    [name, email, message],
    (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Error saving to database');
      }
      res.sendStatus(200);
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
