const mongoose = require('mongoose');
const User = require('../models/userModel');
const PrivacySettings = require('../models/privacySettingsModel');

/**
 * Create default privacy settings for all users who don't have them yet
 */
const createDefaultPrivacySettings = async () => {
  try {
    console.log('Starting creation of default privacy settings...');
    
    // Get all users
    const users = await User.find({}).select('_id');
    console.log(`Found ${users.length} users in the database`);
    
    // Find users who already have privacy settings
    const existingPrivacySettings = await PrivacySettings.find({}).select('userId');
    const existingUserIds = existingPrivacySettings.map(ps => ps.userId.toString());
    
    // Filter out users who already have privacy settings
    const usersWithoutSettings = users.filter(user => !existingUserIds.includes(user._id.toString()));
    console.log(`Found ${usersWithoutSettings.length} users without privacy settings`);
    
    let results = {
      settingsCreated: 0,
      errors: []
    };
    
    // Create default privacy settings for each user
    for (const user of usersWithoutSettings) {
      try {
        // Create default privacy settings
        await PrivacySettings.create({
          userId: user._id,
          profileVisibility: 'public',
          showEmail: false,
          showPhone: false,
          showSocialLinks: true,
          showWorkHistory: true,
          showEducationHistory: true,
          allowDirectMessages: true,
          allowConnections: true,
          allowTagging: true,
          allowMentioning: true,
          allowProfileViewing: true,
          searchableByEmail: false,
          searchableByPhone: false,
          appearsInSuggestions: true,
          showInDirectory: true
        });
        
        results.settingsCreated++;
        
        // Log every 10 users to avoid console clutter
        if (results.settingsCreated % 10 === 0) {
          console.log(`Created ${results.settingsCreated} default privacy settings...`);
        }
      } catch (error) {
        console.error(`Error creating privacy settings for user ${user._id}:`, error);
        results.errors.push({
          userId: user._id,
          error: error.message
        });
      }
    }
    
    console.log('\n=== Results ===');
    console.log(`Total users without settings: ${usersWithoutSettings.length}`);
    console.log(`Default privacy settings created: ${results.settingsCreated}`);
    console.log(`Errors encountered: ${results.errors.length}`);
    
    if (results.errors.length > 0) {
      console.log('\nErrors:');
      results.errors.forEach((error, index) => {
        console.log(`${index + 1}. User ${error.userId}: ${error.error}`);
      });
    }
    
    return results;
  } catch (error) {
    console.error('Failed to create default privacy settings:', error);
    throw error;
  }
};

/**
 * Create default privacy settings for a specific user
 * @param {string} userId - The ID of the user
 * @returns {Object} The created privacy settings object
 */
const createDefaultPrivacySettingsForUser = async (userId) => {
  try {
    console.log(`Creating default privacy settings for user ${userId}`);
    
    // Create and return default privacy settings
    const privacySettings = await PrivacySettings.create({
      userId: userId,
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      showSocialLinks: true,
      showWorkHistory: true,
      showEducationHistory: true,
      allowDirectMessages: true,
      allowConnections: true,
      allowTagging: true,
      allowMentioning: true,
      allowProfileViewing: true,
      searchableByEmail: false,
      searchableByPhone: false,
      appearsInSuggestions: true,
      showInDirectory: true
    });
    
    console.log(`Successfully created default privacy settings for user ${userId}`);
    return privacySettings;
  } catch (error) {
    console.error(`Error creating privacy settings for user ${userId}:`, error);
    throw error;
  }
};

module.exports = { 
  createDefaultPrivacySettings,
  createDefaultPrivacySettingsForUser 
};
