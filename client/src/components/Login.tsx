import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import heroImage from '../assets/images/hero.webp'
import { authService } from '../services/authService'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showResendLink, setShowResendLink] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
    setShowResendLink(false)
    setResendMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShowResendLink(false)
    setResendMessage('')

    try {
      const response = await authService.login(formData)
      
      if (response.success && response.token && response.user) {
        // Update AuthContext with user and token
        login(response.token, response.user)
        // Navigate to dashboard
        navigate('/dashboard')
      } else {
        setError(response.message || 'Login failed')
        // Check if error is related to email verification
        if (response.message?.toLowerCase().includes('verify your email')) {
          setShowResendLink(true)
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred during login'
      setError(errorMessage)
      // Check if error is related to email verification
      if (errorMessage.toLowerCase().includes('verify your email')) {
        setShowResendLink(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!formData.email) {
      setResendMessage('Please enter your email address')
      return
    }

    setResendLoading(true)
    setResendMessage('')

    try {
      const response = await authService.resendVerification(formData.email)
      if (response.success) {
        setResendMessage('Verification email sent! Please check your inbox.')
        setError('')
      } else {
        setResendMessage(response.message || 'Failed to resend verification email')
      }
    } catch (err: any) {
      setResendMessage(err.response?.data?.message || 'Failed to resend verification email')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {/* Left Side - Image */}
          <div className="auth-image-side">
            <img src={heroImage} alt="Alumni Network" />
            <div className="auth-overlay-text">
              <h2>Join our community!</h2>
              <p>Connect with fellow alumni and stay updated with your institution.</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="auth-form-side">
            <div className="auth-header">
              <h1>Welcome Back</h1>
              <p>Sign in to your Alumni Network account</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div style={{ 
                  padding: '10px', 
                  marginBottom: '15px', 
                  backgroundColor: '#fee', 
                  color: '#c33', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>
                  {error}
                  {showResendLink && (
                    <div style={{ marginTop: '8px' }}>
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resendLoading}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2196F3',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          fontSize: '14px',
                          padding: '0'
                        }}
                      >
                        {resendLoading ? 'Sending...' : 'Resend verification email'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {resendMessage && (
                <div style={{ 
                  padding: '10px', 
                  marginBottom: '15px', 
                  backgroundColor: resendMessage.includes('sent') ? '#e8f5e9' : '#fee', 
                  color: resendMessage.includes('sent') ? '#2e7d32' : '#c33', 
                  borderRadius: '4px',
                  fontSize: '14px'
                }}>
                  {resendMessage}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                  <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
