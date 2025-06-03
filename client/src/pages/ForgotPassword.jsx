import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../contexts/auth';

const ForgotPassword = () => {
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you instructions to reset your password
          </CardDescription>
        </CardHeader>
        <Separator className="my-2" />
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{message}</p>
                  </div>
                </div>
              </div>
            )}
            
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{message}</p>
                  </div>
                </div>
              </div>
            )}
            
            {status !== 'success' && (
              <>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="you@example.com"
                    disabled={status === 'loading'}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : 'Send Reset Instructions'}
                </Button>
              </>
            )}
            
            {status === 'success' && (
              <div className="flex space-x-3">
                <Button 
                  type="button" 
                  variant="outline"
                  className="flex-1" 
                  onClick={() => navigate('/login')}
                >
                  Go to Login
                </Button>
                
                <Button 
                  type="button" 
                  className="flex-1" 
                  onClick={() => setStatus('idle')}
                >
                  Reset Another Password
                </Button>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col space-y-2 text-center w-full text-sm">
            {status !== 'success' && (
              <Link to="/login" className="text-primary font-medium hover:underline">
                Back to Login
              </Link>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;