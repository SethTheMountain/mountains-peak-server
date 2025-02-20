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


// Start the Server only if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5003;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
