import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
        <div className="flex flex-col items-center space-y-4 text-center py-6">
          <div className="bg-green-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
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
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
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
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin-slow -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
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