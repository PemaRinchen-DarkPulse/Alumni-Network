const mongoose = require('mongoose');

const notificationSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Notification Methods
  pushNotifications: {
    type: Boolean,
    default: true
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  smsNotifications: {
    type: Boolean,
    default: false
  },
  
  // Event Notifications
  eventReminders: {
    type: Boolean,
    default: true
  },
  eventUpdates: {
    type: Boolean,
    default: true
  },
  eventCancellations: {
    type: Boolean,
    default: true
  },
  
  // Mentorship Notifications
  mentorshipUpdates: {
    type: Boolean,
    default: false
  },
  mentorshipRequests: {
    type: Boolean,
    default: true
  },
  mentorshipReminders: {
    type: Boolean,
    default: true
  },
  
  // Content Notifications
  discussionReplies: {
    type: Boolean,
    default: false
  },
  blogUpdates: {
    type: Boolean,
    default: false
  },
  newPosts: {
    type: Boolean,
    default: false
  },
  comments: {
    type: Boolean,
    default: false
  },
  
  // System Notifications
  systemUpdates: {
    type: Boolean,
    default: true
  },  securityAlerts: {
    type: Boolean,
    default: true
  },
  
  // Marketing Notifications
  marketingEmails: {
    type: Boolean,
    default: false
  },
  surveyRequests: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
notificationSettingsSchema.index({ userId: 1 });

const NotificationSettings = mongoose.model('NotificationSettings', notificationSettingsSchema);

module.exports = NotificationSettings;
