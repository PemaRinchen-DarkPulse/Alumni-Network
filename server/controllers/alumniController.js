const User = require('../models/userModel');

// Get all alumni users
exports.getAllAlumni = async (req, res) => {
  try {
    const alumni = await User.find({ role: 'alumni' })
      .select('-password')
      .sort({ name: 1 });
    
    res.status(200).json({
      status: 'success',
      results: alumni.length,
      data: {
        alumni
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch alumni',
      error: error.message
    });
  }
};

// Get a specific alumni user by ID
exports.getAlumniById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const alumnus = await User.findOne({
      _id: id,
      role: 'alumni'
    }).select('-password');
    
    if (!alumnus) {
      return res.status(404).json({
        status: 'fail',
        message: 'Alumni not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        alumnus
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch alumni details',
      error: error.message
    });
  }
};