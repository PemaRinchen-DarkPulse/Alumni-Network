const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const {
  getNotificationSettings,
  updateNotificationSettings,
  resetNotificationSettings,
  updateNotificationPreference,
  updateQuietHours
} = require('../controllers/notificationController');

// Get notification settings
router.get('/', authenticateJWT, getNotificationSettings);

// Update notification settings
router.put('/', authenticateJWT, updateNotificationSettings);

// Reset notification settings to default
router.post('/reset', authenticateJWT, resetNotificationSettings);

// Update specific notification preference
router.put('/preference', authenticateJWT, updateNotificationPreference);

// Update quiet hours
router.put('/quiet-hours', authenticateJWT, updateQuietHours);

module.exports = router;
