const express = require('express');
const router = express.Router();
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

// Public routes
router.get('/', getAllPosts);
// Make sure the specific route comes before the generic route to prevent path conflicts
router.get('/category/:category', getPostsByCategory);
router.get('/:id', getPostById);

// Protected routes
router.post('/', authenticateJWT, createPost);
router.put('/:id', authenticateJWT, updatePost);
router.delete('/:id', authenticateJWT, deletePost);

// Comment routes
router.post('/:id/comments', authenticateJWT, addComment);
router.delete('/:id/comments/:commentId', authenticateJWT, deleteComment);

module.exports = router;
