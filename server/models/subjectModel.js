const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['academic', 'professional', 'personal-development', 'technical'],
    default: 'academic'
  },
  cardColor: {
    type: String,
    default: function() {
      // Generate a random vibrant color for the card background
      const colors = [
        '#8B5CF6', // Purple
        '#10B981', // Emerald
        '#F59E0B', // Amber
        '#EF4444', // Red
        '#3B82F6', // Blue
        '#8B5A2B', // Brown
        '#EC4899', // Pink
        '#06B6D4', // Cyan
        '#84CC16', // Lime
        '#F97316', // Orange
        '#6366F1', // Indigo
        '#14B8A6'  // Teal
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
subjectSchema.index({ name: 1 });
subjectSchema.index({ category: 1, isActive: 1 });

// Static method to get active subjects
subjectSchema.statics.getActiveSubjects = function() {
  return this.find({ isActive: true }).sort({ name: 1 });
};

// Static method to get subjects by category
subjectSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ name: 1 });
};

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
