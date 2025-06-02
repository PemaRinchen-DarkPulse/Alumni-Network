const express = require('express');
const router = express.Router();
const { 
  register, 
  verifyEmail, 
  login, 
  resendVerification,
  forgotPassword,
  validateResetToken,
  resetPassword 
} = require('../controllers/authController');

// Register route
router.post('/register', register);

// Verify email routes - support both GET and POST for better flexibility
router.get('/verify-email/:token', verifyEmail);
router.post('/verify-email/:token', verifyEmail); // Added POST method for better security

// Login route
router.post('/login', login);

// Resend verification email
router.post('/resend-verification', resendVerification);

// Password reset routes
router.post('/forgot-password', forgotPassword);
router.get('/validate-reset-token/:token', validateResetToken);
router.post('/reset-password/:token', resetPassword);

module.exports = router;