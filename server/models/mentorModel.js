const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Basic Information
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  // Social Links (Optional)
  socialLinks: {
    linkedin: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    facebook: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    }
  },  // Professional Details
  currentOccupation: {
    type: String,
    required: [true, 'Current occupation/role is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company/Organization/Institution is required'],
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years since graduation is required'],
    min: [0, 'Years since graduation cannot be negative']
  },  // Mentoring Details
  mentoringAreas: [{
    type: String,
    enum: [
      'mathematics',
      'physics',
      'chemistry',
      'biology',
      'dzongkha',
      'english',
      'history',
      'geography',
      'economics',
      'computer-science',
      'environmental-science',
      'literature',
      'business-studies',
      'accounting',
      'psychology',
      'sociology',
      'political-science',
      'art-design',
      'music',
      'physical-education',
      'health-education',
      'general-study-skills',
      'college-preparation',
      'career-guidance',
      'other'
    ],
    required: true
  }],  bio: {
    type: String,
    required: [true, 'Bio is required'],
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  // Custom mentoring areas (when "other" is selected)
  customMentoringAreas: [{
    type: String,
    trim: true,
    maxlength: [100, 'Custom mentoring area cannot exceed 100 characters']
  }],
  // Status and verification
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Rating and feedback
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  // Mentorship sessions
  mentorshipSessions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MentorshipSession'
  }],
  // Availability
  availability: {
    timezone: {
      type: String,
      default: 'UTC'
    },
    preferredTimes: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      },
      startTime: String,
      endTime: String
    }],
    maxSessionsPerWeek: {
      type: Number,
      default: 5
    }
  },
  // Metadata
  profileCompleteness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
mentorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate profile completeness
mentorSchema.methods.calculateProfileCompleteness = function() {
  let completeness = 0;
  const totalFields = 10;
  
  // Required fields
  if (this.fullName) completeness += 1;
  if (this.email) completeness += 1;
  if (this.currentOccupation) completeness += 1;
  if (this.company) completeness += 1;
  if (this.yearsOfExperience !== undefined) completeness += 1;
  if (this.mentoringAreas && this.mentoringAreas.length > 0) completeness += 1;
  if (this.bio) completeness += 1;
  
  // Optional but valuable fields
  if (this.phoneNumber) completeness += 1;
  if (this.socialLinks && Object.values(this.socialLinks).some(link => link && link.length > 0)) completeness += 1;
  if (this.availability && this.availability.preferredTimes && this.availability.preferredTimes.length > 0) completeness += 1;
  
  this.profileCompleteness = Math.round((completeness / totalFields) * 100);
  return this.profileCompleteness;
};

// Static method to get mentors by area
mentorSchema.statics.findByMentoringArea = function(area) {
  return this.find({
    mentoringAreas: area,
    isApproved: true,
    isActive: true
  }).populate('user', 'name email profilePicture batch');
};

// Static method to get top-rated mentors
mentorSchema.statics.getTopRated = function(limit = 10) {
  return this.find({
    isApproved: true,
    isActive: true,
    averageRating: { $gte: 4 }
  })
  .sort({ averageRating: -1, totalRatings: -1 })
  .limit(limit)
  .populate('user', 'name email profilePicture batch');
};

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;
