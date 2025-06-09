import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../contexts/auth';
import { Icon } from '@/components/shared/icons/Icon';

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
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-4">                <div className="flex">
                  <div className="flex-shrink-0">
                    <Icon name="check-circle" size={20} className="text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{message}</p>
                  </div>
                </div>
              </div>
            )}
            
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">                <div className="flex">
                  <div className="flex-shrink-0">
                    <Icon name="x-circle" size={20} className="text-red-500" />
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
                  {status === 'loading' ? (                    <span className="flex items-center justify-center">
                      <Icon name="loader" size={16} className="-ml-1 mr-2 text-white" />
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