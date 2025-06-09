import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/shared/icons/Icon';
import { useAuth } from '../contexts/auth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendEmailStatus, setResendEmailStatus] = useState(null);
  
  const { login, resendVerification } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when input changes
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {      const { success, error } = await login(formData.email, formData.password);
      
      if (success) {
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        setErrorMessage(error);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setErrorMessage('Please enter your email address to resend verification.');
      return;
    }
    
    setIsLoading(true);
    setResendEmailStatus(null);
    
    try {
      const { success, message, error } = await resendVerification(formData.email);
      
      if (success) {
        setResendEmailStatus({
          type: 'success',
          message: 'Verification link generated. In development mode: Check server console for the verification link.'
        });
        setErrorMessage('');
      } else {
        setResendEmailStatus({
          type: 'error',
          message: error || 'Failed to send verification email. Please try again.'
        });
      }
    } catch (error) {
      setResendEmailStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
      console.error('Resend verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-4">
      <Card className="w-full max-w-2xl overflow-hidden max-h-[90vh]">
        <CardHeader className="space-y-1 py-3">
          <CardTitle className="text-xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Sign in to your Alumni Network account
          </CardDescription>        </CardHeader><Separator className="my-1" />
        <CardContent className="px-4 py-2">
          <form onSubmit={handleSubmit} className="space-y-2">
            {errorMessage && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {errorMessage}
                {errorMessage.includes('verify') && (
                  <button 
                    type="button"
                    onClick={handleResendVerification}
                    className="text-blue-600 font-medium hover:underline ml-2"
                  >
                    Resend verification email
                  </button>
                )}
              </div>
            )}
            
            {resendEmailStatus && (
              <div className={`p-3 rounded-md text-sm ${
                resendEmailStatus.type === 'success' 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-red-50 text-red-600'
              }`}>
                {resendEmailStatus.message}
              </div>
            )}
              <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="you@example.com"
              />
            </div>
              <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Icon name="eye-off" size={20} />
                  ) : (
                    <Icon name="eye" size={20} />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Icon name="loader" size={16} className="animate-spin -ml-1 mr-2 text-white" />
                  Signing in...
                </span>
              ) : 'Sign in'}
            </Button>
          </form>        </CardContent>
        <CardFooter className="py-2">
          <p className="text-sm text-center w-full text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;