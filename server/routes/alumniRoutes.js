const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');

// Route to get all alumni
router.get('/', alumniController.getAllAlumni);

// Route to get a specific alumni by ID
router.get('/:id', alumniController.getAlumniById);

module.exports = router;