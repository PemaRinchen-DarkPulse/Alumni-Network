const User = require('../models/userModel');
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
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    
    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData.email; // Email change should be a separate process with verification
    delete updateData.role; // Role changes should be handled differently
    
    // Handle profile picture upload separately if needed
    // This would typically involve processing the image and updating the profilePicture field
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    // Validate request
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Save user with new password
    await user.save();
    
    res.status(200).json({ message: 'Password changed successfully' });
    
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update notification settings
exports.updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationSettings } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { notificationSettings } },
      { new: true, runValidators: true }
    ).select('notificationSettings');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'Notification settings updated successfully',
      notificationSettings: updatedUser.notificationSettings
    });
    
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update privacy settings
exports.updatePrivacySettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { privacySettings } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { privacySettings } },
      { new: true, runValidators: true }
    ).select('privacySettings');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'Privacy settings updated successfully',
      privacySettings: updatedUser.privacySettings
    });
    
  } catch (error) {
    console.error('Error updating privacy settings:', error);
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
    const { networkingPreferences } = req.body;
    
    const user = await User.findById(userId);
    
    // Only alumni can update networking preferences
    if (user.role !== 'alumni') {
      return res.status(403).json({ message: 'Only alumni can update networking preferences' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { networkingPreferences } },
      { new: true, runValidators: true }
    ).select('networkingPreferences');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ 
      message: 'Networking preferences updated successfully',
      networkingPreferences: updatedUser.networkingPreferences
    });
    
  } catch (error) {
    console.error('Error updating networking preferences:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
