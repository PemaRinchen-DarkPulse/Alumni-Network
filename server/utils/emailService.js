const sgMail = require('@sendgrid/mail');

// Set SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send verification email to user
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} verificationUrl - The verification URL with token
 * @returns {Promise} - SendGrid send response
 */
const sendVerificationEmail = async (to, name, verificationUrl) => {
  const msg = {
    to,
    from: process.env.EMAIL_FROM || 'aimedicare2025@gmail.com', // Use environment variable or default
    subject: 'Verify Your Email - Alumni Network',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4a5568;">Welcome to Alumni Network!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering with Alumni Network. To complete your registration and access all features, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify My Email</a>
        </div>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p><a href="${verificationUrl}" style="color: #4f46e5; word-break: break-all;">${verificationUrl}</a></p>
        <p>This verification link will expire in 24 hours.</p>
        <p>Best regards,<br>Alumni Network Team</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="font-size: 12px; color: #718096;">This is an automated email. Please do not reply to this message.</p>
      </div>
    `
  };

  try {
    return await sgMail.send(msg);
  } catch (error) {
    console.error('Email sending error:', error);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    throw error;
  }
};

/**
 * Send password reset email to user
 * @param {string} to - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} resetUrl - The password reset URL with token
 * @returns {Promise} - SendGrid send response
 */
const sendPasswordResetEmail = async (to, name, resetUrl) => {
  const msg = {
    to,
    from: process.env.EMAIL_FROM || 'aimedicare2025@gmail.com',
    subject: 'Password Reset - Alumni Network',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4a5568;">Reset Your Password</h2>
        <p>Hi ${name},</p>
        <p>You requested a password reset. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>If you didn't request this, please ignore this email.</p>
        <p>The link will expire in 1 hour.</p>
        <p>Best regards,<br>Alumni Network Team</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="font-size: 12px; color: #718096;">This is an automated email. Please do not reply to this message.</p>
      </div>
    `
  };

  try {
    return await sgMail.send(msg);
  } catch (error) {
    console.error('Email sending error:', error);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};