import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/auth';
import { Icon } from '@/components/shared/icons/Icon';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Don't proceed if email is empty
    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const { success, message, error } = await forgotPassword(email);

      if (success) {
        setStatus('success');
        setMessage('Password reset instructions sent! Please check your email inbox. If you don\'t see the email, check your spam folder.');
        
        // Clear the email field after successful submission
        setEmail('');
      } else {
        setStatus('error');
        setMessage(error || 'Failed to process your request. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password request error:', error);
      setStatus('error');
      setMessage('An unexpected error occurred. Please try again later.');
    }
  };
  
  const IllustrationSection = () => (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden transition-all duration-500 ease-in-out">
      <img 
        src="https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="Forgot password illustration"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/10">
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <h2 className="text-3xl font-bold mb-4 transition-all duration-500">
            Reset Your Password
          </h2>
          <p className="text-lg text-white/80 max-w-md">
            Don't worry, it happens to the best of us. We'll help you get back in.
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
            <div className="w-full max-w-md">
              <div className="w-full flex flex-col justify-center py-4">
                {/* Lock Icon */}
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-50 p-3 rounded-full">
                    <Icon name="lock" size={28} className="text-blue-600" />
                  </div>
                </div>
                
                {/* Header Section */}
                <div className="text-center mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h1>
                  <p className="text-gray-600 text-sm">
                    Enter your email to reset your password
                  </p>
                </div>
                
                {/* Messages Section */}
                <div className="min-h-[40px] flex flex-col justify-start">
                  {status === 'success' && (
                    <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg text-sm mb-3 flex items-start">
                      <Icon name="check-circle" size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                      <span>{message}</span>
                    </div>
                  )}
                  
                  {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-3 flex items-start">
                      <Icon name="alert-circle" size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                      <span>{message}</span>
                    </div>
                  )}
                </div>
                
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {status !== 'success' && (
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Icon name="mail" size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                          placeholder="Enter your email"
                          disabled={status === 'loading'}
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    {status !== 'success' ? (
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl" 
                        disabled={status === 'loading'}
                      >
                        {status === 'loading' ? (
                          <span className="flex items-center justify-center">
                            <Icon name="loader" size={16} className="animate-spin -ml-1 mr-2 text-white" />
                            Sending Reset Link...
                          </span>
                        ) : 'Send Reset Link'}
                      </Button>
                    ) : (
                      <Button 
                        type="button" 
                        className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl" 
                        onClick={() => navigate('/login')}
                      >
                        Go to Login
                      </Button>
                    )}
                  </div>
                </form>

                {/* Bottom Section */}
                <div className="mt-6 space-y-3">
                  {status !== 'success' && (
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white text-gray-500 font-medium">or</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    {status !== 'success' && (
                      <p className="text-gray-600 text-sm mb-2">
                        Having trouble?
                      </p>
                    )}
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
          
          {/* Right side - Illustration */}
          <IllustrationSection />
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;