const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason for the mentorship request'],
    trim: true
  },
  goals: {
    type: String,
    required: [true, 'Please provide your goals and expectations'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  acceptedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
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

// Index for faster queries
mentorshipRequestSchema.index({ student: 1, mentor: 1, status: 1 });
mentorshipRequestSchema.index({ mentor: 1, subject: 1, status: 1 });

// Pre-save middleware to update the updatedAt field and status timestamps
mentorshipRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set timestamps when status changes
  if (this.isModified('status')) {
    if (this.status === 'accepted' && !this.acceptedAt) {
      this.acceptedAt = Date.now();
    } else if (this.status === 'rejected' && !this.rejectedAt) {
      this.rejectedAt = Date.now();
    }
  }
  
  next();
});

// Static method to get pending requests for a mentor
mentorshipRequestSchema.statics.getPendingRequestsForMentor = function(mentorId) {
  return this.find({ 
    mentor: mentorId, 
    status: 'pending' 
  })
  .populate('student', 'name profilePicture email')
  .populate('subject', 'name category cardColor')
  .sort({ createdAt: -1 });
};

// Static method to get accepted mentorships for a student
mentorshipRequestSchema.statics.getAcceptedMentorshipsForStudent = function(studentId) {
  return this.find({ 
    student: studentId, 
    status: 'accepted' 
  })
  .populate('mentor', 'fullName email')
  .populate('subject', 'name category cardColor')
  .sort({ updatedAt: -1 });
};

// Static method to get mentorship requests grouped by subject for a mentor
mentorshipRequestSchema.statics.getRequestsBySubjectForMentor = async function(mentorId) {
  const requests = await this.find({ 
    mentor: mentorId
  })
  .populate('student', 'name profilePicture email')
  .populate('subject', 'name category cardColor')
  .sort({ createdAt: -1 });
  
  // Group requests by subject
  const groupedRequests = {};
  requests.forEach(request => {
    const subjectId = request.subject._id.toString();
    if (!groupedRequests[subjectId]) {
      groupedRequests[subjectId] = {
        subject: request.subject,
        requests: []
      };
    }
    groupedRequests[subjectId].requests.push(request);
  });
  
  return Object.values(groupedRequests);
};

// Static method to get accepted mentorships grouped by subject for a mentor
mentorshipRequestSchema.statics.getAcceptedMentorshipsBySubjectForMentor = async function(mentorId) {
  const mentorships = await this.find({ 
    mentor: mentorId, 
    status: 'accepted' 
  })
  .populate('student', 'fullName email profilePicture')
  .populate('subject', 'name category cardColor')
  .sort({ acceptedAt: -1 });
  
  // Group mentorships by subject and add student count
  const groupedMentorships = {};
  mentorships.forEach(mentorship => {
    const subjectId = mentorship.subject._id.toString();
    if (!groupedMentorships[subjectId]) {
      groupedMentorships[subjectId] = {
        subject: mentorship.subject,
        studentCount: 0,
        mentorships: []
      };
    }
    groupedMentorships[subjectId].studentCount++;
    groupedMentorships[subjectId].mentorships.push(mentorship);
  });
  
  return Object.values(groupedMentorships);
};

const MentorshipRequest = mongoose.model('MentorshipRequest', mentorshipRequestSchema);

module.exports = MentorshipRequest;
