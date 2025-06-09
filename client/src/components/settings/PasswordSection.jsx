import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PasswordSection = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Calculate password strength if new password field is changed
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };
  
  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    // Start with a base score
    let strength = 0;
    
    // No password, no strength
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Check for numbers
    if (/\d/.test(password)) strength += 25;
    
    // Check for lowercase letters
    if (/[a-z]/.test(password)) strength += 15;
    
    // Check for uppercase letters
    if (/[A-Z]/.test(password)) strength += 15;
    
    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    // Cap the strength at 100
    setPasswordStrength(Math.min(strength, 100));
  };
  
  // Get color based on password strength
  const getStrengthColor = () => {
    if (passwordStrength < 30) return 'bg-red-500';
    if (passwordStrength < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Get strength text
  const getStrengthText = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Medium';
    return 'Strong';
  };
  
  // Validate password change
  const validatePasswordChange = () => {
    // Check if all fields are filled
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'All fields are required'
      });
      return false;
    }
    
    // Check if new password is same as current
    if (passwordData.currentPassword === passwordData.newPassword) {
      setMessage({
        type: 'error',
        text: 'New password cannot be the same as current password'
      });
      return false;
    }
    
    // Check if password is strong enough
    if (passwordStrength < 40) {
      setMessage({
        type: 'error',
        text: 'Password is too weak. Include uppercase, lowercase, numbers and special characters.'
      });
      return false;
    }
    
    // Check if passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'New passwords do not match'
      });
      return false;
    }
    
    return true;
  };  // Submit password change
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset message
    setMessage({ type: '', text: '' });
    
    // Validate form data
    if (!validatePasswordChange()) return;
    
    setLoading(true);
    
    try {
      // Import settings service
      const { changePassword } = await import('@/services/settingsService');
      
      // Call the API service to change password
      const response = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: 'Password changed successfully!' 
        });
        
        // Reset form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordStrength(0);
      } else {
        throw new Error(response.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to change password' 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {message.text && (
          <div className={`mb-4 p-3 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Current Password</label>
            <Input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleChange}
              placeholder="Enter your current password"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">New Password</label>
            <Input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
            />
            
            {/* Password strength indicator */}
            {passwordData.newPassword && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs">Password Strength</span>
                  <span className="text-xs font-medium">{getStrengthText()}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-full rounded-full ${getStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
                <ul className="mt-2 text-xs text-gray-500 space-y-1">
                  <li className="flex items-center">
                    <span className={passwordData.newPassword.length >= 8 ? 'text-green-500' : ''}>
                      • At least 8 characters
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className={/[A-Z]/.test(passwordData.newPassword) ? 'text-green-500' : ''}>
                      • At least 1 uppercase letter
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className={/\d/.test(passwordData.newPassword) ? 'text-green-500' : ''}>
                      • At least 1 number
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className={/[^A-Za-z0-9]/.test(passwordData.newPassword) ? 'text-green-500' : ''}>
                      • At least 1 special character
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Confirm New Password</label>
            <Input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
            />
            
            {/* Password match indicator */}
            {passwordData.newPassword && passwordData.confirmPassword && (
              <p className={`mt-1 text-xs ${
                passwordData.newPassword === passwordData.confirmPassword 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }`}>
                {passwordData.newPassword === passwordData.confirmPassword 
                  ? 'Passwords match' 
                  : 'Passwords do not match'}
              </p>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordSection;
