const mongoose = require('mongoose');

const privacySettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Profile Visibility
  profileVisibility: {
    type: String,
    enum: ['public', 'alumni-only', 'connections-only', 'private'],
    default: 'public'
  },
  
  // Contact Information Visibility
  showEmail: {
    type: Boolean,
    default: false
  },
  showPhone: {
    type: Boolean,
    default: false
  },
  showAddress: {
    type: Boolean,
    default: false
  },
  
  // Profile Content Visibility
  showBio: {
    type: Boolean,
    default: true
  },
  showSocialLinks: {
    type: Boolean,
    default: true
  },
  showOccupation: {
    type: Boolean,
    default: true
  },
  showBatch: {
    type: Boolean,
    default: true
  },  showEducation: {
    type: Boolean,
    default: true
  },
  showEducationHistory: {
    type: Boolean,
    default: true
  },
  showWorkHistory: {
    type: Boolean,
    default: true
  },
  showSkills: {
    type: Boolean,
    default: true
  },
  
  // Activity Visibility
  showActivityStatus: {
    type: Boolean,
    default: true
  },
  showLastSeen: {
    type: Boolean,
    default: false
  },
  showOnlineStatus: {
    type: Boolean,
    default: true
  },
    // Interaction Settings
  allowMessaging: {
    type: Boolean,
    default: true
  },
  allowDirectMessages: {
    type: Boolean,
    default: true
  },
  allowConnectionRequests: {
    type: Boolean,
    default: true
  },
  allowConnections: {
    type: Boolean,
    default: true
  },
  allowTagging: {
    type: Boolean,
    default: true
  },
  allowMentioning: {
    type: Boolean,
    default: true
  },
  allowProfileViewing: {
    type: Boolean,
    default: true
  },
  allowMentorshipRequests: {
    type: Boolean,
    default: true
  },
  allowEventInvitations: {
    type: Boolean,
    default: true
  },
  
  // Search and Discovery
  showInSearch: {
    type: Boolean,
    default: true
  },
  showInDirectory: {
    type: Boolean,
    default: true
  },
  showInSuggestions: {
    type: Boolean,
    default: true
  },  allowSearchByEmail: {
    type: Boolean,
    default: false
  },
  searchableByEmail: {
    type: Boolean,
    default: false
  },
  allowSearchByPhone: {
    type: Boolean,
    default: false
  },
  searchableByPhone: {
    type: Boolean,
    default: false
  },
  appearsInSuggestions: {
    type: Boolean,
    default: true
  },
  
  // Data Privacy
  allowDataExport: {
    type: Boolean,
    default: true
  },
  allowAnalytics: {
    type: Boolean,
    default: true
  },
  allowPersonalization: {
    type: Boolean,
    default: true
  },
  
  // Content Privacy
  defaultPostVisibility: {
    type: String,
    enum: ['public', 'alumni-only', 'connections-only', 'private'],
    default: 'public'
  },
  allowPostSharing: {
    type: Boolean,
    default: true
  },
  allowComments: {
    type: Boolean,
    default: true
  },
    // Content Keywords (keeping this for content filtering)
  blockedKeywords: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for faster queries
privacySettingsSchema.index({ userId: 1 });

const PrivacySettings = mongoose.model('PrivacySettings', privacySettingsSchema);

module.exports = PrivacySettings;
