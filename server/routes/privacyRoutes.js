const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const {
  getPrivacySettings,
  updatePrivacySettings,
  resetPrivacySettings,
  updateVisibilityPreference
} = require('../controllers/privacyController');

// Get privacy settings
router.get('/', authenticateJWT, getPrivacySettings);

// Update privacy settings
router.put('/', authenticateJWT, updatePrivacySettings);

// Reset privacy settings to default
router.post('/reset', authenticateJWT, resetPrivacySettings);

// Update specific visibility preference
router.put('/visibility', authenticateJWT, updateVisibilityPreference);

module.exports = router;
