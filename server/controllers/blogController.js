const BlogPost = require('../models/blogModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

/**
 * @desc    Get all blog posts with pagination
 * @route   GET /api/blog
 * @access  Public
 */
exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const posts = await BlogPost.find({ status: 'published' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email profileImage role');

    const totalPosts = await BlogPost.countDocuments({ status: 'published' });

    res.status(200).json({
      success: true,
      count: posts.length,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      posts
    });
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get single blog post by ID
 * @route   GET /api/blog/:id
 * @access  Public
 */
exports.getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('author', 'name email profileImage role')
      .populate('comments.author', 'name email profileImage role');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Error in getPostById:', error);
    
    // Check if error is due to invalid ID format
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Create new blog post
 * @route   POST /api/blog
 * @access  Private (Alumni and Teachers only)
 */
exports.createPost = async (req, res) => {
  try {
    const { title, content, category, featuredImage } = req.body;
    
    // Check if user is authorized to create posts (alumni or teacher)
    if (!['alumni', 'teacher'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to create blog posts'
      });
    }
    
    const newPost = await BlogPost.create({
      title,
      content,
      category,
      featuredImage,
      author: req.user.id
    });
    
    // Populate author details for the response
    const post = await BlogPost.findById(newPost._id)
      .populate('author', 'name email profileImage role');
    
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      post
    });
  } catch (error) {
    console.error('Error in createPost:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Update blog post
 * @route   PUT /api/blog/:id
 * @access  Private (Post author only)
 */
exports.updatePost = async (req, res) => {
  try {
    let post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // Check if user is the author of the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this post'
      });
    }
    
    const { title, content, category, featuredImage, status } = req.body;
    
    // Update post fields
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.featuredImage = featuredImage || post.featuredImage;
    
    // Only allow status change if provided
    if (status) {
      post.status = status;
    }
    
    await post.save();
    
    // Populate author details for the response
    post = await BlogPost.findById(post._id)
      .populate('author', 'name email profileImage role');
    
    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      post
    });
  } catch (error) {
    console.error('Error in updatePost:', error);
    
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format'
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Delete blog post
 * @route   DELETE /api/blog/:id
 * @access  Private (Post author only)
 */
exports.deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // Check if user is the author of the post
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post'
      });
    }
    
    await BlogPost.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error in deletePost:', error);
    
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Add comment to blog post
 * @route   POST /api/blog/:id/comments
 * @access  Private (All authenticated users)
 */
exports.addComment = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }
    
    // Add comment to post
    post.comments.push({
      content,
      author: req.user.id
    });
    
    await post.save();
    
    // Fetch the updated post with populated comment authors
    const updatedPost = await BlogPost.findById(req.params.id)
      .populate('author', 'name email profileImage role')
      .populate('comments.author', 'name email profileImage role');
    
    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error in addComment:', error);
    
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Delete comment from blog post
 * @route   DELETE /api/blog/:id/comments/:commentId
 * @access  Private (Comment author or post author)
 */
exports.deleteComment = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }
    
    // Find comment by ID
    const comment = post.comments.id(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if user is the comment author or post author
    if (comment.author.toString() !== req.user.id && post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this comment'
      });
    }
    
    // Remove comment
    comment.remove();
    await post.save();
    
    // Fetch the updated post with populated comment authors
    const updatedPost = await BlogPost.findById(req.params.id)
      .populate('author', 'name email profileImage role')
      .populate('comments.author', 'name email profileImage role');
    
    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Error in deleteComment:', error);
    
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID or comment ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get blog posts by category
 * @route   GET /api/blog/category/:category
 * @access  Public
 */
exports.getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const posts = await BlogPost.find({ 
      category, 
      status: 'published' 
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email profileImage role');

    const totalPosts = await BlogPost.countDocuments({ 
      category, 
      status: 'published' 
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      category,
      posts
    });
  } catch (error) {
    console.error('Error in getPostsByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
