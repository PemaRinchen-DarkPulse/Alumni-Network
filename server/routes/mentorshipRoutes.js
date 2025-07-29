const express = require('express');
const mentorshipController = require('../controllers/mentorshipController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Routes that require authentication
router.use(authMiddleware.protect);

// Get all subjects
router.get('/subjects', mentorshipController.getAllSubjects);

// Get mentors by subject
router.get('/mentors/subject/:subjectId', mentorshipController.getMentorsBySubject);

// Create mentorship request
router.post('/request', mentorshipController.createMentorshipRequest);

// Get mentorship requests for mentor grouped by subject
router.get('/requests/mentor', mentorshipController.getMentorshipRequestsForMentor);

// Get accepted mentorships for student
router.get('/student/mentorships', mentorshipController.getAcceptedMentorshipsForStudent);

// Get all mentorship requests for student (all statuses)
router.get('/student/requests', mentorshipController.getMentorshipRequestsForStudent);

// Get accepted mentorships for mentor
router.get('/mentor/mentorships', mentorshipController.getAcceptedMentorshipsForMentor);

// Update mentorship request status (accept/reject)
router.patch('/request/:requestId/status', mentorshipController.updateMentorshipRequestStatus);

module.exports = router;
