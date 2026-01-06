import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/icons/Icon';
import { useAuth } from '../contexts/auth';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('ready');
  const [message, setMessage] = useState('');
  const [tokenValid, setTokenValid] = useState(true);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { validateResetToken, resetPassword } = useAuth();

  useEffect(() => {
    // Validate token silently in background without blocking UI
    const validateTokenSilently = async () => {
      if (!token) {
        setTokenValid(false);
        setStatus('error');
        setMessage('Invalid password reset link.');
        return;
      }

      // Don't validate if we already have a final status (success or after form submission)
      if (status === 'success' || status === 'loading') {
        return;
      }

      try {
        const response = await validateResetToken(token);
        
        if (response && response.success) {
          setTokenValid(true);
          // Clear any previous error messages
          if (status === 'error') {
            setStatus('ready');
            setMessage('');
          }
        } else {
          // Only show validation error if it's a clear validation failure
          // Don't block the form, let them try anyway
          setTokenValid(true); // Still allow form submission
          console.log('Token validation warning:', response?.error);
        }
      } catch (error) {
        console.error("Token validation error:", error);
        // Still allow form submission even if validation fails
        setTokenValid(true);
      }
    };

    validateTokenSilently();
  }, [token, validateResetToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (status === 'error') {
      setMessage('');
      if (tokenValid) {
        setStatus('ready');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      setStatus('error');
      return;
    }

    if (formData.password.length < 8) {
      setMessage('Password must be at least 8 characters long.');
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      const response = await resetPassword(token, formData.password);

      if (response && response.success) {
        setStatus('success');
        setMessage(response.message || 'Password reset successful!');

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setStatus('error');
        setMessage(response?.error || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again later.');
    }
  };
  
  // No illustration section needed for the centered card design

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === 'success' && message && (
        <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg text-sm mb-3 flex items-start">
          <Icon name="check-circle" size={18} className="mr-2 flex-shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}
      
      {status === 'error' && message && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-3 flex items-start">
          <Icon name="alert-circle" size={18} className="mr-2 flex-shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
          New Password *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon name="key" size={18} className="text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
            placeholder="Enter your new password"
            minLength={8}
            disabled={status === 'loading'}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={status === 'loading'}
          >
            {showPassword ? (
              <Icon name="eye-off" size={18} />
            ) : (
              <Icon name="eye" size={18} />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500">Password must be at least 8 characters long</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
          Confirm Password *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon name="shield" size={18} className="text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
            placeholder="Confirm your new password"
            minLength={8}
            disabled={status === 'loading'}
          />
        </div>
      </div>

      <div className="pt-3">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center">
              <Icon name="loader" size={16} className="animate-spin -ml-1 mr-2 text-white" />
              Resetting Password...
            </span>
          ) : (
            'Reset Password'
          )}
        </Button>
      </div>
    </form>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center space-y-4 text-center py-6">
      <div className="bg-green-100 p-4 rounded-full">
        <Icon name="check-circle" size={40} className="text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-green-700">Password Reset Successful!</h3>
      <p className="text-gray-600">{message}</p>
      <p className="text-sm text-gray-500">Redirecting to login page...</p>
      <Button 
        onClick={() => navigate('/login')}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Go to Login
      </Button>
    </div>
  );

  const renderInvalidToken = () => (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div className="bg-red-100 p-4 rounded-full">
        <Icon name="x-circle" size={40} className="text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-red-700">Invalid Reset Link</h3>
      <p className="text-gray-600">{message}</p>
      <div className="mt-4 w-full space-y-3">
        <Link 
          to="/forgot-password" 
          className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-center"
        >
          Request a New Reset Link
        </Link>
        <Link 
          to="/login" 
          className="block w-full py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md text-center"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Lock Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-blue-50 p-3 rounded-full">
              <Icon name="lock" size={28} className="text-blue-600" />
            </div>
          </div>

          {/* Header Section */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600 text-sm">
              {status === 'success' ? 'Your password has been updated!' : 'Create a new password for your account'}
            </p>
          </div>
          
          {/* Content Section */}
          <div className="flex-1 flex flex-col justify-center">
            {status === 'success' ? renderSuccess() : 
             !token ? renderInvalidToken() : renderForm()}
          </div>
          
          {/* Bottom Section */}
          {status !== 'success' && token && (
            <div className="mt-5">
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Remember your password?{" "}
                  <Link to="/login" className="text-blue-600 font-medium hover:text-blue-500 transition-colors">
                    Back to Login
                  </Link>
                </p>
              </div>
            </div>
          )}
          
          {/* "Try another method" link */}
          {status !== 'success' && (
            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500 font-medium">or</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-2">
                  Having trouble?
                </p>
                <Link to="/contact-support" className="text-blue-600 text-sm font-medium hover:text-blue-500 transition-colors underline">
                  Contact Support
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;