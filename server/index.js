require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const privacyRoutes = require('./routes/privacyRoutes');
const alumniRoutes = require('./routes/alumniRoutes');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Get allowed origins from environment variables or use defaults
const clientOrigins = process.env.CLIENT_URL;

// Security headers
app.use(helmet());

// CORS configuration 
app.use(cors({
  origin: clientOrigins || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'x-auth-token'],
  credentials: true
}));

// Middleware - increased limit for profile pictures
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// CSRF protection - excluding paths that need to work without CSRF
const csrfProtection = csurf({ 
  cookie: { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' 
  }
});

// Apply CSRF protection to all routes except authentication endpoints and API endpoints
app.use((req, res, next) => {
  // Skip CSRF for API routes since we're using token-based authentication
  if (req.path.startsWith('/api/')) {
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
  .then(() => {
    console.log('MongoDB Connected');
    
    // Run migrations if env flag is set
    if (process.env.RUN_MIGRATIONS === 'true') {
      const { migrateUserSettings } = require('./utils/migrateSettings');
      migrateUserSettings()
        .then(result => console.log('Settings migration completed:', result))
        .catch(err => console.error('Settings migration error:', err));
    }
    
    // Always create default privacy settings for users who don't have them
    const { createDefaultPrivacySettings } = require('./utils/createDefaultSettings');
    createDefaultPrivacySettings()
      .then(result => console.log('Default privacy settings created:', result.settingsCreated))
      .catch(err => console.error('Failed to create default privacy settings:', err));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/alumni', alumniRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Alumni Network API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
