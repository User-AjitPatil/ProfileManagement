const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Middleware
app.use(
    cors({
      origin: "http://localhost:3000",  // Allow your frontend to access the backend
    })
  );
app.use(express.json()); // To parse JSON data in requests

// MySQL Database Connection  
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  
  password: 'ajitpatil@123', 
  database: 'librarymanagement' 
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});
// signup
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const checkUserQuery = 'SELECT * FROM user WHERE email = ?';
  db.query(checkUserQuery, [email], (err, result) => {
    if (err) {
      console.error('Error checking user:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (result.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    const insertUserQuery = 'INSERT INTO user (name, email, password) VALUES (?, ?, ?)';
    db.query(insertUserQuery, [name, email, password], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Failed to sign up user', error: err.message });
      }
      res.status(201).json({ message: 'User signed up successfully' });
    });
  });
});

// login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const query = 'SELECT * FROM user WHERE email = ?';
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'User not registered with us, please register first.' });
    }
    const user = result[0];
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials, please try again.' });
    }
    res.status(200).json({ message: 'Login successful!' });
  });
});


// Start the server
const PORT = 5000; // Your backend port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
