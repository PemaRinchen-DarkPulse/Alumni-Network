import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/shared/icons/Icon';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

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

      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Verification email sent successfully. Please check your inbox.');
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to resend verification email. Please try again later.');
      }
    } catch (error) {
      console.error('Error resending verification email:', error);
      setStatus('error');
      setMessage('An error occurred. Please try again later.');
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
          <CardTitle className="text-2xl font-bold text-center">Resend Verification Email</CardTitle>
          <CardDescription className="text-center">
            Enter your email address to receive a new verification link
          </CardDescription>
        </CardHeader>
        <Separator className="my-2" />
        <CardContent className="flex flex-col items-center py-8">
          {status === 'success' ? (            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Icon name="check" size={40} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-700">Email Sent!</h3>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-2">
                The verification link will expire in 5 minutes.
              </p>
              <Button onClick={handleGoToLogin} className="mt-4">
                Go to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              {status === 'error' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{message}</p>
                </div>
              )}

              <div className="flex flex-col space-y-3">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Verification Email'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoToHome}
                >
                  Back to Home
                </Button>
              </div>
            </form>
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

export default ResendVerification;