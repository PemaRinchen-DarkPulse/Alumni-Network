import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import heroImage from '../assets/images/hero.webp'
import { authService } from '../services/authService'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (success) {
      setCooldown(60) // Start 60 second cooldown
    }
  }, [success])

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => {
        setCooldown(cooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authService.forgotPassword(email)
      
      if (response.success) {
        setSuccess(true)
      } else {
        setError(response.message || 'Failed to send reset email')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0) return
    
    setResending(true)
    setError('')

    try {
      const response = await authService.forgotPassword(email)
      
      if (response.success) {
        setCooldown(60) // Reset cooldown
        // Show a brief success message
        const successMsg = document.getElementById('resend-success')
        if (successMsg) {
          successMsg.style.display = 'block'
          setTimeout(() => {
            successMsg.style.display = 'none'
          }, 3000)
        }
      } else {
        setError(response.message || 'Failed to resend email')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.')
    } finally {
      setResending(false)
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
              <h2>Reset Your Password</h2>
              <p>Enter your email address and we'll send you instructions to reset your password.</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="auth-form-side">
            <div className="auth-header">
              <h1>Forgot Password?</h1>
              <p>No worries! We'll help you reset it.</p>
            </div>

            {success ? (
              <div className="success-message">
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
                
                <div 
                  id="resend-success"
                  style={{ 
                    display: 'none',
                    padding: '12px', 
                    marginBottom: '15px', 
                    backgroundColor: '#d4edda', 
                    color: '#155724', 
                    borderRadius: '8px',
                    fontSize: '14px',
                    border: '1px solid #c3e6cb'
                  }}
                >
                  ✓ Reset email sent again successfully!
                </div>

                <div style={{ 
                  padding: '20px', 
                  marginBottom: '20px', 
                  backgroundColor: '#d4edda', 
                  color: '#155724', 
                  borderRadius: '10px',
                  border: '1px solid #c3e6cb'
                }}>
                  <h3 style={{ marginBottom: '8px', fontSize: '16px', fontWeight: '600' }}>
                    Check Your Email
                  </h3>
                  <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                    We've sent password reset instructions to <strong>{email}</strong>.
                    Please check your inbox and follow the link to reset your password.
                  </p>
                </div>
                <div style={{ 
                  padding: '15px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '8px', 
                  marginBottom: '20px',
                  fontSize: '13px',
                  color: '#666'
                }}>
                  <p style={{ margin: '0 0 8px 0' }}>
                    <strong>Didn't receive the email?</strong>
                  </p>
                  <ul style={{ margin: '0 0 12px 0', paddingLeft: '20px' }}>
                    <li>Check your spam or junk folder</li>
                    <li>Make sure you entered the correct email address</li>
                    <li>Wait a few minutes and try again</li>
                  </ul>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || resending}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: cooldown > 0 || resending ? '#e0e0e0' : '#d4a84b',
                      color: cooldown > 0 || resending ? '#999' : '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: cooldown > 0 || resending ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      marginTop: '8px'
                    }}
                  >
                    {resending 
                      ? 'Sending...' 
                      : cooldown > 0 
                        ? `Resend Email (${cooldown}s)` 
                        : 'Resend Email'}
                  </button>
                </div>
                <Link to="/login" className="auth-submit" style={{ 
                  display: 'block', 
                  textAlign: 'center',
                  textDecoration: 'none'
                }}>
                  Back to Login
                </Link>
              </div>
            ) : (
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
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <div className="auth-footer" style={{ marginTop: '20px' }}>
                  <p>
                    Remember your password? <Link to="/login">Sign in</Link>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
