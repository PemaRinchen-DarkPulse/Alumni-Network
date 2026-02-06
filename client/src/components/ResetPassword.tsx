import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import heroImage from '../assets/images/hero.webp'
import { authService } from '../services/authService'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [error, setError] = useState('')
  const [tokenValid, setTokenValid] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError('Invalid or missing reset token')
        setValidating(false)
        return
      }

      try {
        const response = await authService.validateResetToken(token)
        if (response.success) {
          setTokenValid(true)
        } else {
          setError(response.message || 'This password reset link is invalid or has expired.')
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'This password reset link is invalid or has expired.')
      } finally {
        setValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await authService.resetPassword(token!, formData.password)
      
      if (response.success) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        setError(response.message || 'Failed to reset password')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
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
              <h2>Create New Password</h2>
              <p>Choose a strong password to secure your account.</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="auth-form-side">
            {validating ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div className="spinner" style={{ 
                  margin: '0 auto 16px', 
                  width: '40px', 
                  height: '40px',
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #d4a84b',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ color: '#666', fontSize: '14px' }}>Validating reset link...</p>
              </div>
            ) : !tokenValid ? (
              <div>
                <div className="auth-header">
                  <h1>Invalid Reset Link</h1>
                  <p>This password reset link is invalid or has expired.</p>
                </div>
                <div style={{ 
                  padding: '20px', 
                  marginBottom: '20px', 
                  backgroundColor: '#fee', 
                  color: '#c33', 
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  {error}
                </div>
                <Link to="/forgot-password" className="auth-submit" style={{ 
                  display: 'block', 
                  textAlign: 'center',
                  textDecoration: 'none',
                  marginBottom: '16px'
                }}>
                  Request New Reset Link
                </Link>
                <div className="auth-footer">
                  <p>
                    Remember your password? <Link to="/login">Sign in</Link>
                  </p>
                </div>
              </div>
            ) : success ? (
              <div>
                <div className="auth-header">
                  <h1>Password Reset Successfully!</h1>
                  <p>Your password has been changed.</p>
                </div>
                <div style={{ 
                  padding: '20px', 
                  marginBottom: '20px', 
                  backgroundColor: '#d4edda', 
                  color: '#155724', 
                  borderRadius: '10px',
                  border: '1px solid #c3e6cb'
                }}>
                  <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                    Your password has been successfully reset. You can now log in with your new password.
                  </p>
                </div>
                <p style={{ 
                  textAlign: 'center', 
                  color: '#666', 
                  fontSize: '14px',
                  marginBottom: '20px'
                }}>
                  Redirecting to login page...
                </p>
                <Link to="/login" className="auth-submit" style={{ 
                  display: 'block', 
                  textAlign: 'center',
                  textDecoration: 'none'
                }}>
                  Go to Login
                </Link>
              </div>
            ) : (
              <div>
                <div className="auth-header">
                  <h1>Reset Your Password</h1>
                  <p>Enter your new password below</p>
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
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="password">New Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      required
                      minLength={8}
                      disabled={loading}
                    />
                    <small style={{ fontSize: '12px', color: '#666' }}>
                      Must be at least 8 characters long
                    </small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter new password"
                      required
                      minLength={8}
                      disabled={loading}
                    />
                  </div>

                  <button type="submit" className="auth-submit" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>

                  <div className="auth-footer" style={{ marginTop: '20px' }}>
                    <p>
                      Remember your password? <Link to="/login">Sign in</Link>
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
