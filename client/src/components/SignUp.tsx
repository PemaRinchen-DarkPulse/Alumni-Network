import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import heroImage from '../assets/images/hero.webp'
import { authService } from '../services/authService'

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    batch: '',
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!acceptedTerms) {
      setError('Please accept the terms and conditions')
      return
    }

    setLoading(true)
    setError('')

    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        batch: formData.batch || undefined,
      }

      const response = await authService.register(registrationData)

      if (response.success) {
        alert('Registration successful! Please check your email to verify your account.')
        navigate('/login')
      } else {
        setError(response.message || 'Registration failed')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  // Generate years for batch selection
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 60 }, (_, i) => currentYear - i)
  
  // Show batch selection for Student and Alumni roles
  const showBatchSelection = formData.role === 'student' || formData.role === 'alumni'

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card signup-card">
          {/* Left Side - Image */}
          <div className="auth-image-side">
            <img src={heroImage} alt="Alumni Network" />
            <div className="auth-overlay-text">
              <h2>Join our community!</h2>
              <p>Create an account and connect with fellow alumni from your institution.</p>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="auth-form-side">
            <div className="auth-header">
              <h1>Create Account</h1>
              <p>Join our community today</p>
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
                <label htmlFor="firstName">Full Name</label>
                <div className="form-row" style={{ gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
                   <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    disabled={loading}
                  />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select Role</option>
                    <option value="student">Student</option>
                    <option value="alumni">Alumni</option>
                    <option value="teacher">Teacher</option>
                  </select>
                </div>

                {showBatchSelection && (
                  <div className="form-group">
                    <label htmlFor="batch">
                     Batch
                    </label>
                    <input
                      type="number"
                      id="batch"
                      name="batch"
                      value={formData.batch}
                      onChange={handleChange}
                      placeholder="e.g. 2016"
                      min="1960"
                      max={currentYear}
                      required
                      disabled={loading}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength={8}
                  disabled={loading}
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    disabled={loading}
                  />
                  <span>I accept the terms and conditions</span>
                </label>
              </div>

              <button type="submit" className="auth-submit btn btn-primary" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Sign in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
