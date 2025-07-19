import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/auth';
import { Icon } from '@/components/shared/icons/Icon';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [resetMethod, setResetMethod] = useState('email'); // 'email' or 'phone'
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (resetMethod === 'email') {
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
    } else {
      // Phone number validation
      if (!phone.trim()) {
        setStatus('error');
        setMessage('Please enter your phone number.');
        return;
      }
      
      // Basic phone validation (would need more robust validation in production)
      if (!/^[0-9]{10,}$/.test(phone.replace(/[^0-9]/g, ''))) {
        setStatus('error');
        setMessage('Please enter a valid phone number.');
        return;
      }

      setStatus('loading');
      setMessage('');

      try {
        // This is a placeholder - you would need to implement the actual forgotPasswordByPhone method
        // For now we'll simulate a successful response
        setTimeout(() => {
          setStatus('success');
          setMessage('A verification code has been sent to your phone. Please check your text messages for the code to reset your password.');
          setPhone('');
        }, 1500);
      } catch (error) {
        console.error('Forgot password by phone request error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again later.');
      }
    }
  };
  
  const toggleResetMethod = () => {
    setResetMethod(resetMethod === 'email' ? 'phone' : 'email');
    setStatus('idle');
    setMessage('');
  };
  
  // No illustration section needed for the centered card design

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h1>
            <p className="text-gray-600 text-sm">
              {resetMethod === 'email' 
                ? 'Enter your email to reset your password' 
                : 'Enter your phone number to receive a reset code'}
            </p>
          </div>
          
          {/* Reset Method Tabs */}
          {status !== 'success' && (
            <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
              <button
                type="button"
                onClick={() => resetMethod !== 'email' && toggleResetMethod()}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                  resetMethod === 'email'
                    ? 'bg-white shadow text-gray-800'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="flex items-center justify-center">
                  <Icon name="mail" size={16} className="mr-2" />
                  Email
                </span>
              </button>
              <button
                type="button"
                onClick={() => resetMethod !== 'phone' && toggleResetMethod()}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                  resetMethod === 'phone'
                    ? 'bg-white shadow text-gray-800'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="flex items-center justify-center">
                  <Icon name="phone" size={16} className="mr-2" />
                  Phone
                </span>
              </button>
            </div>
          )}
          
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
          <div className="flex-1 flex flex-col justify-center">
            <form onSubmit={handleSubmit} className="space-y-4">
              {status !== 'success' && resetMethod === 'email' && (
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
              
              {status !== 'success' && resetMethod === 'phone' && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Icon name="phone" size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                      placeholder="Enter your phone number"
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
                        {resetMethod === 'email' ? 'Sending Reset Link...' : 'Sending Code...'}
                      </span>
                    ) : resetMethod === 'email' ? 'Send Reset Link' : 'Send Verification Code'}
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
          </div>

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
  );
}

export default ForgotPassword;