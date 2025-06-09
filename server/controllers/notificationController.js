const NotificationSettings = require('../models/notificationSettingsModel');
const User = require('../models/userModel');

// Get user's notification settings
exports.getNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let settings = await NotificationSettings.findOne({ userId });
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new NotificationSettings({ userId });
      await settings.save();
    }
    
    res.status(200).json({
      success: true,
      data: settings
    });
    
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update user's notification settings
exports.updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    
    // Remove userId from update data to prevent modification
    delete updateData.userId;
    
    let settings = await NotificationSettings.findOne({ userId });
    
    if (!settings) {
      // Create new settings if they don't exist
      settings = new NotificationSettings({ 
        userId,
        ...updateData 
      });
    } else {
      // Update existing settings
      Object.assign(settings, updateData);
    }
    
    await settings.save();
    
    res.status(200).json({
      success: true,
      message: 'Notification settings updated successfully',
      data: settings
    });
    
  } catch (error) {
    console.error('Error updating notification settings:', error);
    
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

// Reset notification settings to default
exports.resetNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Delete existing settings
    await NotificationSettings.findOneAndDelete({ userId });
    
    // Create new default settings
    const defaultSettings = new NotificationSettings({ userId });
    await defaultSettings.save();
    
    res.status(200).json({
      success: true,
      message: 'Notification settings reset to default',
      data: defaultSettings
    });
    
  } catch (error) {
    console.error('Error resetting notification settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update specific notification preference
exports.updateNotificationPreference = async (req, res) => {
  try {
    const userId = req.user.id;
    const { preference, value } = req.body;
    
    if (!preference || value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Preference and value are required'
      });
    }
    
    let settings = await NotificationSettings.findOne({ userId });
    
    if (!settings) {
      settings = new NotificationSettings({ userId });
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
    console.error('Error updating notification preference:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update quiet hours
exports.updateQuietHours = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quietHours } = req.body;
    
    let settings = await NotificationSettings.findOne({ userId });
    
    if (!settings) {
      settings = new NotificationSettings({ userId });
    }
    
    settings.quietHours = { ...settings.quietHours, ...quietHours };
    await settings.save();
    
    res.status(200).json({
      success: true,
      message: 'Quiet hours updated successfully',
      data: settings.quietHours
    });
    
  } catch (error) {
    console.error('Error updating quiet hours:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
