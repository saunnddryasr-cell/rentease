require('dotenv').config();
const app = require('../src/app');
const connectDB = require('../src/config/db');

// Ensure DB connected once (serverless cold start safe)
let isConnected = false;
const ensureDB = async () => {
  if (isConnected) return;
  await connectDB();
  isConnected = true;
};

module.exports = async (req, res) => {
  await ensureDB();
  return app(req, res);
};