import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/auth';
import { Icon } from '@/components/shared/icons/Icon';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { resendVerification } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    try {
      setStatus('loading');
      setMessage('Sending verification email...');

      const response = await resendVerification(email);

      if (response && response.success) {
        setStatus('success');
        setMessage(response.message || 'Verification email sent successfully. Please check your inbox.');
      } else {
        setStatus('error');
        setMessage(response?.error || 'Failed to resend verification email. Please try again later.');
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
    }
  };

  const IllustrationSection = () => (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden transition-all duration-500 ease-in-out">
      <img 
        src="https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="Email verification illustration"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/10">
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <h2 className="text-3xl font-bold mb-4 transition-all duration-500">
            Verify your email
          </h2>
          <p className="text-lg text-white/80 max-w-md">
            Verification is important to secure your account and access all features.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex h-[700px]">
          {/* Left side - Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 transition-all duration-500 ease-in-out">
            <div className="w-full max-w-md flex items-center justify-center min-h-full">
              <div className="w-full flex flex-col justify-center min-h-full py-4">
                {/* Header Section */}
                <div className="text-center mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Resend Verification</h1>
                  <p className="text-gray-600 text-sm">Enter your email to receive a new verification link</p>
                </div>
                
                {/* Messages Section */}
                <div className="min-h-[40px] flex flex-col justify-start">
                  {status === 'success' && (
                    <div className="bg-green-50 border border-green-200 text-green-600 p-2.5 rounded-lg text-sm mb-3">
                      {message}
                    </div>
                  )}
                  
                  {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-2.5 rounded-lg text-sm mb-3">
                      {message}
                    </div>
                  )}
                </div>
                
                {/* Form Section */}
                <div className="flex-1 flex flex-col justify-center">
                  {status !== 'success' ? (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                          placeholder="Enter your email"
                          disabled={status === 'loading'}
                        />
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
                              Sending...
                            </span>
                          ) : 'Send Verification Link'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col items-center space-y-4 text-center">
                      <div className="bg-green-100 p-3 rounded-full">
                        <Icon name="check" size={40} className="text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-green-700">Email Sent!</h3>
                      <p className="text-gray-600">{message}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        The verification link will expire in 5 minutes.
                      </p>
                      <div className="flex space-x-3 w-full mt-4">
                        <Button 
                          type="button" 
                          className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl" 
                          onClick={() => navigate('/login')}
                        >
                          Go to Login
                        </Button>
                        <Button 
                          type="button" 
                          className="flex-1 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md" 
                          onClick={() => {
                            setStatus('idle');
                            setEmail('');
                          }}
                        >
                          Send Another
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Section */}
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

export default ResendVerification;
