const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage directly in routes file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/events');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'event-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Middleware to process uploaded file
const processUploadedFile = (req, res, next) => {
  if (req.file) {
    req.body.image = `/uploads/events/${path.basename(req.file.path)}`;
  }
  next();
};

// Public routes
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Protected routes (require authentication)
router.post('/', 
  protect, 
  upload.single('image'),
  processUploadedFile,
  eventController.createEvent
);

router.put('/:id', 
  protect, 
  upload.single('image'),
  processUploadedFile,
  eventController.updateEvent
);

// Simple routes without file upload
router.delete('/:id', protect, eventController.deleteEvent);
router.post('/:id/register', protect, eventController.registerForEvent);
router.delete('/:id/register', protect, eventController.cancelRegistration);

module.exports = router;
