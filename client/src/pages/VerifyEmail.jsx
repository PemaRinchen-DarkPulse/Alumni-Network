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
  const { resendVerification } = useAuth();
  
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
  
  // We don't need the IllustrationSection for the centered card design

  // Content based on status
  const renderContent = () => {
    // Loading state
    if (status === 'loading' && token) {
      return null; // We're handling loading in the Messages Section now
    }
    
    // Resending state
    if (status === 'resending') {
      return null; // We're handling resending in the Messages Section now
    }
    
    // Pending state
    if (status === 'pending') {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 text-blue-600 p-4 rounded-lg text-sm">
            <p className="mb-2">{message}</p>
            {userEmail && (
              <p className="font-medium">
                We've sent a verification link to <strong>{userEmail}</strong>
              </p>
            )}
            <p className="mt-2 text-xs text-blue-500">
              The verification link will expire in 5 minutes.
            </p>
          </div>
          <div className="pt-2">
            <Button 
              onClick={handleResendVerification}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Resend Verification Email
            </Button>
          </div>
        </div>
      );
    }
    
    // Expired token state
    if (status === 'expired') {
      return (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-100 text-amber-600 p-4 rounded-lg text-sm">
            <p className="mb-2">{message}</p>
            {userEmail && (
              <p className="font-medium">
                For email: <strong>{userEmail}</strong>
              </p>
            )}
            <p className="mt-2 text-xs text-amber-500">
              Verification links are valid for 5 minutes. Please request a new one.
            </p>
          </div>
          <div className="pt-2">
            <Button 
              onClick={handleResendVerification}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get New Verification Link
            </Button>
          </div>
        </div>
      );
    }
    
    // Success state
    if (status === 'success') {
      return (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-100 text-green-600 p-4 rounded-lg text-sm">
            <p className="mb-2">{message}</p>
            {userEmail && (
              <p className="font-medium">
                Verified email: <strong>{userEmail}</strong>
              </p>
            )}
            <p className="mt-2 text-xs text-green-500">
              Redirecting to login page...
            </p>
          </div>
          <div className="pt-2">
            <Button 
              onClick={handleGoToLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Go to Login
            </Button>
          </div>
        </div>
      );
    }
    
    // Error state
    if (status === 'error') {
      return (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg text-sm">
            <p>{message}</p>
          </div>
          <div className="pt-2">
            {userEmail && (
              <Button 
                onClick={handleResendVerification}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl mb-3"
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
      <div className="space-y-4">
        <div className="bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded-lg text-sm">
          <p>Something went wrong. Please try again later.</p>
        </div>
        <div className="pt-2">
          <Button 
            onClick={handleGoToLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Email Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-blue-50 p-3 rounded-full">
              <Icon name="mail" size={28} className="text-blue-600" />
            </div>
          </div>
          
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
          
          {/* Messages Section */}
          <div className="min-h-[40px] flex flex-col justify-start">
            {(status === 'loading' || status === 'resending') && (
              <div className="bg-blue-50 border border-blue-200 text-blue-600 p-3 rounded-lg text-sm mb-3 flex items-center justify-center">
                <Icon name="loader" size={18} className="animate-spin mr-2 flex-shrink-0" />
                <span>{message || 'Processing your request...'}</span>
              </div>
            )}
          </div>
          
          {/* Content Section */}
          <div className="flex-1 flex flex-col justify-center">
            {renderContent()}
          </div>
          
          {/* Bottom Section */}
          <div className="mt-6 space-y-3">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                Having trouble?
              </p>
              <Link to="/contact-support" className="text-blue-600 text-sm font-medium hover:text-blue-500 transition-colors underline">
                Contact Support
              </Link>
            </div>
            
            <div className="text-center pt-2">
              <p className="text-gray-600 text-sm">
                Remember your password?{" "}
                <Link to="/login" className="text-blue-600 font-medium hover:text-blue-500 transition-colors">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;