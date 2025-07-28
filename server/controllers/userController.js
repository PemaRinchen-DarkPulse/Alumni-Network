const User = require('../models/userModel');
const Mentor = require('../models/mentorModel');
const Subject = require('../models/subjectModel');
const bcrypt = require('bcryptjs');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    // User ID is available from the JWT authentication middleware
    const userId = req.user.id;
    
    // Find user by ID, excluding the password
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get privacy settings from the privacy controller
    const PrivacySettings = require('../models/privacySettingsModel');
    let privacySettings = await PrivacySettings.findOne({ userId });
    
    // If no privacy settings exist, create default settings using the utility function
    if (!privacySettings) {
      console.log(`No privacy settings found for user ${userId}, creating default settings...`);
      const { createDefaultPrivacySettingsForUser } = require('../utils/createDefaultSettings');
      privacySettings = await createDefaultPrivacySettingsForUser(userId);
    }
    
    // Convert to plain object to avoid mongoose document behavior
    const privacySettingsObj = privacySettings.toObject();
      // Add privacy settings to user object
    const userObj = user.toObject();
    userObj.privacySettings = privacySettingsObj;
    
    console.log(`Returning user profile with privacy settings.`);
    
    res.status(200).json({ user: userObj });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get users directory (for alumni directory page)
exports.getUsersDirectory = async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    
    // Build query filter
    const filter = { 
      accountStatus: 'active',
      emailVerified: true
    };
    
    // Filter by role if specified
    if (role && ['student', 'alumni', 'teacher'].includes(role)) {
      filter.role = role;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Find users with proper fields for directory display
    const users = await User.find(filter)
      .select('name email role batch currentOccupation profilePicture bio isMentor socialLinks phone address privacySettings')
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Filter users based on privacy settings
    const filteredUsers = users.map(user => {
      const userObj = user.toObject();
      
      // Respect privacy settings
      if (!userObj.privacySettings?.showEmail) {
        delete userObj.email;
      }
      if (!userObj.privacySettings?.showPhone) {
        delete userObj.phone;
      }
      if (!userObj.privacySettings?.showSocialLinks) {
        delete userObj.socialLinks;
      }
      if (!userObj.privacySettings?.showBio) {
        delete userObj.bio;
      }
      
      // Remove privacy settings from response
      delete userObj.privacySettings;
      
      // Add computed fields for directory display
      userObj.yearOrClass = userObj.batch || '';
      userObj.field = userObj.currentOccupation || '';
      userObj.tags = [];
      
      // Add role-based tags
      if (userObj.isMentor) {
        userObj.tags.push('Mentor');
      }
      if (userObj.role === 'alumni' && userObj.currentOccupation) {
        userObj.tags.push(userObj.currentOccupation);
      }
      
      return userObj;
    });
    
    // Get total count for pagination
    const totalUsers = await User.countDocuments(filter);
    
    res.status(200).json({ 
      users: filteredUsers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasMore: skip + users.length < totalUsers
      }
    });
    
  } catch (error) {
    console.error('Error fetching users directory:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    
    // Log update attempt for debugging
    console.log('Profile update attempt for user:', userId);
    console.log('Update data keys:', Object.keys(updateData));
    
    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData.email; // Email change should be a separate process with verification
    delete updateData.role; // Role changes should be handled differently
      // Handle profile picture upload separately if needed
    // Validate and process profile picture if provided
    if (updateData.profilePicture && updateData.profilePicture.startsWith('data:')) {
      // Validate the base64 image data
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const mimeType = updateData.profilePicture.split(';')[0].split(':')[1];
      
      if (!validImageTypes.includes(mimeType)) {
        return res.status(400).json({ message: 'Invalid image format. Please use JPEG, PNG, GIF, or WebP.' });
      }
      
      // Check file size (approximate, base64 is ~33% larger than original)
      const sizeInBytes = (updateData.profilePicture.length * 0.75);
      const maxSizeInMB = 5;
      if (sizeInBytes > maxSizeInMB * 1024 * 1024) {
        return res.status(400).json({ message: `Image too large. Please use an image smaller than ${maxSizeInMB}MB.` });
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      console.log('User not found during update:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Profile updated successfully for user:', userId);
    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    // Provide more specific error messages
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Enhanced logging for debugging
    console.log('Password change request for user ID:', userId);
    console.log('Current password provided:', currentPassword ? 'Yes' : 'No');
    console.log('New password provided:', newPassword ? 'Yes' : 'No');
    
    // Validate request with detailed errors
    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password is required' });
    }
    
    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long' });
    }
    
    // Find user with password field included (which is normally excluded)
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if password field exists
    if (!user.password) {
      console.log('Password field is missing for user:', userId);
      return res.status(400).json({ message: 'User password not found in database' });
    }
    
    // Log password info for debugging (only safe in development)
    console.log('User found, password hash exists');
    
    try {
      // Check if current password is correct
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      
      if (!isMatch) {
        console.log('Password mismatch for user:', userId);
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      console.log('Password verified successfully');
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      
      // Save user with new password
      await user.save();
      console.log('Password updated successfully for user:', userId);
      
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (bcryptError) {
      console.error('bcrypt error:', bcryptError);
      return res.status(500).json({ message: 'Error verifying password', error: bcryptError.message });
    }
      } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle account status (activate/deactivate)
exports.toggleAccountStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.body; // 'active' or 'deactivated'
    
    if (!['active', 'deactivated'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { accountStatus: status } },
      { new: true }
    ).select('accountStatus');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: `Account ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      accountStatus: updatedUser.accountStatus
    });
    
  } catch (error) {
    console.error('Error updating account status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Process contact support messages
exports.contactSupport = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const userId = req.user.id;
    
    // In a real application, you would:
    // 1. Create a SupportTicket model/collection
    // 2. Save the ticket with user information
    // 3. Possibly send an email notification to support staff
    // 4. Implement a ticket management system
    
    // For this implementation, we'll just respond with success
    res.status(200).json({ 
      message: 'Support request submitted successfully',
      ticketId: `TICKET-${Date.now()}` // Placeholder ticket ID
    });
    
  } catch (error) {
    console.error('Error submitting support request:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update networking preferences (for Alumni)
exports.updateNetworkingPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { networkingPreferences, isMentor } = req.body;
    
    const user = await User.findById(userId);
    
    // Only alumni can update networking preferences
    if (user.role !== 'alumni') {
      return res.status(403).json({ message: 'Only alumni can update networking preferences' });
    }
    
    // Create update object
    const updateData = { networkingPreferences };
    
    // Add isMentor to update if provided
    if (isMentor !== undefined) {
      updateData.isMentor = isMentor;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('networkingPreferences isMentor');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'Networking preferences updated successfully',
      networkingPreferences: updatedUser.networkingPreferences,
      isMentor: updatedUser.isMentor
    });
    
  } catch (error) {
    console.error('Error updating networking preferences:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user's profile data
exports.getCurrentUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete account permanently
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { confirmPassword } = req.body;
    
    // Get user with password to verify before deletion
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify password before deletion for security
    if (confirmPassword) {
      const isMatch = await bcrypt.compare(confirmPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Password confirmation failed' });
      }
    }
    
    // In a production environment, you might want to:
    // 1. Soft delete instead of hard delete (add deletedAt field)
    // 2. Archive user data for compliance reasons
    // 3. Clean up related data (posts, comments, etc.)
    // 4. Send confirmation email
    
    await User.findByIdAndDelete(userId);
      res.status(200).json({ 
      message: 'Account deleted successfully' 
    });
      } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Save mentor profile
exports.saveMentorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const mentorData = req.body;
    
    // Validate that user exists and is alumni
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'alumni') {
      return res.status(403).json({ message: 'Only alumni can become mentors' });
    }
    
    // Process mentoring areas - Check if it contains the 'other' option
    const hasOther = mentorData.mentoringAreas.includes('other');
    if (hasOther) {
      // Filter out 'other' from mentoringAreas since it's not an actual subject ID
      mentorData.mentoringAreas = mentorData.mentoringAreas.filter(area => area !== 'other');
      mentorData.hasOtherMentoringArea = true;
      
      // Save custom subjects to the Subject collection so others can select them
      if (mentorData.customMentoringAreas && mentorData.customMentoringAreas.length > 0) {
        const customSubjectPromises = mentorData.customMentoringAreas.map(async (customName) => {
          // Only process non-empty custom subjects
          if (customName && customName.trim()) {
            // Check if this subject already exists
            let existingSubject = await Subject.findOne({ 
              name: { $regex: new RegExp(`^${customName.trim()}$`, 'i') } 
            });
            
            if (!existingSubject) {
              // Create a new subject
              const newSubject = new Subject({
                name: customName.trim(),
                description: `Custom subject added by ${user.name || 'a mentor'}`,
                category: 'academic'
              });
              
              existingSubject = await newSubject.save();
              console.log(`Created new subject: ${existingSubject.name}`);
            }
            
            // Add this subject ID to the mentor's mentoring areas if not already there
            if (!mentorData.mentoringAreas.includes(existingSubject._id.toString())) {
              mentorData.mentoringAreas.push(existingSubject._id);
            }
            
            return existingSubject._id;
          }
        });
        
        // Wait for all custom subjects to be processed
        await Promise.all(customSubjectPromises);
      }
    } else {
      mentorData.hasOtherMentoringArea = false;
      // Clear custom areas if 'other' is not selected
      mentorData.customMentoringAreas = [];
    }
    
    // Check if mentor profile already exists
    let mentor = await Mentor.findOne({ user: userId });
    
    if (mentor) {
      // Update existing mentor profile
      Object.assign(mentor, mentorData);
      mentor.updatedAt = Date.now();
    } else {
      // Create new mentor profile
      mentor = new Mentor({
        user: userId,
        ...mentorData
      });
    }
    
    // Calculate and set profile completeness
    mentor.calculateProfileCompleteness();
    
    // Save mentor profile
    await mentor.save();
    
    // Update user's isMentor status
    user.isMentor = true;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Mentor profile saved successfully',
      mentor: mentor
    });
    
  } catch (error) {
    console.error('Error saving mentor profile:', error);
      // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get mentor profile
exports.getMentorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find mentor profile and populate both user and subject details
    const mentor = await Mentor.findOne({ user: userId })
      .populate('user', 'name email profilePicture batch role')
      .populate('mentoringAreas', 'name description category'); // Populate subjects details
    
    if (!mentor) {
      // Return an empty mentor profile instead of 404 error
      return res.status(200).json({
        success: true,
        mentor: null,
        message: 'No mentor profile exists yet'
      });
    }
    
    res.status(200).json({
      success: true,
      mentor: mentor
    });
    
  } catch (error) {
    console.error('Error fetching mentor profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update mentor profile
exports.updateMentorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    
    // Find and update mentor profile
    const mentor = await Mentor.findOne({ user: userId });
    
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }
    
    // Update mentor data
    Object.assign(mentor, updateData);
    mentor.updatedAt = Date.now();
    
    // Recalculate profile completeness
    mentor.calculateProfileCompleteness();
    
    // Save updated mentor profile
    await mentor.save();
    
    res.status(200).json({
      success: true,
      message: 'Mentor profile updated successfully',
      mentor: mentor
    });
    
  } catch (error) {
    console.error('Error updating mentor profile:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update mentorship subjects for alumni
exports.updateMentorshipSubjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mentorshipSubjects } = req.body;
    
    // Check if user is alumni
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'alumni') {
      return res.status(403).json({ message: 'Only alumni can set mentorship subjects' });
    }
    
    // Validate mentorshipSubjects is an array
    if (!Array.isArray(mentorshipSubjects)) {
      return res.status(400).json({ message: 'Mentorship subjects must be an array' });
    }
    
    // Update user's mentorship subjects
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          mentorshipSubjects: mentorshipSubjects,
          isMentor: mentorshipSubjects.length > 0 // Set isMentor to true if subjects exist
        }
      },
      { new: true, runValidators: true }
    ).select('mentorshipSubjects isMentor');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Mentorship subjects updated successfully',
      data: {
        mentorshipSubjects: updatedUser.mentorshipSubjects,
        isMentor: updatedUser.isMentor
      }
    });
    
  } catch (error) {
    console.error('Error updating mentorship subjects:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
