import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/icons/Icon';
import { useAuth } from '../contexts/auth';

// Login Form Component - Memoized to prevent unnecessary re-renders
const LoginForm = React.memo(({ 
  loginData, 
  onLoginChange, 
  onLoginSubmit, 
  showPassword, 
  setShowPassword, 
  isLoading, 
  errorMessage, 
  resendEmailStatus, 
  onResendVerification, 
  onToggle 
}) => (
  <div className="w-full flex flex-col justify-center min-h-full py-4">
    {/* Header Section - Fixed */}
    <div className="text-center mb-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
      <p className="text-gray-600 text-sm">Please sign in to your account</p>
    </div>

    {/* Messages Section - Dynamic height */}
    <div className="min-h-[40px] flex flex-col justify-start">
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-2.5 rounded-lg text-sm mb-3">
          {errorMessage}
          {errorMessage.includes('verify') && (
            <button 
              type="button"
              onClick={onResendVerification}
              className="text-blue-600 font-medium hover:underline ml-2"
            >
              Resend verification email
            </button>
          )}
        </div>
      )}
      
      {resendEmailStatus && (
        <div className={`p-2.5 rounded-lg text-sm border mb-3 ${
          resendEmailStatus.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-600' 
            : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          {resendEmailStatus.message}
        </div>
      )}
    </div>

    {/* Form Section - Flexible */}
    <div className="flex-1 flex flex-col justify-center">
      <form onSubmit={onLoginSubmit} className="space-y-3">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={loginData.email}
            onChange={onLoginChange}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
            placeholder="Enter your email"
          />
        </div>

        <div>          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={loginData.password}
              onChange={onLoginChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Icon name="eye-off" size={18} />
              ) : (
                <Icon name="eye" size={18} />
              )}
            </button>
          </div>
        </div>

        <div className="pt-3">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Icon name="loader" size={16} className="animate-spin -ml-1 mr-2 text-white" />
                Signing in...
              </span>
            ) : 'Sign In'}
          </Button>
        </div>
      </form>
    </div>

    {/* Bottom Section - Fixed */}
    <div className="space-y-3 mt-5">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-500 font-medium">Or continue with</span>
        </div>
      </div>      {/* Google Login Button */}
      <button className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium">
        <Icon name="google" size={18} />
        <span className="text-gray-700">Continue with Google</span>
      </button>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Don't have an account?{" "}
          <button 
            onClick={() => onToggle(false)}
            className="text-blue-600 font-medium hover:text-blue-500 transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  </div>
));

// Signup Form Component - Memoized to prevent unnecessary re-renders
const SignupForm = React.memo(({ 
  signupData, 
  onSignupChange, 
  onSignupSubmit, 
  showPassword, 
  setShowPassword, 
  showConfirmPassword, 
  setShowConfirmPassword, 
  isLoading, 
  registrationStatus, 
  passwordError, 
  showBatchField, 
  onToggle 
}) => (
  <div className="w-full flex flex-col justify-center min-h-full">
    {/* Header Section - Fixed */}
    <div className="text-center mt-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
      <p className="text-gray-600 text-sm">Join our community today</p>
    </div>

    {/* Messages Section - Dynamic height */}
    <div className="min-h-[40px] flex flex-col justify-start">
      {registrationStatus && (
        <div className={`p-2.5 rounded-lg text-sm border mb-3 ${
          registrationStatus.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-600' 
            : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          {registrationStatus.message}
        </div>
      )}
    </div>

    {/* Form Section - No scroll, compact spacing */}
    <div className="flex-1 flex flex-col justify-center">
      <form onSubmit={onSignupSubmit} className="space-y-2.5">
        <div className="space-y-2.5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={signupData.name}
              onChange={onSignupChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm"
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              value={signupData.email}
              onChange={onSignupChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={signupData.role}
                onChange={onSignupChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm"
                disabled={isLoading}
              >
                <option value="student">Student</option>
                <option value="alumni">Alumni</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            {showBatchField && (
              <div>
                <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">
                  Batch
                </label>
                <input
                  id="batch"
                  name="batch"
                  type="text"
                  value={signupData.batch}
                  onChange={onSignupChange}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm"
                  placeholder="e.g. 2016"
                  disabled={isLoading}
                  required={signupData.role === 'student' || signupData.role === 'alumni'}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={signupData.password}
                onChange={onSignupChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm pr-10"
                placeholder="Create a password"
                disabled={isLoading}
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? (
                  <Icon name="eye-off" size={18} />
                ) : (
                  <Icon name="eye" size={18} />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={signupData.confirmPassword}
                onChange={onSignupChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 shadow-sm pr-10"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <Icon name="eye-off" size={18} />
                ) : (
                  <Icon name="eye" size={18} />
                )}
              </button>
            </div>            {passwordError && (
              <p className="text-xs text-red-500 mt-1">{passwordError}</p>
            )}
          </div>
        </div>

        <div className="pt-3">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl" 
            disabled={isLoading || (signupData.confirmPassword && passwordError)}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Icon name="loader" size={16} className="animate-spin -ml-1 mr-2 text-white" />
                Creating Account...
              </span>
            ) : 'Create Account'}
          </Button>
        </div>
      </form>
    </div>

    {/* Bottom Section - Fixed */}
    <div className="space-y-3 mt-5">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-500 font-medium">Or continue with</span>
        </div>
      </div>      {/* Google Login Button */}
      <button className="w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium">
        <Icon name="google" size={18} />
        <span className="text-gray-700">Continue with Google</span>
      </button>

      {/* Sign In Link */}
      <div className="text-center mb-10">
        <p className="text-gray-600 text-sm">
          Already have an account?{" "}
          <button 
            onClick={() => onToggle(true)}
            className="text-orange-600 font-medium hover:text-orange-500 transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  </div>
));

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    batch: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState(null);
  const [resendEmailStatus, setResendEmailStatus] = useState(null);
  
  const { login, register, resendVerification } = useAuth();

  const handleToggle = (loginMode) => {
    setIsLogin(loginMode);
    setErrorMessage('');
    setPasswordError('');
    setRegistrationStatus(null);
    setResendEmailStatus(null);
    
    // Update URL without page reload
    if (loginMode) {
      window.history.pushState({}, '', '/login');
    } else {
      window.history.pushState({}, '', '/signup');
    }
  };
  const handleLoginChange = useCallback((e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errorMessage) {
      setErrorMessage('');
    }
  }, [errorMessage]);

  const handleSignupChange = useCallback((e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Real-time password validation
    if (name === 'password' || name === 'confirmPassword') {
      const password = name === 'password' ? value : signupData.password;
      const confirmPassword = name === 'confirmPassword' ? value : signupData.confirmPassword;
      
      if (confirmPassword && password !== confirmPassword) {
        setPasswordError('Passwords do not match');
      } else if (password && password.length < 8) {
        setPasswordError('Password must be at least 8 characters long');
      } else {
        setPasswordError('');
      }
    }
    
    if (registrationStatus) {
      setRegistrationStatus(null);
    }
  }, [registrationStatus, signupData.password, signupData.confirmPassword]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const { success, error } = await login(loginData.email, loginData.password);
      
      if (success) {
        navigate('/dashboard');
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
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation check before submission
    if (signupData.password !== signupData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (signupData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setRegistrationStatus(null);
    
    try {
      const { success, data, error } = await register({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        role: signupData.role,
        batch: signupData.batch
      });
        if (success) {
        // Redirect to verify-email page with clear message about the verification email
        navigate('/verify-email', { 
          state: { 
            email: signupData.email,
            message: 'Registration successful! A verification link has been sent to your email address. Please check your inbox and follow the instructions to verify your account.' 
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

  const handleResendVerification = async () => {
    if (!loginData.email) {
      setErrorMessage('Please enter your email address to resend verification.');
      return;
    }
    
    setIsLoading(true);
    setResendEmailStatus(null);
    
    try {
      const { success, message, error } = await resendVerification(loginData.email);
      
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
  };  const showBatchField = useMemo(() => 
    signupData.role === 'alumni' || signupData.role === 'student', 
    [signupData.role]
  );  const IllustrationSection = ({ isLoginView }) => (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden transition-all duration-500 ease-in-out">
      <img 
        src={isLoginView 
          ? "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          : "https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        }
        alt={isLoginView ? "University campus" : "Graduation ceremony"}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/10">
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <h2 className="text-3xl font-bold mb-4 transition-all duration-500">
            {isLoginView ? "Welcome back!" : "Join our community!"}
          </h2>
          <p className="text-lg text-white/80 max-w-md">
            {isLoginView 
              ? "Access your alumni dashboard and connect with your network."
              : "Create an account and connect with fellow alumni from your institution."}
          </p>
        </div>
      </div>
    </div>
  );return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex h-[700px]">
          {/* Conditional Layout Based on Mode */}
          {isLogin ? (
            <>
              {/* Login: Form on Left, Illustration on Right */}
              <div className="w-full lg:w-1/2 flex items-center justify-center p-8 transition-all duration-500 ease-in-out">
                <div className="w-full max-w-md flex items-center justify-center min-h-full">
                  <LoginForm 
                    loginData={loginData}
                    onLoginChange={handleLoginChange}
                    onLoginSubmit={handleLoginSubmit}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    isLoading={isLoading}
                    errorMessage={errorMessage}
                    resendEmailStatus={resendEmailStatus}
                    onResendVerification={handleResendVerification}
                    onToggle={handleToggle}
                  />
                </div>
              </div>
              <IllustrationSection isLoginView={true} />
            </>
          ) : (
            <>
              {/* Signup: Illustration on Left, Form on Right */}
              <IllustrationSection isLoginView={false} />
              <div className="w-full lg:w-1/2 flex items-center justify-center p-8 transition-all duration-500 ease-in-out">
                <div className="w-full max-w-md flex items-center justify-center min-h-full">
                  <SignupForm 
                    signupData={signupData}
                    onSignupChange={handleSignupChange}
                    onSignupSubmit={handleSignupSubmit}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                    isLoading={isLoading}
                    registrationStatus={registrationStatus}
                    passwordError={passwordError}
                    showBatchField={showBatchField}
                    onToggle={handleToggle}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;