import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/shared/icons/Icon';
import { useAuth } from '../contexts/auth';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    batch: ''
  });
  
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear password error when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordError('');
    }
    
    // Clear registration status on any input change
    if (registrationStatus) {
      setRegistrationStatus(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    // Validate password length
    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setRegistrationStatus(null);
    
    try {
      const { success, data, error } = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        batch: formData.batch
      });
      
      if (success) {
        // Redirect to verification page with email in state
        navigate('/verify-email', { 
          state: { 
            email: formData.email,
            message: 'Registration successful! Please check your email for verification instructions.' 
          } 
        });
      } else {
        setRegistrationStatus({
          type: 'error',
          message: error || 'Registration failed. Please try again.'
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegistrationStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const showBatchField = formData.role === 'alumni' || formData.role === 'student';  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-4">
      <Card className="w-full max-w-2xl overflow-hidden max-h-[90vh]">
        <CardHeader className="space-y-1 py-3">
          <CardTitle className="text-xl font-bold text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Join our High School Alumni Network
          </CardDescription>        </CardHeader><Separator className="my-1" />
        <CardContent className="px-4 py-2 max-h-[calc(100vh-20rem)] overflow-y-auto">
          {registrationStatus && (
            <div className={`p-4 mb-4 rounded-md text-sm ${
              registrationStatus.type === 'success' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {registrationStatus.message}            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="John Doe"
                disabled={isLoading}
              />
            </div>
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
                disabled={isLoading}
              />
            </div>
              <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={isLoading}
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >                  {showPassword ? (
                    <Icon name="eye-off" size={20} />
                  ) : (
                    <Icon name="eye" size={20} />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Password must be at least 8 characters long.</p>
            </div>
              <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <Icon name="eye-off" size={20} />
                  ) : (
                    <Icon name="eye" size={20} />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>
              <div className="space-y-1">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={isLoading}
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
              {showBatchField && (
              <div className="space-y-1">
                <label htmlFor="batch" className="text-sm font-medium">
                  Batch
                </label>
                <input
                  id="batch"
                  name="batch"
                  type="text"
                  value={formData.batch}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="e.g. 2016"
                  disabled={isLoading}
                  required={formData.role === 'student' || formData.role === 'alumni'}
                />
              </div>
            )}
              <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Icon name="loader" size={16} className="animate-spin -ml-1 mr-2 text-white" />
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="py-2">
          <p className="text-sm text-center w-full text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignUp;