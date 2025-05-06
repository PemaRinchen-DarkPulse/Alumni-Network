import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { getApiBaseUrl } from '@/lib/utils';

const VerifyEmail = () => {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const { token } = useParams();
  const navigate = useNavigate();
  const API_URL = getApiBaseUrl();
  
  // Email verification logic with improved debugging
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link.');
        return;
      }
      
      try {
        console.log(`Verifying token: ${token}`);
        console.log(`Using API URL: ${API_URL}/auth/verify-email/${token}`);
        
        // Call the backend API to verify the email token
        const response = await fetch(`${API_URL}/auth/verify-email/${token}`);
        const data = await response.json();
        
        console.log('Verification API response:', response.status, data);
        
        if (response.ok) {
          // Success - user email is now verified in the database
          setStatus('success');
          setMessage(data.message);
          
          // Start countdown for redirection
          setShouldRedirect(true);
        } else {
          // Verification failed
          setStatus('error');
          setMessage(data.message || 'Error verifying email. The link may have expired.');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage('An error occurred while verifying your email. Please try again later.');
      }
    };
    
    verifyToken();
  }, [token, API_URL]);
  
  // Redirect countdown logic
  useEffect(() => {
    if (shouldRedirect && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(prev => prev - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
    
    if (shouldRedirect && redirectCountdown === 0) {
      // Redirect to login page immediately after countdown finishes
      navigate('/login');
    }
  }, [shouldRedirect, redirectCountdown, navigate]);
  
  // Handlers for manual navigation
  const handleGoToLogin = () => {
    navigate('/login');
  };
  
  const handleGoToHome = () => {
    navigate('/');
  };
  
  // If verification was successful, immediately redirect to login
  if (status === 'success' && redirectCountdown === 0) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {status === 'loading' ? 'Verifying your email address...' : 'Email verification status'}
          </CardDescription>
        </CardHeader>
        <Separator className="my-2" />
        <CardContent className="flex flex-col items-center py-8">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p>Please wait while we verify your email...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-green-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-700">Email Verified Successfully!</h3>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-2">
                Redirecting to login in {redirectCountdown} {redirectCountdown === 1 ? 'second' : 'seconds'}...
              </p>
              <Button onClick={handleGoToLogin} className="mt-4">
                Go to Login Now
              </Button>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-red-100 p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-700">Verification Failed</h3>
              <p className="text-gray-600">{message}</p>
              <div className="space-y-2 w-full max-w-xs mt-2">
                <Button onClick={handleGoToHome} className="w-full mt-4">
                  Go to Home
                </Button>
                <Button onClick={handleGoToLogin} className="w-full mt-2">
                  Go to Login
                </Button>
              </div>
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