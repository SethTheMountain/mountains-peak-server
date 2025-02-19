// api/index.js
const serverless = require('serverless-http');
const app = require('../app'); // assuming your Express app is exported from app.js

module.exports = serverless(app);
