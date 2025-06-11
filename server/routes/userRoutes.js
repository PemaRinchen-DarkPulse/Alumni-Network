const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const { 
  getUserProfile, 
  updateUserProfile, 
  changePassword,
  toggleAccountStatus,
  contactSupport,
  updateNetworkingPreferences,
  getUsersDirectory,
  saveMentorProfile,
  getMentorProfile,
  updateMentorProfile
} = require('../controllers/userController');

// Profile Routes
router.get('/profile', authenticateJWT, getUserProfile);
router.put('/profile', authenticateJWT, updateUserProfile);

// Directory Routes
router.get('/directory', authenticateJWT, getUsersDirectory);

// Password Management
router.put('/change-password', authenticateJWT, changePassword);

// Settings Routes
router.put('/settings/account-status', authenticateJWT, toggleAccountStatus);
router.put('/settings/networking', authenticateJWT, updateNetworkingPreferences);

// Mentor Routes
router.post('/mentor-profile', authenticateJWT, saveMentorProfile);
router.get('/mentor-profile', authenticateJWT, getMentorProfile);
router.put('/mentor-profile', authenticateJWT, updateMentorProfile);

// Support
router.post('/support/contact', authenticateJWT, contactSupport);

module.exports = router;
