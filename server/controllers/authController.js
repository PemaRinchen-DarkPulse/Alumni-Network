const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const emailService = require('../utils/emailService');

// Generate JWT Token with more security options
const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET, 
    {
      expiresIn: '30d',
      algorithm: 'HS256',
      issuer: 'alumni-network-api',
      audience: 'alumni-network-client'
    }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, batch } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide name, email and password' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please provide a valid email address' 
      });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long' 
      });
    }
    
    // Validate role
    const validRoles = ['student', 'alumni', 'teacher'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ 
        message: 'Invalid role specified' 
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationTokenExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      batch,
      verificationToken,
      verificationTokenExpires,
      emailVerified: false
    });

    // Generate verification URL with target="_blank" to open in new tab
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Send verification email
    try {
      await emailService.sendVerificationEmail(
        email, 
        name, 
        verificationUrl
      );
      
      // Return success without the verification token in the response
      return res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email for verification instructions.',
        userId: user._id
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      // For development: log the verification link to console as fallback
      console.log('====================================');
      console.log('VERIFICATION LINK (for development - email failed):');
      console.log(verificationUrl);
      console.log('====================================');
      
      return res.status(201).json({
        success: true,
        message: 'User registered but email verification failed. For development: Check server console for verification link.',
        userId: user._id
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify email
// @route   GET or POST /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
  try {
    // Get token from params or body
    const tokenFromParams = req.params.token;
    const tokenFromBody = req.body?.token;
    const token = tokenFromParams || tokenFromBody;
    
    console.log(`Attempting to verify email with token: ${token ? token.substring(0, 10) + '...' : 'undefined'}`);

    if (!token) {
      console.log('Verification failed: No token provided');
      return res.status(400).json({ message: 'No verification token provided' });
    }

    // Find user with the given verification token
    const user = await User.findOne({ 
      $or: [
        // Check for user with this verification token
        { verificationToken: token },
        // Also check if a user was recently verified with this token
        // This helps with multiple/duplicate requests
        { 
          emailVerified: true, 
          _id: { $exists: true },
          $expr: {
            $eq: [{ $toString: "$_lastVerifiedToken" }, token]
          }
        }
      ]
    });

    if (!user) {
      console.log('Verification failed: Invalid token - no user found with this token');
      return res.status(400).json({ message: 'Invalid verification token. Please request a new verification link.' });
    }

    // Check if the email is already verified
    if (user.emailVerified) {
      console.log(`This email (${user.email}) has already been verified`);
      return res.status(200).json({
        success: true,
        message: 'Email already verified. You can now log in.',
        email: user.email
      });
    }

    // Check if the token has expired
    if (user.verificationTokenExpires && user.verificationTokenExpires < Date.now()) {
      console.log(`Verification failed: Token expired for user ${user.email}`);
      return res.status(400).json({ 
        message: 'Your verification link has expired. Please request a new one.',
        expired: true,
        email: user.email
      });
    }

    // Store the token temporarily for history purposes (helps with duplicate requests)
    const tokenBeforeClearing = user.verificationToken;

    // Update user - set email as verified and clear the verification tokens
    user.emailVerified = true;
    user._lastVerifiedToken = tokenBeforeClearing; // Store the token that was used for verification
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    
    await user.save();

    console.log(`Email verified successfully for user: ${user.email}`);
    
    // Return success with redirect
    return res.status(200).json({
      success: true,
      message: 'Email verified successfully. You will be redirected to login.',
      email: user.email
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({ 
      message: 'Server error occurred while verifying email', 
      error: error.message 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }    // Get privacy settings for the user
    const PrivacySettings = require('../models/privacySettingsModel');
    let privacySettings = await PrivacySettings.findOne({ userId: user._id });
    
    // If no privacy settings exist, create default settings
    if (!privacySettings) {
      console.log('Creating default privacy settings for user at login time');
      
      // Import the utility to create default settings
      const { createDefaultPrivacySettingsForUser } = require('../utils/createDefaultSettings');
      privacySettings = await createDefaultPrivacySettingsForUser(user._id);
    }
    
    // Convert to plain object to avoid mongoose document behavior
    const privacySettingsObj = privacySettings.toObject();
    console.log(`Login: Privacy settings loaded for user ${user._id}. Profile visibility: ${privacySettingsObj.profileVisibility}`);
    

    // Generate JWT token
    const token = generateToken(user._id);
      // Return user info and token
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        batch: user.batch,
        profilePicture: user.profilePicture,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
        socialLinks: user.socialLinks,
        parentGuardianContact: user.parentGuardianContact,
        currentOccupation: user.currentOccupation,
        subjectsTaught: user.subjectsTaught,
        privacySettings: privacySettingsObj  // Use the plain object version of privacy settings
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    
    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationTokenExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Update user with new token
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    await user.save();

    // Generate verification URL
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Send verification email
    try {
      await emailService.sendVerificationEmail(
        email,
        user.name,
        verificationUrl
      );
      
      return res.status(200).json({
        success: true,
        message: 'Verification email sent successfully. Please check your email.'
      });
    } catch (emailError) {
      console.error('Email resending failed:', emailError);
      
      // For development: log the verification link to console as fallback
      console.log('====================================');
      console.log('VERIFICATION LINK (resent - email failed):');
      console.log(verificationUrl);
      console.log('====================================');
      
      return res.status(200).json({
        success: true,
        message: 'For development: Check server console for verification link.'
      });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Forgot password - generate reset token and send email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Note: For security reasons, always return success regardless of whether user exists
    // This prevents email enumeration attacks
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return res.status(200).json({
        success: true,
        message: 'If a user with this email exists, a password reset link will be sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    // Save token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // Generate reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send password reset email
    try {
      await emailService.sendPasswordResetEmail(
        email,
        user.name,
        resetUrl
      );

      console.log(`Password reset email sent to: ${email}`);
      return res.status(200).json({
        success: true,
        message: 'If a user with this email exists, a password reset link will be sent.'
      });
    } catch (emailError) {
      console.error('Password reset email sending failed:', emailError);
      
      // For development: log the reset link to console as fallback
      console.log('====================================');
      console.log('PASSWORD RESET LINK (for development - email failed):');
      console.log(resetUrl);
      console.log('====================================');
      
      // Remove the reset token - so user has to request a new one if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(500).json({
        message: 'Unable to send password reset email. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      message: 'Server error occurred while processing your request.',
      error: error.message
    });
  }
};

// @desc    Validate password reset token
// @route   GET /api/auth/validate-reset-token/:token
// @access  Public
exports.validateResetToken = async (req, res) => {
  try {
    const resetToken = req.params.token;

    // Check if token exists
    if (!resetToken) {
      return res.status(400).json({ message: 'Invalid password reset token' });
    }

    // Find user with matching token
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() } // Token not expired
    });

    if (!user) {
      return res.status(400).json({
        message: 'Password reset link is invalid or has expired'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Token is valid',
      email: user.email // Optionally return email to show on reset page
    });
  } catch (error) {
    console.error('Token validation error:', error);
    return res.status(500).json({
      message: 'Server error occurred while validating the reset token',
      error: error.message
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const resetToken = req.params.token;
    const { password } = req.body;

    // Validate inputs
    if (!resetToken || !password) {
      return res.status(400).json({
        message: 'Please provide a new password'
      });
    }

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Password reset link is invalid or has expired'
      });
    }

    // Update password and clear reset tokens
    user.password = password; // Password will be hashed by pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();

    console.log(`Password reset successful for user: ${user.email}`);

    return res.status(200).json({
      success: true,
      message: 'Your password has been successfully updated. You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({
      message: 'Server error occurred while resetting your password',
      error: error.message
    });
  }
};