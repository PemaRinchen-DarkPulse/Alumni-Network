const mongoose = require('mongoose');
const User = require('../models/userModel');
const NotificationSettings = require('../models/notificationSettingsModel');
const PrivacySettings = require('../models/privacySettingsModel');

// Migration script to move notification and privacy settings from user documents to separate collections
const migrateUserSettings = async () => {
  try {
    console.log('Starting settings migration...');
    
    // Get all users with existing notification or privacy settings
    const usersWithSettings = await User.find({
      $or: [
        { notificationSettings: { $exists: true } },
        { privacySettings: { $exists: true } }
      ]
    }).select('_id notificationSettings privacySettings');

    console.log(`Found ${usersWithSettings.length} users with existing settings`);

    let migrationResults = {
      totalUsers: usersWithSettings.length,
      notificationsMigrated: 0,
      privacyMigrated: 0,
      errors: []
    };

    for (const user of usersWithSettings) {
      try {
        // Migrate notification settings
        if (user.notificationSettings) {
          const existingNotificationSettings = await NotificationSettings.findOne({ userId: user._id });
            if (!existingNotificationSettings) {
            await NotificationSettings.create({
              userId: user._id,
              // Map old settings to new structure
              pushNotifications: user.notificationSettings.pushNotifications ?? true,
              emailNotifications: user.notificationSettings.emailNotifications ?? true,
              smsNotifications: false,
              eventReminders: user.notificationSettings.eventReminders ?? true,
              eventUpdates: true,
              eventCancellations: true,
              mentorshipUpdates: user.notificationSettings.mentorshipUpdates ?? false,
              mentorshipRequests: user.notificationSettings.mentorshipUpdates ?? false,
              mentorshipReminders: true,
              discussionReplies: user.notificationSettings.discussionReplies ?? false,
              blogUpdates: user.notificationSettings.blogUpdates ?? false,
              newPosts: false,
              comments: false,
              systemUpdates: true,
              securityAlerts: true,
              marketingEmails: false,
              surveyRequests: false
            });
            migrationResults.notificationsMigrated++;
            console.log(`✓ Migrated notification settings for user ${user._id}`);
          }
        }

        // Migrate privacy settings
        if (user.privacySettings) {
          const existingPrivacySettings = await PrivacySettings.findOne({ userId: user._id });
          
          if (!existingPrivacySettings) {
            await PrivacySettings.create({
              userId: user._id,
              // Map old settings to new structure
              profileVisibility: 'public',
              contactInformation: {
                showEmail: user.privacySettings.showEmail ?? false,
                showPhone: user.privacySettings.showPhone ?? false,
                showSocialLinks: user.privacySettings.showSocialLinks ?? true,
                showWorkHistory: true,
                showEducationHistory: true
              },
              interactions: {
                allowDirectMessages: user.privacySettings.allowMessaging ?? true,
                allowConnections: true,
                allowTagging: user.privacySettings.allowTagging ?? true,
                allowMentioning: true,
                allowProfileViewing: true
              },              searchAndDiscovery: {
                searchableByEmail: false,
                searchableByPhone: false,
                appearsInSuggestions: true,
                showInDirectory: true
              }
            });
            migrationResults.privacyMigrated++;
            console.log(`✓ Migrated privacy settings for user ${user._id}`);
          }
        }

      } catch (userError) {
        console.error(`Error migrating settings for user ${user._id}:`, userError);
        migrationResults.errors.push({
          userId: user._id,
          error: userError.message
        });
      }
    }

    console.log('\n=== Migration Results ===');
    console.log(`Total users processed: ${migrationResults.totalUsers}`);
    console.log(`Notification settings migrated: ${migrationResults.notificationsMigrated}`);
    console.log(`Privacy settings migrated: ${migrationResults.privacyMigrated}`);
    console.log(`Errors encountered: ${migrationResults.errors.length}`);

    if (migrationResults.errors.length > 0) {
      console.log('\nErrors:');
      migrationResults.errors.forEach((error, index) => {
        console.log(`${index + 1}. User ${error.userId}: ${error.error}`);
      });
    }

    return migrationResults;

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

// Function to clean up old settings from user documents (run after confirming migration success)
const cleanupOldSettings = async () => {
  try {
    console.log('Starting cleanup of old settings from user documents...');
    
    const result = await User.updateMany(
      {},
      { 
        $unset: { 
          notificationSettings: 1, 
          privacySettings: 1 
        } 
      }
    );

    console.log(`✓ Cleaned up old settings from ${result.modifiedCount} user documents`);
    return result;

  } catch (error) {
    console.error('Cleanup failed:', error);
    throw error;
  }
};

// Function to rollback migration (restore settings to user documents)
const rollbackMigration = async () => {
  try {
    console.log('Starting rollback migration...');
    
    // Get all notification and privacy settings
    const allNotificationSettings = await NotificationSettings.find({});
    const allPrivacySettings = await PrivacySettings.find({});

    let rollbackResults = {
      notificationsRestored: 0,
      privacyRestored: 0,
      errors: []
    };

    // Restore notification settings
    for (const notifSettings of allNotificationSettings) {
      try {
        await User.findByIdAndUpdate(
          notifSettings.userId,
          {
            $set: {
              notificationSettings: {
                emailNotifications: notifSettings.methods.email,
                pushNotifications: notifSettings.methods.push,
                eventReminders: notifSettings.events.eventReminders,
                mentorshipUpdates: notifSettings.mentorship.newRequests,
                discussionReplies: notifSettings.content.comments,
                blogUpdates: notifSettings.content.newPosts,
                weeklyNewsletter: notifSettings.system.newsletter
              }
            }
          }
        );
        rollbackResults.notificationsRestored++;
      } catch (error) {
        rollbackResults.errors.push({
          userId: notifSettings.userId,
          type: 'notification',
          error: error.message
        });
      }
    }

    // Restore privacy settings
    for (const privacySettings of allPrivacySettings) {
      try {
        await User.findByIdAndUpdate(
          privacySettings.userId,
          {
            $set: {
              privacySettings: {
                showEmail: privacySettings.contactInformation.showEmail,
                showPhone: privacySettings.contactInformation.showPhone,
                showSocialLinks: privacySettings.contactInformation.showSocialLinks,
                allowTagging: privacySettings.interactions.allowTagging,
                allowMessaging: privacySettings.interactions.allowDirectMessages
              }
            }
          }
        );
        rollbackResults.privacyRestored++;
      } catch (error) {
        rollbackResults.errors.push({
          userId: privacySettings.userId,
          type: 'privacy',
          error: error.message
        });
      }
    }

    console.log('\n=== Rollback Results ===');
    console.log(`Notification settings restored: ${rollbackResults.notificationsRestored}`);
    console.log(`Privacy settings restored: ${rollbackResults.privacyRestored}`);
    console.log(`Errors encountered: ${rollbackResults.errors.length}`);

    return rollbackResults;

  } catch (error) {
    console.error('Rollback failed:', error);
    throw error;
  }
};

module.exports = {
  migrateUserSettings,
  cleanupOldSettings,
  rollbackMigration
};
