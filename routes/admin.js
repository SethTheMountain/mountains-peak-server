const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Login Route (existing)
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Middleware to verify JWT (existing)
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Create Post Route (existing)
router.post('/posts', authMiddleware, (req, res) => {
  const { title, body } = req.body;
  db.query('INSERT INTO posts (title, body) VALUES (?, ?)', [title, body], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Post created', id: result.insertId });
  });
});

//Delete Post Route
router.delete('/posts/:id', authMiddleware, (req, res) => {
  const postId = req.params.id;
  db.query('DELETE FROM posts WHERE id = ?', [postId], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  });
});

module.exports = router;