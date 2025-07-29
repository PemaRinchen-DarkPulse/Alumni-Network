const MentorshipRequest = require('../models/mentorshipRequestModel');
const Mentor = require('../models/mentorModel');
const Subject = require('../models/subjectModel');
const User = require('../models/userModel');

// Get all available subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.getActiveSubjects();
    res.status(200).json({
      success: true,
      data: subjects
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects',
      error: error.message
    });
  }
};

// Get mentors who offer mentorship in a specific subject
exports.getMentorsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    if (!subjectId) {
      return res.status(400).json({
        success: false,
        message: 'Subject ID is required'
      });
    }

    const mentors = await Mentor.find({
      mentoringAreas: { $in: [subjectId] }
    })
    .populate('user', 'name profilePicture')
    .select('fullName bio company currentOccupation');

    res.status(200).json({
      success: true,
      data: mentors
    });
  } catch (error) {
    console.error('Error fetching mentors by subject:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentors',
      error: error.message
    });
  }
};

// Create a new mentorship request
exports.createMentorshipRequest = async (req, res) => {
  try {
    const { mentorId, subjectId, reason, goals } = req.body;
    const studentId = req.user.id; // from auth middleware

    // Check if user is a student
    const user = await User.findById(studentId);
    if (user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can request mentorship'
      });
    }

    // Check if mentor exists and offers the selected subject
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor not found'
      });
    }

    // Check if mentor offers mentorship in the selected subject
    const hasMentoringArea = mentor.mentoringAreas.some(
      area => area.toString() === subjectId
    );

    if (!hasMentoringArea) {
      return res.status(400).json({
        success: false,
        message: 'Mentor does not offer mentorship in the selected subject'
      });
    }

    // Check if a request already exists
    const existingRequest = await MentorshipRequest.findOne({
      student: studentId,
      mentor: mentorId,
      subject: subjectId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: existingRequest.status === 'pending' 
          ? 'A pending request already exists' 
          : 'You are already in a mentorship with this mentor for this subject'
      });
    }

    // Create the mentorship request
    const newRequest = await MentorshipRequest.create({
      student: studentId,
      mentor: mentorId,
      subject: subjectId,
      reason,
      goals
    });

    res.status(201).json({
      success: true,
      data: newRequest,
      message: 'Mentorship request created successfully'
    });
  } catch (error) {
    console.error('Error creating mentorship request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create mentorship request',
      error: error.message
    });
  }
};

// Get mentorship requests for alumni by subject
exports.getMentorshipRequestsForMentor = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    // Check if user is an alumni and has a mentor profile
    const user = await User.findById(userId);
    if (user.role !== 'alumni') {
      return res.status(403).json({
        success: false,
        message: 'Only alumni with mentor profiles can access mentorship requests'
      });
    }

    // Find mentor profile
    const mentor = await Mentor.findOne({ user: userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found'
      });
    }

    // Get requests grouped by subject
    const requestsBySubject = await MentorshipRequest.getRequestsBySubjectForMentor(mentor._id);

    res.status(200).json({
      success: true,
      data: requestsBySubject
    });
  } catch (error) {
    console.error('Error fetching mentorship requests for mentor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentorship requests',
      error: error.message
    });
  }
};

// Get accepted mentorships for a student
exports.getAcceptedMentorshipsForStudent = async (req, res) => {
  try {
    const studentId = req.user.id; // from auth middleware

    // Check if user is a student
    const user = await User.findById(studentId);
    if (user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access their mentorships'
      });
    }

    // Get accepted mentorships
    const mentorships = await MentorshipRequest.getAcceptedMentorshipsForStudent(studentId);

    res.status(200).json({
      success: true,
      data: mentorships
    });
  } catch (error) {
    console.error('Error fetching mentorships for student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentorships',
      error: error.message
    });
  }
};

// Update mentorship request status (accept/reject)
exports.updateMentorshipRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const userId = req.user.id; // from auth middleware

    // Validate status
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Status must be "accepted" or "rejected"'
      });
    }

    // Check if user is an alumni and has a mentor profile
    const user = await User.findById(userId);
    if (user.role !== 'alumni') {
      return res.status(403).json({
        success: false,
        message: 'Only alumni with mentor profiles can update mentorship requests'
      });
    }

    // Find mentor profile
    const mentor = await Mentor.findOne({ user: userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found'
      });
    }

    // Find the request
    const request = await MentorshipRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Mentorship request not found'
      });
    }

    // Check if request belongs to the mentor
    if (request.mentor.toString() !== mentor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this request'
      });
    }

    // Check if request is already processed
    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${request.status}`
      });
    }

    // Update request status
    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      data: request,
      message: `Mentorship request ${status} successfully`
    });
  } catch (error) {
    console.error('Error updating mentorship request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update mentorship request status',
      error: error.message
    });
  }
};

// Get all mentorship requests for a student (all statuses)
exports.getMentorshipRequestsForStudent = async (req, res) => {
  try {
    const studentId = req.user.id; // from auth middleware

    // Check if user is a student
    const user = await User.findById(studentId);
    if (user.role !== 'student') {
      return res.status(403).json({
        success: false,
        message: 'Only students can access their request history'
      });
    }

    // Get all requests for this student
    const requests = await MentorshipRequest.find({ student: studentId })
      .populate('mentor', 'fullName company currentOccupation')
      .populate('subject', 'name')
      .sort({ createdAt: -1 }); // Most recent first

    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching mentorship requests for student:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch request history',
      error: error.message
    });
  }
};

// Get accepted mentorships for a mentor (alumni)
exports.getAcceptedMentorshipsForMentor = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    // Check if user is an alumni and has a mentor profile
    const user = await User.findById(userId);
    if (user.role !== 'alumni') {
      return res.status(403).json({
        success: false,
        message: 'Only alumni with mentor profiles can access their mentoring relationships'
      });
    }

    // Find mentor profile
    const mentor = await Mentor.findOne({ user: userId });
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: 'Mentor profile not found'
      });
    }

    // Get accepted mentorship requests where this user is the mentor
    const mentorships = await MentorshipRequest.find({ 
      mentor: mentor._id, 
      status: 'accepted' 
    })
      .populate('student', 'fullName email profilePicture')
      .populate('subject', 'name')
      .sort({ acceptedAt: -1 }); // Most recently accepted first

    res.status(200).json({
      success: true,
      data: mentorships
    });
  } catch (error) {
    console.error('Error fetching mentorships for mentor:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentoring relationships',
      error: error.message
    });
  }
};
