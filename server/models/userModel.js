const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'alumni', 'teacher'],
    default: 'student'
  },
  // Common profile fields
  profilePicture: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  socialLinks: {
    linkedin: String,
    instagram: String,
    twitter: String,
    facebook: String,
    github: String
  },
  // Role-specific fields
  batch: {
    type: String,
    required: function() {
      return this.role === 'student' || this.role === 'alumni';
    }
  },
  // For students
  parentGuardianContact: {
    type: String,
    trim: true
  },
  // For alumni
  currentOccupation: {
    type: String,
    trim: true
  },
  isMentor: {
    type: Boolean,
    default: false
  },
  networkingPreferences: {
    openToMentoring: {
      type: Boolean,
      default: false
    },
    providingInternships: {
      type: Boolean,
      default: false
    },
    attendingSchoolTalks: {
      type: Boolean,
      default: false
    }
  },
  // For teachers
  subjectsTaught: [{
    type: String,
    trim: true
  }],
  // Settings
  notificationSettings: {
    pushNotifications: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    eventReminders: {
      type: Boolean,
      default: true
    }
  },
  privacySettings: {
    showEmail: {
      type: Boolean,
      default: false
    },
    showPhone: {
      type: Boolean,
      default: false
    },
    showSocialLinks: {
      type: Boolean,
      default: true
    },
    showBio: {
      type: Boolean,
      default: true
    }
  },
  accountStatus: {
    type: String,
    enum: ['active', 'deactivated'],
    default: 'active'
  },
  // Activity tracking
  activityHistory: [{
    type: {
      type: String,
      enum: ['event', 'mentorship', 'post', 'comment']
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'activityHistory.referenceModel'
    },
    referenceModel: {
      type: String,
      enum: ['Event', 'MentorshipSession', 'Post', 'Comment']
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpires: Date,
  _lastVerifiedToken: String, // Track last token used for successful verification
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  // Only run if password is modified
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password is correct
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;