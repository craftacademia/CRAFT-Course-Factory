require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const express = require('express');
const path = require('path');
const scriptRoutes = require('./server/routes/scriptRoutes');

const app = express();

// Middleware
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key';

// Middleware to protect routes with JWT verification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }
    
    req.user = user;
    next();
  });
};

// Mount external routes if present
if (scriptRoutes) {
  app.use('/api', scriptRoutes);
}

// Protected Route Example
app.get('/api/protected-route', authenticateToken, (req, res) => {
  res.json({
    message: 'Welcome to the protected route!',
    user: req.user
  });
});

// Admin Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: process.env.ADMIN_EMAIL },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
