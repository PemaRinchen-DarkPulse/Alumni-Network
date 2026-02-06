import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { authService } from '../services/authService'
import heroImage from '../assets/images/hero.webp'

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [countdown, setCountdown] = useState(3)
  const hasVerified = useRef(false)

  useEffect(() => {
    const verifyEmail = async () => {
      // Prevent double verification in React Strict Mode
      if (hasVerified.current) return
      hasVerified.current = true

      const token = searchParams.get('token')

      if (!token) {
        setStatus('error')
        setMessage('Invalid verification link. No token provided.')
        return
      }

      try {
        const response = await authService.verifyEmail(token)

        if (response.success) {
          setStatus('success')
          setMessage(response.message)
          
          // If already verified, redirect faster
          const redirectDelay = response.alreadyVerified ? 2000 : 3000
          const countdownStart = response.alreadyVerified ? 2 : 3
          setCountdown(countdownStart)
          
          // Countdown timer
          const timer = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(timer)
                return 0
              }
              return prev - 1
            })
          }, 1000)
          
          // Redirect to login after delay
          setTimeout(() => {
            navigate('/login')
          }, redirectDelay)
        } else {
          if (response.expired) {
            setStatus('expired')
            setEmail(response.email)
            setMessage(response.message)
          } else {
            setStatus('error')
            setMessage(response.message)
          }
        }
      } catch (error: any) {
        setStatus('error')
        setMessage(error.response?.data?.message || 'An error occurred during verification')
      }
    }

    verifyEmail()
  }, [searchParams, navigate])

  const handleResendVerification = async () => {
    if (!email) return

    try {
      const response = await authService.resendVerification(email)
      if (response.success) {
        setStatus('success')
        setMessage('A new verification email has been sent. Please check your inbox.')
      } else {
        setMessage(response.message)
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to resend verification email')
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
              <h2>Email Verification</h2>
              <p>Secure your account by verifying your email address.</p>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="auth-form-side">
            <div style={{ textAlign: 'center' }}>
              {status === 'loading' && (
                <>
                  <div style={{ 
                    fontSize: '64px', 
                    marginBottom: '24px',
                    animation: 'spin 2s linear infinite'
                  }}>
                    ⏳
                  </div>
                  <div className="auth-header" style={{ textAlign: 'center' }}>
                    <h1>Verifying Your Email</h1>
                    <p style={{ marginTop: '12px' }}>Please wait while we verify your email address...</p>
                  </div>
                </>
              )}

              {status === 'success' && (
                <>
                  <div style={{ 
                    fontSize: '64px', 
                    marginBottom: '24px',
                    animation: 'scaleIn 0.5s ease-out'
                  }}>
                    ✅
                  </div>
                  <div className="auth-header" style={{ textAlign: 'center' }}>
                    <h1 style={{ color: '#28a745' }}>Email Verified Successfully!</h1>
                    <p style={{ marginTop: '12px', fontSize: '15px' }}>{message}</p>
                    <p style={{ marginTop: '8px', color: '#666', fontSize: '14px' }}>
                      Redirecting to login in {countdown} second{countdown !== 1 ? 's' : ''}...
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Link 
                      to="/login" 
                      className="btn btn-primary" 
                      style={{ 
                        marginTop: '24px',
                        display: 'inline-block',
                        padding: '12px 32px'
                      }}
                    >
                      Go to Login Now
                    </Link>
                  </div>
                </>
              )}

              {status === 'error' && (
                <>
                  <div style={{ 
                    fontSize: '64px', 
                    marginBottom: '24px',
                    animation: 'shake 0.5s ease-in-out'
                  }}>
                    ❌
                  </div>
                  <div className="auth-header" style={{ textAlign: 'center' }}>
                    <h1 style={{ color: '#dc3545' }}>Verification Failed</h1>
                    <p style={{ marginTop: '12px', fontSize: '15px' }}>{message}</p>
                    <p style={{ marginTop: '8px', color: '#888', fontSize: '14px' }}>
                      If you've already verified your email, try logging in below.
                    </p>
                  </div>
                  <div style={{ 
                    marginTop: '24px', 
                    display: 'flex', 
                    gap: '12px', 
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <Link to="/login" className="btn btn-primary" style={{ padding: '12px 28px' }}>
                      Go to Login
                    </Link>
                    <Link to="/signup" className="btn btn-secondary" style={{ padding: '12px 28px' }}>
                      Sign Up Again
                    </Link>
                  </div>
                </>
              )}

              {status === 'expired' && (
                <>
                  <div style={{ 
                    fontSize: '64px', 
                    marginBottom: '24px',
                    animation: 'bounce 1s ease-in-out infinite'
                  }}>
                    ⏰
                  </div>
                  <div className="auth-header" style={{ textAlign: 'center' }}>
                    <h1 style={{ color: '#ff9800' }}>Verification Link Expired</h1>
                    <p style={{ marginTop: '12px', fontSize: '15px' }}>{message}</p>
                    <p style={{ marginTop: '8px', color: '#888', fontSize: '14px' }}>
                      Don't worry! You can request a new verification link below.
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button 
                      onClick={handleResendVerification}
                      className="btn btn-primary"
                      style={{ 
                        marginTop: '24px',
                        padding: '12px 32px'
                      }}
                    >
                      Resend Verification Email
                    </button>
                  </div>
                  <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <Link 
                      to="/login" 
                      className="forgot-password"
                      style={{ fontSize: '14px' }}
                    >
                      Back to Login
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
