require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend-backend communication
app.use(express.json()); // Parse JSON request bodies

// Mount Routes
const publicRoutes = require('./routes/public'); // Import public routes
const adminRoutes = require('./routes/admin');   // Import admin routes
app.use('/api', publicRoutes);                   // Mount public routes at /api
app.use('/api/admin', adminRoutes);              // Mount admin routes at /api/admin

// Export the app as a Vercel serverless function
module.exports = app;