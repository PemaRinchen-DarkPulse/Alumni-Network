const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import all controller functions
const blogController = require('../controllers/blogController');

// Destructure with validation
const { 
  getAllPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost, 
  addComment, 
  deleteComment,
  getPostsByCategory
} = blogController;

// Debug log to check if all required functions are defined
console.log('Blog controller functions:', {
  getAllPosts: typeof getAllPosts, 
  getPostById: typeof getPostById,
  createPost: typeof createPost, 
  updatePost: typeof updatePost, 
  deletePost: typeof deletePost, 
  addComment: typeof addComment, 
  deleteComment: typeof deleteComment,
  getPostsByCategory: typeof getPostsByCategory
});
const { authenticateJWT } = require('../middleware/authMiddleware');

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/blog');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `blog-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Handle file upload errors
const handleMulterError = (err, req, res, next) => {
  console.error('Multer Error Handler:', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: 'File upload error',
      error: err.message
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only images are allowed',
      error: err.message
    });
  }
  next();
};

// Public routes
router.get('/', getAllPosts);
// Make sure the specific route comes before the generic route to prevent path conflicts
router.get('/category/:category', getPostsByCategory);
router.get('/:id', getPostById);

// Protected routes
router.post('/', authenticateJWT, createPost);
router.put('/:id', authenticateJWT, updatePost);
router.delete('/:id', authenticateJWT, deletePost);

// Image upload routes
router.post('/with-image', authenticateJWT, upload.single('featuredImage'), handleMulterError, async (req, res) => {
  try {
    console.log('=== POST /with-image processing ===');
    console.log('Request authenticated as user:', req.user?.id);
    console.log('User role:', req.user?.role);
    
    // If file was uploaded, convert to buffer for storing in the database
    if (req.file) {
      console.log('File uploaded successfully:', req.file.filename);
      // Read the file from disk to get buffer
      const filePath = req.file.path;
      const fileBuffer = fs.readFileSync(filePath);
      
      // Add the image data to the request body
      req.body.featuredImage = {
        data: fileBuffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname
      };
      
      // Delete the file from disk as it's now in memory
      fs.unlinkSync(filePath);
    } else {
      console.log('No file was uploaded with the request');
      // Set featured image to null if no file
      req.body.featuredImage = null;
    }
    
    // Parse request body for debugging
    console.log('Request body fields:', Object.keys(req.body));
    
    // Check if user is authorized to create posts (alumni or teacher)
    console.log('Checking authorization - User role:', req.user.role);
    
    if (!req.user.role) {
      console.error('❌ User role is missing in request! User:', req.user);
      return res.status(403).json({
        success: false,
        message: 'Authorization error: User role could not be determined'
      });
    }
    
    if (!['alumni', 'teacher'].includes(req.user.role)) {
      console.log('❌ User not authorized - role:', req.user.role);
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to create blog posts'
      });
    }
    
    console.log('✅ User authorized to create blog post - role:', req.user.role);
    
    // Now call the normal create post function
    return createPost(req, res);
  } catch (error) {
    console.error('Error in createPostWithImage:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

router.put('/:id/with-image', authenticateJWT, upload.single('featuredImage'), handleMulterError, async (req, res) => {
  try {
    console.log('=== PUT /:id/with-image processing ===');
    console.log('Request authenticated as user:', req.user?.id);
    console.log('User role:', req.user?.role);
    
    // If file was uploaded, convert to buffer for storing in the database
    if (req.file) {
      console.log('File uploaded successfully:', req.file.filename);
      // Read the file from disk to get buffer
      const filePath = req.file.path;
      const fileBuffer = fs.readFileSync(filePath);
      
      // Add the image data to the request body
      req.body.featuredImage = {
        data: fileBuffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname
      };
      
      // Delete the file from disk as it's now in memory
      fs.unlinkSync(filePath);
    } else {
      console.log('No file was uploaded with the update request');
      
      // If 'keepExistingImage' is true, don't modify the image
      if (req.body.keepExistingImage === 'true') {
        delete req.body.featuredImage; // Don't modify the existing image
      } else if (req.body.featuredImage === '') {
        req.body.featuredImage = null; // Remove the image
      }
    }
    
    // Parse request body for debugging
    console.log('Request body fields:', Object.keys(req.body));
    
    // Now call the normal update post function
    return updatePost(req, res);
  } catch (error) {
    console.error('Error in updatePostWithImage:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// Image retrieval route
router.get('/image/:id', async (req, res) => {
  try {
    const blogPost = await require('../models/blogModel').findById(req.params.id);
    
    if (!blogPost || !blogPost.featuredImage || !blogPost.featuredImage.data) {
      return res.status(404).send('Image not found');
    }
    
    // Set CORS headers to allow image loading from specific origin
    // Don't set CORS headers manually - let the cors middleware handle it
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    
    // Set the content type of the response
    res.set('Content-Type', blogPost.featuredImage.contentType);
    
    // Send the image data as the response
    return res.send(blogPost.featuredImage.data);
  } catch (error) {
    console.error('Error retrieving blog image:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving image',
      error: error.message
    });
  }
});

// Comment routes
router.post('/:id/comments', authenticateJWT, addComment);
router.delete('/:id/comments/:commentId', authenticateJWT, deleteComment);

module.exports = router;
