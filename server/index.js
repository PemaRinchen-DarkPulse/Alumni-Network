require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  // Allow requests from your Vercel-deployed frontend domains
  origin: [
    'https://alumni-network-frontend-psi.vercel.app',
    'https://alumni-network.vercel.app', 
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Explicitly handle OPTIONS requests for CORS preflight
app.options('*', cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Routes - Use /api prefix for better organization
app.use('/api/auth', authRoutes);

// Support both /api/auth and /auth paths for flexibility
app.use('/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Alumni Network API is running');
});

// Debug route to check environment
app.get('/api/debug', (req, res) => {
  res.json({
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    message: 'API is operational',
    corsOrigins: [
      'https://alumni-network-frontend-psi.vercel.app',
      'https://alumni-network.vercel.app', 
      'http://localhost:5173',
      'http://localhost:3000'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// For Vercel serverless deployment
module.exports = app;
