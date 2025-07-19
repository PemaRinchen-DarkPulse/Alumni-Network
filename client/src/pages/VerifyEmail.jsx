import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/auth';
import { Icon } from '@/components/shared/icons/Icon';

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
  
  const handleResendVerification = async () => {
    // If we have the email from state or response, use it directly
    if (userEmail) {
      try {
        setStatus('resending');
        setMessage('Sending a new verification email...');
        
        const response = await resendVerification(userEmail);
        
        if (response && response.success) {
          setStatus('pending');
          setMessage('A new verification email has been sent. Please check your inbox.');
        } else {
          setStatus('error');
          setMessage(response?.error || 'Failed to resend verification email. Please try again.');
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
  
  // Common illustration section for all states
  const IllustrationSection = () => (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden transition-all duration-500 ease-in-out">
      <img 
        src="https://images.pexels.com/photos/6347534/pexels-photo-6347534.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="Email verification illustration"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/10">
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <h2 className="text-3xl font-bold mb-4 transition-all duration-500">
            Verify your email
          </h2>
          <p className="text-lg text-white/80 max-w-md">
            We need to verify your email address to secure your account.
          </p>
        </div>
      </div>
    </div>
  );

  // Content based on status
  const renderContent = () => {
    // Loading state
    if (status === 'loading' && token) {
      return (
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Please wait while we verify your email...</p>
        </div>
      );
    }
    
    // Resending state
    if (status === 'resending') {
      return (
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Sending new verification email...</p>
        </div>
      );
    }
    
    // Pending state
    if (status === 'pending') {
      return (
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <Icon name="mail" size={40} className="text-blue-600" />
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
          <div className="mt-4 space-y-3 w-full">
            <Button 
              onClick={handleResendVerification}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Resend Verification Email
            </Button>
            <Button 
              onClick={handleGoToLogin}
              className="w-full py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Go to Login
            </Button>
          </div>
        </div>
      );
    }
    
    // Expired token state
    if (status === 'expired') {
      return (
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="bg-amber-100 p-3 rounded-full">
            <Icon name="clock" size={40} className="text-amber-600" />
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
          <div className="mt-4 space-y-3 w-full">
            <Button 
              onClick={handleResendVerification}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get New Verification Link
            </Button>
            <Button 
              onClick={handleGoToLogin}
              className="w-full py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Back to Login
            </Button>
          </div>
        </div>
      );
    }
    
    // Success state
    if (status === 'success') {
      return (
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="bg-green-100 p-3 rounded-full">
            <Icon name="check" size={40} className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-700">Email Verified Successfully!</h3>
          <p className="text-gray-600">{message}</p>
          {userEmail && (
            <p className="text-sm text-gray-500">
              Verified email: <strong>{userEmail}</strong>
            </p>
          )}
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
          <Button 
            onClick={handleGoToLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl mt-2"
          >
            Go to Login
          </Button>
        </div>
      );
    }
    
    // Error state
    if (status === 'error') {
      return (
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="bg-red-100 p-3 rounded-full">
            <Icon name="alert-circle" size={40} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-700">Verification Failed</h3>
          <p className="text-gray-600">{message}</p>
          <div className="mt-4 space-y-3 w-full">
            {userEmail && (
              <Button 
                onClick={handleResendVerification}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Resend Verification Email
              </Button>
            )}
            <Button 
              onClick={handleGoToLogin}
              className="w-full py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Go to Login
            </Button>
          </div>
        </div>
      );
    }
    
    // Default/fallback state
    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <p className="text-gray-600">Something went wrong. Please try again later.</p>
        <Button 
          onClick={handleGoToLogin}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Go to Login
        </Button>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex h-[700px]">
          {/* Left side - Content */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 transition-all duration-500 ease-in-out">
            <div className="w-full max-w-md flex items-center justify-center min-h-full">
              <div className="w-full flex flex-col justify-center min-h-full py-4">
                {/* Header Section */}
                <div className="text-center mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {status === 'success' ? 'Email Verified!' : 'Email Verification'}
                  </h1>
                  <p className="text-gray-600 text-sm">
                    {status === 'pending' || status === 'resending' 
                      ? 'Check your inbox for the verification link' 
                      : status === 'success'
                      ? 'Your email has been successfully verified'
                      : status === 'expired'
                      ? 'Your verification link has expired'
                      : 'Verify your email address to continue'}
                  </p>
                </div>
                
                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-center">
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Illustration */}
          <IllustrationSection />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;