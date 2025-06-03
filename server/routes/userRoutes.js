const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const { 
  getUserProfile, 
  updateUserProfile, 
  changePassword,
  updateNotificationSettings,
  updatePrivacySettings,
  toggleAccountStatus,
  contactSupport,
  updateNetworkingPreferences 
} = require('../controllers/userController');

// Profile Routes
router.get('/profile', authenticateJWT, getUserProfile);
router.put('/profile', authenticateJWT, updateUserProfile);

// Password Management
router.put('/change-password', authenticateJWT, changePassword);

// Settings Routes
router.put('/settings/notifications', authenticateJWT, updateNotificationSettings);
router.put('/settings/privacy', authenticateJWT, updatePrivacySettings);
router.put('/settings/account-status', authenticateJWT, toggleAccountStatus);
router.put('/settings/networking', authenticateJWT, updateNetworkingPreferences);

// Support
router.post('/support/contact', authenticateJWT, contactSupport);

module.exports = router;
