const PrivacySettings = require('../models/privacySettingsModel');

// Get user's privacy settings
exports.getPrivacySettings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let settings = await PrivacySettings.findOne({ userId });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new PrivacySettings({ userId });
      await settings.save();
    }
    
    res.status(200).json({
      success: true,
      data: settings
    });
    
  } catch (error) {
    console.error('Error fetching privacy settings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update user's privacy settings
exports.updatePrivacySettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    
    console.log(`Updating privacy settings for user ${userId}`, updateData);
    
    // Remove userId from update data to prevent modification
    delete updateData.userId;
    
    let settings = await PrivacySettings.findOne({ userId });
    
    if (!settings) {
      // Create new settings if they don't exist
      console.log(`No privacy settings found for user ${userId}, creating new settings...`);
      settings = new PrivacySettings({ 
        userId,
        ...updateData 
      });
    } else {
      // Update existing settings
      console.log(`Found existing privacy settings for user ${userId}, updating...`);
      Object.assign(settings, updateData);
    }
    
    // Save the updated settings
    await settings.save();
    
    // Convert to plain object to avoid mongoose document behavior
    const settingsObj = settings.toObject();
      console.log(`Privacy settings updated successfully for user ${userId}.`);
    
    res.status(200).json({
      success: true,
      message: 'Privacy settings updated successfully',
      data: settingsObj
    });
    
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Reset privacy settings to default
exports.resetPrivacySettings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    console.log(`Resetting privacy settings to default for user ${userId}`);
    
    // Delete existing settings
    await PrivacySettings.findOneAndDelete({ userId });
    
    // Create new default settings using the utility function for consistency
    const { createDefaultPrivacySettingsForUser } = require('../utils/createDefaultSettings');
    const defaultSettings = await createDefaultPrivacySettingsForUser(userId);
    
    // Convert to plain object to avoid mongoose document behavior
    const settingsObj = defaultSettings.toObject();
    
    console.log(`Privacy settings reset successfully for user ${userId}`);
    
    res.status(200).json({
      success: true,
      message: 'Privacy settings reset to default',
      data: settingsObj
    });
    
  } catch (error) {
    console.error('Error resetting privacy settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update visibility preference
exports.updateVisibilityPreference = async (req, res) => {
  try {
    const userId = req.user.id;
    const { preference, value } = req.body;
    
    if (!preference || value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Preference and value are required'
      });
    }
    
    let settings = await PrivacySettings.findOne({ userId });
    
    if (!settings) {
      settings = new PrivacySettings({ userId });
    }
    
    // Update specific preference
    settings[preference] = value;
    await settings.save();
    
    res.status(200).json({
      success: true,
      message: `${preference} updated successfully`,
      data: { [preference]: value }
    });
    
  } catch (error) {
    console.error('Error updating visibility preference:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
