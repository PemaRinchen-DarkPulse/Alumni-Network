require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const authRoutes = require('./routes/authRoutes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Get allowed origins from environment variables or use defaults
const clientOrigins = process.env.CLIENT_URL;

// Security headers
app.use(helmet());

// CORS configuration 
app.use(cors({
  origin: clientOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// CSRF protection - excluding paths that need to work without CSRF
const csrfProtection = csurf({ 
  cookie: { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' 
  }
});

// Apply CSRF protection to all routes except authentication endpoints
app.use((req, res, next) => {
  // Skip CSRF for authentication routes and public routes
  if (req.path.startsWith('/api/auth/') || req.path === '/') {
    next();
  } else {
    csrfProtection(req, res, next);
  }
});

// CSRF token route
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Alumni Network API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
