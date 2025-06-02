const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Fallback handler for when email sending fails
const handleEmailFallback = (url, email) => {
  // Log the URL for development purposes
  console.log('====================================');
  console.log(`EMAIL SENDING FAILED - Here is the link for ${email}:`);
  console.log(url);
  console.log('====================================');
  return false;
};

// Send verification email
exports.sendVerificationEmail = async (email, name, verificationUrl) => {
  try {
    // Get the sender email from environment variables or use a default
    const senderEmail = process.env.EMAIL_FROM;
    
    // If no sender email is configured, use the fallback
    if (!senderEmail) {
      console.error('EMAIL_FROM environment variable not set. Cannot send email.');
      return handleEmailFallback(verificationUrl, email);
    }
    
    const msg = {
      to: email,
      from: senderEmail, // Use only the verified sender email from env
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hello ${name},</h2>
          <p>Thank you for signing up for the Alumni Network. To complete your registration, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" target="_blank" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
          </div>
          
          <p>If the button doesn't work, you can also click on the link below or copy and paste it into your browser:</p>
          <p><a href="${verificationUrl}" target="_blank">${verificationUrl}</a></p>
          
          <p>This verification link will expire in 5 minutes.</p>
          
          <p>If you didn't create an account, you can safely ignore this email.</p>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            Best regards,<br>
            The Alumni Network Team
          </p>
        </div>
      `
    };
    
    await sgMail.send(msg);
    console.log('Verification email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    return handleEmailFallback(verificationUrl, email);
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, name, resetUrl) => {
  try {
    const senderEmail = process.env.EMAIL_FROM;
    
    if (!senderEmail) {
      console.error('EMAIL_FROM environment variable not set. Cannot send email.');
      return handleEmailFallback(resetUrl, email);
    }
    
    const msg = {
      to: email,
      from: senderEmail, // Use only the verified sender email from env
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Hello ${name},</h2>
          <p>You requested a password reset. Please click the button below to set a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" target="_blank" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          
          <p>If the button doesn't work, you can also click on the link below or copy and paste it into your browser:</p>
          <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
          
          <p>This reset link will expire in 1 hour.</p>
          
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            Best regards,<br>
            The Alumni Network Team
          </p>
        </div>
      `
    };
    
    await sgMail.send(msg);
    console.log('Password reset email sent to:', email);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    return handleEmailFallback(resetUrl, email);
  }
};