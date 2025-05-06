const express = require('express');
const router = express.Router();
const { register, verifyEmail, login, resendVerification } = require('../controllers/authController');
const User = require('../models/userModel');

// Register route
router.post('/register', register);

// Verify email route
router.get('/verify-email/:token', verifyEmail);

// Login route
router.post('/login', login);

// Resend verification email
router.post('/resend-verification', resendVerification);

// Debugging route - Check user verification status
router.get('/debug-verify/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Display current verification status (without exposing sensitive data)
    return res.status(200).json({
      email: user.email,
      emailVerified: user.emailVerified,
      hasVerificationToken: !!user.verificationToken,
      tokenExpires: user.verificationTokenExpires ? 
        new Date(user.verificationTokenExpires).toISOString() : null,
      now: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug verification error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Debugging route - Force verify a user (for development/admins only)
router.post('/debug-force-verify', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Force update verification status
    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    
    // Return success
    return res.status(200).json({
      success: true,
      message: 'User email has been force verified for debugging purposes',
      email: user.email,
      emailVerified: user.emailVerified
    });
  } catch (error) {
    console.error('Debug force verify error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;