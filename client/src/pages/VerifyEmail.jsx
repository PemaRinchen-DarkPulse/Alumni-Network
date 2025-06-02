import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../contexts/AuthContext';

const VerifyEmail = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL;
  const { resendVerification } = useAuth();
  
  // Process the state if coming from registration
  useEffect(() => {
    const { email, message } = location.state || {};
    
    if (email) {
      setUserEmail(email);
      setStatus('pending');
      setMessage(message || 'Please check your email for verification instructions.');
    }
  }, [location.state]);
  
  // Process token verification if token is present
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        // If no token but we have email, it's a pending state
        if (location.state?.email) {
          return; // The first useEffect will handle pending state
        }
        
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }
      
      try {
        // Log the API URL and token for debugging
        console.log(`Verifying token at: ${API_URL}/api/auth/verify-email/${token}`);
        
        const response = await fetch(`${API_URL}/api/auth/verify-email/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setStatus('success');
          setUserEmail(data.email || '');
          setMessage('Email verification successful! You can now log in to your account.');
          
          // Automatically redirect to login page after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          // Check for expired token
          if (data.expired && data.email) {
            console.log('Token expired for email:', data.email);
            setStatus('expired');
            setUserEmail(data.email);
            setMessage('Your verification link has expired. Please request a new verification link.');
          } else {
            setStatus('error');
            setMessage(data.message || 'Error verifying email. The link may be invalid or has already been used.');
          }
          console.error('Verification failed:', data);
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage('An error occurred while verifying your email. Please try again later or contact support.');
      }
    };
    
    if (token) {
      verifyToken();
    }
  }, [token, API_URL, location.state?.email, navigate]);
  
  // Function to manually verify email using the verification token
  const verifyEmailManually = async () => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token available. Please check your email for the verification link.');
      return;
    }
    
    setStatus('loading');
    setMessage('Verifying your email...');
    
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-email/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setUserEmail(data.email || '');
        setMessage('Email verification successful! You can now log in to your account.');
        
        // Automatically redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        // Check for expired token
        if (data.expired && data.email) {
          setStatus('expired');
          setUserEmail(data.email);
          setMessage('Your verification link has expired. Please request a new verification link.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Error verifying email. The link may be invalid or has already been used.');
        }
      }
    } catch (error) {
      console.error('Manual email verification error:', error);
      setStatus('error');
      setMessage('An error occurred while verifying your email. Please try again later or contact support.');
    }
  };
  
  const handleResendVerification = async () => {
    // If we have the email from state or response, use it directly
    if (userEmail) {
      try {
        setStatus('resending');
        setMessage('Sending a new verification email...');
        
        const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userEmail }),
        });

        const data = await response.json();
        
        if (response.ok) {
          setStatus('pending');
          setMessage('A new verification email has been sent. Please check your inbox.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Failed to resend verification email. Please try again.');
        }
      } catch (error) {
        console.error('Error resending verification email:', error);
        setStatus('error');
        setMessage('An error occurred while sending verification email. Please try again later.');
      }
    } else {
      // Redirect to the dedicated resend page if we don't have the email
      navigate('/resend-verification');
    }
  };
  
  const handleGoToLogin = () => {
    navigate('/login');
  };
  
  const handleGoToHome = () => {
    navigate('/');
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {status === 'loading' && token ? 'Verifying your email address...' : 
             status === 'pending' ? 'We\'ve sent a verification link to your email' :
             status === 'resending' ? 'Sending verification email...' :
             status === 'expired' ? 'Verification link expired' :
             status === 'success' ? 'Verification Successful' :
             status === 'error' ? 'Verification Failed' :
             'Email verification status'}
          </CardDescription>
        </CardHeader>
        <Separator className="my-2" />
        <CardContent className="flex flex-col items-center py-8">
          {/* Loading state */}
          {status === 'loading' && token && (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p>Please wait while we verify your email...</p>
            </div>
          )}
          
          {/* Resending state */}
          {status === 'resending' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p>Sending new verification email...</p>
            </div>
          )}
          
          {/* Pending state */}
          {status === 'pending' && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Check Your Inbox</h3>
              <p className="text-gray-600">{message}</p>
              {userEmail && (
                <p className="text-sm text-gray-500">
                  We've sent a verification link to <strong>{userEmail}</strong>
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                The verification link will expire in 5 minutes.
              </p>
              {token && (
                <Button onClick={verifyEmailManually} className="mt-4 w-full">
                  Verify Email Now
                </Button>
              )}
              <div className="mt-4 space-y-4 w-full">
                <Button onClick={handleResendVerification} variant="outline" className="w-full">
                  Resend Verification Email
                </Button>
                <Button onClick={handleGoToLogin} className="w-full">
                  Go to Login
                </Button>
                <Button onClick={handleGoToHome} variant="ghost" className="w-full">
                  Return to Home
                </Button>
              </div>
            </div>
          )}
          
          {/* Expired token state */}
          {status === 'expired' && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-amber-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-amber-700">Verification Link Expired</h3>
              <p className="text-gray-600">{message}</p>
              {userEmail && (
                <p className="text-sm text-gray-500">
                  For email: <strong>{userEmail}</strong>
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Verification links are valid for 5 minutes. Please request a new one.
              </p>
              <Button onClick={handleResendVerification} className="mt-4">
                Get New Verification Link
              </Button>
              <Button onClick={handleGoToHome} variant="outline" className="mt-2">
                Return to Home
              </Button>
            </div>
          )}
          
          {/* Success state */}
          {status === 'success' && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-green-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-700">Email Verified Successfully!</h3>
              <p className="text-gray-600">{message}</p>
              {userEmail && (
                <p className="text-sm text-gray-500">
                  Verified email: <strong>{userEmail}</strong>
                </p>
              )}
              <p className="text-sm text-gray-500">Redirecting to login page...</p>
              <Button onClick={handleGoToLogin} className="mt-4">
                Go to Login
              </Button>
            </div>
          )}
          
          {/* Error state */}
          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-red-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-700">Verification Failed</h3>
              <p className="text-gray-600">{message}</p>
              {token && (
                <Button onClick={verifyEmailManually} className="mt-4 w-full">
                  Try Verification Again
                </Button>
              )}
              <div className="flex flex-col md:flex-row gap-3 mt-4">
                <Button onClick={handleGoToHome} variant="outline">
                  Go to Home
                </Button>
                <Button onClick={handleGoToLogin}>
                  Go to Login
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Link expired? <button onClick={handleResendVerification} className="text-blue-600 hover:underline">Resend verification email</button>
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Alumni Network - Connect with your school community
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;