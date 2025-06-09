import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/shared/icons/Icon';
import { useAuth } from '../contexts/auth';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('ready'); // Changed initial state to ready instead of initializing
  const [message, setMessage] = useState('');
  const [tokenValid, setTokenValid] = useState(true); // Changed default to true
  const { token } = useParams();
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

      try {
        const response = await validateResetToken(token);
        
        if (response && response.success) {
          // Already showing form, no need to update UI
          setTokenValid(true);
        } else {
          // Only update UI if token is invalid
          setTokenValid(false);
          setStatus('error');
          setMessage(response?.error || 'This password reset link is invalid or has expired.');
        }
      } catch (error) {
        console.error("Token validation error:", error);
        setTokenValid(false);
        setStatus('error');
        setMessage('Unable to validate your reset link. The link may be invalid or expired.');
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

  const renderContent = () => {
    if (status === 'success') {
      return (
        <div className="flex flex-col items-center space-y-4 text-center py-6">          <div className="bg-green-100 p-3 rounded-full">
            <Icon name="check" size={40} className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-700">Password Reset Successful!</h3>
          <p className="text-gray-600">{message}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
          <Button onClick={() => navigate('/login')} className="mt-2">
            Go to Login
          </Button>
        </div>
      );
    }

    if (tokenValid === false) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">        <div className="flex">
            <div className="flex-shrink-0">
              <Icon name="x-circle" size={20} className="text-red-500" />
            </div>
            <div className="ml-3">
              <p>{message}</p>
              <div className="mt-4">
                <Link to="/forgot-password" className="text-sm font-medium text-red-700 hover:text-red-600">
                  Request a new password reset link
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {status === 'error' && message && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <p className="text-sm">{message}</p>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Enter your new password"
              minLength={8}
              disabled={status === 'loading'}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={status === 'loading'}
            >
              {showPassword ? (
                <Icon name="eye-off" size={20} />
              ) : (
                <Icon name="eye" size={20} />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Confirm your new password"
              minLength={8}
              disabled={status === 'loading'}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={status === 'loading'}
        >          {status === 'loading' ? (
            <span className="flex items-center justify-center">
              <Icon name="loader" size={20} className="animate-spin-slow -ml-1 mr-3 text-white" />
              Resetting Password...
            </span>
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
          <CardDescription className="text-center">Enter a new password for your account</CardDescription>
        </CardHeader>

        <CardContent>{renderContent()}</CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <div className="text-center text-sm">
            <Link to="/login" className="font-medium text-primary hover:text-primary/90">
              Return to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;