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
