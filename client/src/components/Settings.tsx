import { useState, useEffect } from 'react'
import { 
  User, Lock, Eye, EyeOff, Bell, Palette, Shield, 
  Upload, Save, AlertCircle, CheckCircle, Globe,
  Calendar, Briefcase, GraduationCap, Target, MapPin
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { settingsService, type UserSettings } from '../services/settingsService'
import '../styles/Settings.css'

const Settings = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('account')
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // Global Settings State
  const [accountSettings, setAccountSettings] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    timeZone: 'UTC',
    profilePhoto: ''
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'network',
    showEmail: true,
    showPhone: false,
    canMessageMe: 'everyone',
    canSendConnectionRequests: 'everyone'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      messages: true,
      mentorshipRequests: true,
      eventReminders: true
    },
    inAppNotifications: {
      mentions: true,
      announcements: true
    },
    digestFrequency: 'daily'
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    language: 'en',
    theme: 'light',
    dateFormat: 'MM/DD/YYYY'
  })

  // Alumni-Specific Settings
  const [mentorshipSettings, setMentorshipSettings] = useState({
    mentorshipStatus: 'accepting',
    expertiseAreas: [] as string[],
    preferredMenteeLevel: 'student',
    availability: 'monthly',
    sessionFormat: ['chat', 'video']
  })

  const [professionalProfile, setProfessionalProfile] = useState({
    currentRole: '',
    organization: '',
    industry: '',
    skills: [] as string[],
    willingToHelp: [] as string[]
  })

  // Teacher-Specific Settings
  const [teachingSettings, setTeachingSettings] = useState({
    academicExpertise: [] as string[],
    mentorshipAvailability: true,
    studentLevelPreference: 'all'
  })

  const [moderationSettings, setModerationSettings] = useState({
    receiveReportedContentAlerts: true,
    approveMentorshipRequests: false,
    canPinPosts: false
  })

  // Student-Specific Settings
  const [learningSettings, setLearningSettings] = useState({
    lookingFor: [] as string[],
    preferredMentors: ['alumni', 'teachers'],
    topicsOfInterest: [] as string[]
  })

  const [careerSettings, setCareerSettings] = useState({
    industriesOfInterest: [] as string[],
    locationPreference: '',
    openToOpportunities: true
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const settings = await settingsService.getUserSettings()
      
      // Populate all settings from backend
      if (settings.account) {
        setAccountSettings(prev => ({ ...prev, ...settings.account }))
      }
      if (settings.privacy) {
        setPrivacySettings(settings.privacy)
      }
      if (settings.notifications) {
        setNotificationSettings(settings.notifications)
      }
      if (settings.appearance) {
        setAppearanceSettings(settings.appearance)
      }
      if (settings.mentorship) {
        setMentorshipSettings(settings.mentorship)
      }
      if (settings.professional) {
        setProfessionalProfile(settings.professional)
      }
      if (settings.teaching) {
        setTeachingSettings(settings.teaching)
      }
      if (settings.moderation) {
        setModerationSettings(settings.moderation)
      }
      if (settings.learning) {
        setLearningSettings(settings.learning)
      }
      if (settings.career) {
        setCareerSettings(settings.career)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaveStatus('saving')
      setMessage('')

      const settingsData: Partial<UserSettings> = {
        account: accountSettings,
        privacy: privacySettings,
        notifications: notificationSettings,
        appearance: appearanceSettings
      }

      // Add role-specific settings
      if (user?.role?.toLowerCase() === 'alumni') {
        settingsData.mentorship = mentorshipSettings
        settingsData.professional = professionalProfile
      } else if (user?.role?.toLowerCase() === 'teacher') {
        settingsData.teaching = teachingSettings
        settingsData.moderation = moderationSettings
      } else if (user?.role?.toLowerCase() === 'student') {
        settingsData.learning = learningSettings
        settingsData.career = careerSettings
      }

      await settingsService.updateSettings(settingsData)
      setSaveStatus('success')
      setMessage('Settings saved successfully!')
      
      setTimeout(() => {
        setSaveStatus('idle')
        setMessage('')
      }, 3000)
    } catch (error: any) {
      setSaveStatus('error')
      setMessage(error.response?.data?.message || 'Failed to save settings')
      setTimeout(() => {
        setSaveStatus('idle')
        setMessage('')
      }, 3000)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAccountSettings(prev => ({
          ...prev,
          profilePhoto: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const renderAccountSettings = () => (
    <div className="settings-section">
      <h2 className="section-title">
        <User size={20} />
        Account
      </h2>
      
      <div className="settings-card">
        <div className="form-group">
          <label>Profile Photo</label>
          <div className="photo-upload">
            <div className="photo-preview">
              {accountSettings.profilePhoto ? (
                <img src={accountSettings.profilePhoto} alt="Profile" />
              ) : (
                <User size={40} />
              )}
            </div>
            <label htmlFor="photo-upload" className="upload-btn">
              <Upload size={16} />
              Upload Photo
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={accountSettings.fullName}
            onChange={(e) => setAccountSettings(prev => ({ ...prev, fullName: e.target.value }))}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <div className="input-with-badge">
            <input
              type="email"
              value={accountSettings.email}
              readOnly
              className="form-input"
              disabled
            />
            {user?.emailVerified && (
              <span className="verified-badge">
                <CheckCircle size={16} />
                Verified
              </span>
            )}
          </div>
        </div>

        <div className="form-divider" />

        <div className="form-group">
          <label>Change Password</label>
          <input
            type="password"
            placeholder="Current Password"
            value={accountSettings.currentPassword}
            onChange={(e) => setAccountSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="form-input"
          />
          <input
            type="password"
            placeholder="New Password"
            value={accountSettings.newPassword}
            onChange={(e) => setAccountSettings(prev => ({ ...prev, newPassword: e.target.value }))}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={accountSettings.confirmPassword}
            onChange={(e) => setAccountSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Time Zone</label>
          <select
            value={accountSettings.timeZone}
            onChange={(e) => setAccountSettings(prev => ({ ...prev, timeZone: e.target.value }))}
            className="form-select"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Asia/Kolkata">India</option>
          </select>
        </div>

        <div className="form-divider" />

        <div className="locked-info">
          <Lock size={16} />
          <span>Role and institution information are managed by administrators</span>
        </div>

        <button className="danger-btn">Deactivate Account</button>
      </div>
    </div>
  )

  const renderPrivacySettings = () => (
    <div className="settings-section">
      <h2 className="section-title">
        <Eye size={20} />
        Privacy & Visibility
      </h2>
      
      <div className="settings-card">
        <div className="form-group">
          <label>Profile Visibility</label>
          <select
            value={privacySettings.profileVisibility}
            onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
            className="form-select"
          >
            <option value="network">Network Only</option>
            <option value="connections">Connections Only</option>
            <option value="public">Public</option>
          </select>
        </div>

        <div className="form-divider" />

        <div className="toggle-group">
          <div className="toggle-item">
            <div>
              <h4>Show Email</h4>
              <p>Make your email visible to connections</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={privacySettings.showEmail}
                onChange={(e) => setPrivacySettings(prev => ({ ...prev, showEmail: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div>
              <h4>Show Phone</h4>
              <p>Make your phone number visible to connections</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={privacySettings.showPhone}
                onChange={(e) => setPrivacySettings(prev => ({ ...prev, showPhone: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="form-divider" />

        <div className="form-group">
          <label>Who Can Message Me</label>
          <select
            value={privacySettings.canMessageMe}
            onChange={(e) => setPrivacySettings(prev => ({ ...prev, canMessageMe: e.target.value }))}
            className="form-select"
          >
            <option value="everyone">Everyone</option>
            <option value="connections">Connections Only</option>
            <option value="nobody">Nobody</option>
          </select>
        </div>

        <div className="form-group">
          <label>Who Can Send Connection Requests</label>
          <select
            value={privacySettings.canSendConnectionRequests}
            onChange={(e) => setPrivacySettings(prev => ({ ...prev, canSendConnectionRequests: e.target.value }))}
            className="form-select"
          >
            <option value="everyone">Everyone</option>
            <option value="verified">Verified Users Only</option>
            <option value="nobody">Nobody</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h2 className="section-title">
        <Bell size={20} />
        Notifications
      </h2>
      
      <div className="settings-card">
        <h3 className="subsection-title">Email Notifications</h3>
        
        <div className="toggle-group">
          <div className="toggle-item">
            <div>
              <h4>Messages</h4>
              <p>Get notified when you receive messages</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications.messages}
                onChange={(e) => setNotificationSettings(prev => ({
                  ...prev,
                  emailNotifications: { ...prev.emailNotifications, messages: e.target.checked }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div>
              <h4>Mentorship Requests</h4>
              <p>Get notified about new mentorship requests</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications.mentorshipRequests}
                onChange={(e) => setNotificationSettings(prev => ({
                  ...prev,
                  emailNotifications: { ...prev.emailNotifications, mentorshipRequests: e.target.checked }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div>
              <h4>Event Reminders</h4>
              <p>Receive reminders for upcoming events</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notificationSettings.emailNotifications.eventReminders}
                onChange={(e) => setNotificationSettings(prev => ({
                  ...prev,
                  emailNotifications: { ...prev.emailNotifications, eventReminders: e.target.checked }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="form-divider" />

        <h3 className="subsection-title">In-App Notifications</h3>
        
        <div className="toggle-group">
          <div className="toggle-item">
            <div>
              <h4>Mentions</h4>
              <p>Get notified when someone mentions you</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notificationSettings.inAppNotifications.mentions}
                onChange={(e) => setNotificationSettings(prev => ({
                  ...prev,
                  inAppNotifications: { ...prev.inAppNotifications, mentions: e.target.checked }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div>
              <h4>Announcements</h4>
              <p>Receive important platform announcements</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={notificationSettings.inAppNotifications.announcements}
                onChange={(e) => setNotificationSettings(prev => ({
                  ...prev,
                  inAppNotifications: { ...prev.inAppNotifications, announcements: e.target.checked }
                }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="form-divider" />

        <div className="form-group">
          <label>Digest Frequency</label>
          <select
            value={notificationSettings.digestFrequency}
            onChange={(e) => setNotificationSettings(prev => ({ ...prev, digestFrequency: e.target.value }))}
            className="form-select"
          >
            <option value="instant">Instant</option>
            <option value="daily">Daily Digest</option>
            <option value="weekly">Weekly Digest</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderAppearanceSettings = () => (
    <div className="settings-section">
      <h2 className="section-title">
        <Palette size={20} />
        Appearance & Preferences
      </h2>
      
      <div className="settings-card">
        <div className="form-group">
          <label>Language</label>
          <select
            value={appearanceSettings.language}
            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, language: e.target.value }))}
            className="form-select"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <div className="form-group">
          <label>Theme</label>
          <div className="theme-options">
            <button
              className={`theme-btn ${appearanceSettings.theme === 'light' ? 'active' : ''}`}
              onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: 'light' }))}
            >
              <div className="theme-preview light"></div>
              Light Mode
            </button>
            <button
              className={`theme-btn ${appearanceSettings.theme === 'dark' ? 'active' : ''}`}
              onClick={() => setAppearanceSettings(prev => ({ ...prev, theme: 'dark' }))}
            >
              <div className="theme-preview dark"></div>
              Dark Mode
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Date & Time Format</label>
          <select
            value={appearanceSettings.dateFormat}
            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
            className="form-select"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY (UK)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderSafetySettings = () => (
    <div className="settings-section">
      <h2 className="section-title">
        <Shield size={20} />
        Safety & Support
      </h2>
      
      <div className="settings-card">
        <div className="safety-links">
          <button className="link-btn">
            <EyeOff size={18} />
            <div>
              <h4>Blocked Users</h4>
              <p>Manage users you've blocked</p>
            </div>
          </button>

          <button className="link-btn">
            <AlertCircle size={18} />
            <div>
              <h4>Report Content</h4>
              <p>Report inappropriate content or behavior</p>
            </div>
          </button>

          <button className="link-btn">
            <Shield size={18} />
            <div>
              <h4>Help & Support</h4>
              <p>Get help or contact support</p>
            </div>
          </button>

          <button className="link-btn">
            <Globe size={18} />
            <div>
              <h4>Terms & Privacy</h4>
              <p>View our terms of service and privacy policy</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )

  // Alumni-Specific Sections
  const renderMentorshipSettings = () => (
    <div className="settings-section">
      <h2 className="section-title">
        <GraduationCap size={20} />
        Mentorship Settings
      </h2>
      
      <div className="settings-card">
        <div className="form-group">
          <label>Mentorship Status</label>
          <select
            value={mentorshipSettings.mentorshipStatus}
            onChange={(e) => setMentorshipSettings(prev => ({ ...prev, mentorshipStatus: e.target.value }))}
            className="form-select"
          >
            <option value="accepting">Accepting Requests</option>
            <option value="paused">Paused</option>
            <option value="not-available">Not Available</option>
          </select>
        </div>

        <div className="form-group">
          <label>Expertise Areas</label>
          <input
            type="text"
            placeholder="e.g., Software Development, Marketing"
            value={mentorshipSettings.expertiseAreas.join(', ')}
            onChange={(e) => setMentorshipSettings(prev => ({
              ...prev,
              expertiseAreas: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            }))}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Preferred Mentee Level</label>
          <select
            value={mentorshipSettings.preferredMenteeLevel}
            onChange={(e) => setMentorshipSettings(prev => ({ ...prev, preferredMenteeLevel: e.target.value }))}
            className="form-select"
          >
            <option value="student">Students Only</option>
            <option value="alumni">Alumni Only</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div className="form-group">
          <label>Availability</label>
          <select
            value={mentorshipSettings.availability}
            onChange={(e) => setMentorshipSettings(prev => ({ ...prev, availability: e.target.value }))}
            className="form-select"
          >
            <option value="monthly">Once a Month</option>
            <option value="quarterly">Once a Quarter</option>
            <option value="on-demand">On Demand</option>
          </select>
        </div>

        <div className="form-group">
          <label>Session Format</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={mentorshipSettings.sessionFormat.includes('chat')}
                onChange={(e) => {
                  const formats = e.target.checked
                    ? [...mentorshipSettings.sessionFormat, 'chat']
                    : mentorshipSettings.sessionFormat.filter(f => f !== 'chat')
                  setMentorshipSettings(prev => ({ ...prev, sessionFormat: formats }))
                }}
              />
              Chat
            </label>
            <label>
              <input
                type="checkbox"
                checked={mentorshipSettings.sessionFormat.includes('video')}
                onChange={(e) => {
                  const formats = e.target.checked
                    ? [...mentorshipSettings.sessionFormat, 'video']
                    : mentorshipSettings.sessionFormat.filter(f => f !== 'video')
                  setMentorshipSettings(prev => ({ ...prev, sessionFormat: formats }))
                }}
              />
              Video Call
            </label>
            <label>
              <input
                type="checkbox"
                checked={mentorshipSettings.sessionFormat.includes('in-person')}
                onChange={(e) => {
                  const formats = e.target.checked
                    ? [...mentorshipSettings.sessionFormat, 'in-person']
                    : mentorshipSettings.sessionFormat.filter(f => f !== 'in-person')
                  setMentorshipSettings(prev => ({ ...prev, sessionFormat: formats }))
                }}
              />
              In-Person
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderProfessionalProfile = () => (
    <div className="settings-section">
      <h2 className="section-title">
        <Briefcase size={20} />
        Professional Profile
      </h2>
      
      <div className="settings-card">
        <div className="form-group">
          <label>Current Role</label>
          <input
            type="text"
            placeholder="e.g., Senior Software Engineer"
            value={professionalProfile.currentRole}
            onChange={(e) => setProfessionalProfile(prev => ({ ...prev, currentRole: e.target.value }))}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Organization</label>
          <input
            type="text"
            placeholder="e.g., Google"
            value={professionalProfile.organization}
            onChange={(e) => setProfessionalProfile(prev => ({ ...prev, organization: e.target.value }))}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Industry</label>
          <input
            type="text"
            placeholder="e.g., Technology"
            value={professionalProfile.industry}
            onChange={(e) => setProfessionalProfile(prev => ({ ...prev, industry: e.target.value }))}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Skills & Interests</label>
          <input
            type="text"
            placeholder="e.g., JavaScript, React, Node.js"
            value={professionalProfile.skills.join(', ')}
            onChange={(e) => setProfessionalProfile(prev => ({
              ...prev,
              skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            }))}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Willing to Help With</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={professionalProfile.willingToHelp.includes('career-guidance')}
                onChange={(e) => {
                  const help = e.target.checked
                    ? [...professionalProfile.willingToHelp, 'career-guidance']
                    : professionalProfile.willingToHelp.filter(h => h !== 'career-guidance')
                  setProfessionalProfile(prev => ({ ...prev, willingToHelp: help }))
                }}
              />
              Career Guidance
            </label>
            <label>
              <input
                type="checkbox"
                checked={professionalProfile.willingToHelp.includes('internships')}
                onChange={(e) => {
                  const help = e.target.checked
                    ? [...professionalProfile.willingToHelp, 'internships']
                    : professionalProfile.willingToHelp.filter(h => h !== 'internships')
                  setProfessionalProfile(prev => ({ ...prev, willingToHelp: help }))
                }}
              />
              Internships
            </label>
            <label>
              <input
                type="checkbox"
                checked={professionalProfile.willingToHelp.includes('referrals')}
                onChange={(e) => {
                  const help = e.target.checked
                    ? [...professionalProfile.willingToHelp, 'referrals']
                    : professionalProfile.willingToHelp.filter(h => h !== 'referrals')
                  setProfessionalProfile(prev => ({ ...prev, willingToHelp: help }))
                }}
              />
              Referrals
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  // Teacher-Specific Sections
  const renderTeachingSettings = () => (
    <div className="settings-section">
      <h2 className="section-title">
        <GraduationCap size={20} />
        Teaching & Mentorship
      </h2>
      
      <div className="settings-card">
        <div className="form-group">
          <label>Areas of Academic Expertise</label>
          <input
            type="text"
            placeholder="e.g., Mathematics, Physics, Computer Science"
            value={teachingSettings.academicExpertise.join(', ')}
            onChange={(e) => setTeachingSettings(prev => ({
              ...prev,
              academicExpertise: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            }))}
            className="form-input"
          />
        </div>

        <div className="toggle-item">
          <div>
            <h4>Mentorship Availability</h4>
            <p>Available to mentor students</p>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={teachingSettings.mentorshipAvailability}
              onChange={(e) => setTeachingSettings(prev => ({ ...prev, mentorshipAvailability: e.target.checked }))}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="form-group">
          <label>Student Level Preference</label>
          <select
            value={teachingSettings.studentLevelPreference}
            onChange={(e) => setTeachingSettings(prev => ({ ...prev, studentLevelPreference: e.target.value }))}
            className="form-select"
          >
            <option value="all">All Levels</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderModerationSettings = () => (
    <div className="settings-section">
      <h2 className="section-title">
        <Shield size={20} />
        Community & Moderation
      </h2>
      
      <div className="settings-card">
        <div className="toggle-group">
          <div className="toggle-item">
            <div>
              <h4>Receive Reported Content Alerts</h4>
              <p>Get notified about content that requires moderation</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={moderationSettings.receiveReportedContentAlerts}
                onChange={(e) => setModerationSettings(prev => ({ ...prev, receiveReportedContentAlerts: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div>
              <h4>Approve Mentorship Requests</h4>
              <p>Require your approval for mentorship matches</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={moderationSettings.approveMentorshipRequests}
                onChange={(e) => setModerationSettings(prev => ({ ...prev, approveMentorshipRequests: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div>
              <h4>Pin or Highlight Posts</h4>
              <p>Ability to feature important posts</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={moderationSettings.canPinPosts}
                onChange={(e) => setModerationSettings(prev => ({ ...prev, canPinPosts: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  // Student-Specific Sections
  const renderLearningSettings = () => (
    <div className="settings-section">
      <h2 className="section-title">
        <GraduationCap size={20} />
        Learning & Mentorship
      </h2>
      
      <div className="settings-card">
        <div className="form-group">
          <label>Looking For</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={learningSettings.lookingFor.includes('career-guidance')}
                onChange={(e) => {
                  const looking = e.target.checked
                    ? [...learningSettings.lookingFor, 'career-guidance']
                    : learningSettings.lookingFor.filter(l => l !== 'career-guidance')
                  setLearningSettings(prev => ({ ...prev, lookingFor: looking }))
                }}
              />
              Career Guidance
            </label>
            <label>
              <input
                type="checkbox"
                checked={learningSettings.lookingFor.includes('academic-help')}
                onChange={(e) => {
                  const looking = e.target.checked
                    ? [...learningSettings.lookingFor, 'academic-help']
                    : learningSettings.lookingFor.filter(l => l !== 'academic-help')
                  setLearningSettings(prev => ({ ...prev, lookingFor: looking }))
                }}
              />
              Academic Help
            </label>
            <label>
              <input
                type="checkbox"
                checked={learningSettings.lookingFor.includes('internships')}
                onChange={(e) => {
                  const looking = e.target.checked
                    ? [...learningSettings.lookingFor, 'internships']
                    : learningSettings.lookingFor.filter(l => l !== 'internships')
                  setLearningSettings(prev => ({ ...prev, lookingFor: looking }))
                }}
              />
              Internships
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Preferred Mentors</label>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={learningSettings.preferredMentors.includes('alumni')}
                onChange={(e) => {
                  const mentors = e.target.checked
                    ? [...learningSettings.preferredMentors, 'alumni']
                    : learningSettings.preferredMentors.filter(m => m !== 'alumni')
                  setLearningSettings(prev => ({ ...prev, preferredMentors: mentors }))
                }}
              />
              Alumni
            </label>
            <label>
              <input
                type="checkbox"
                checked={learningSettings.preferredMentors.includes('teachers')}
                onChange={(e) => {
                  const mentors = e.target.checked
                    ? [...learningSettings.preferredMentors, 'teachers']
                    : learningSettings.preferredMentors.filter(m => m !== 'teachers')
                  setLearningSettings(prev => ({ ...prev, preferredMentors: mentors }))
                }}
              />
              Teachers
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Topics of Interest</label>
          <input
            type="text"
            placeholder="e.g., Web Development, Data Science"
            value={learningSettings.topicsOfInterest.join(', ')}
            onChange={(e) => setLearningSettings(prev => ({
              ...prev,
              topicsOfInterest: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            }))}
            className="form-input"
          />
        </div>
      </div>
    </div>
  )

  const renderCareerSettings = () => (
    <div className="settings-section">
      <h2 className="section-title">
        <Target size={20} />
        Career Preferences
      </h2>
      
      <div className="settings-card">
        <div className="form-group">
          <label>Industries of Interest</label>
          <input
            type="text"
            placeholder="e.g., Technology, Finance, Healthcare"
            value={careerSettings.industriesOfInterest.join(', ')}
            onChange={(e) => setCareerSettings(prev => ({
              ...prev,
              industriesOfInterest: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
            }))}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>
            <MapPin size={16} />
            Location Preference
          </label>
          <input
            type="text"
            placeholder="e.g., New York, Remote"
            value={careerSettings.locationPreference}
            onChange={(e) => setCareerSettings(prev => ({ ...prev, locationPreference: e.target.value }))}
            className="form-input"
          />
        </div>

        <div className="toggle-item">
          <div>
            <h4>Open to Internships / Projects</h4>
            <p>Show you're available for opportunities</p>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={careerSettings.openToOpportunities}
              onChange={(e) => setCareerSettings(prev => ({ ...prev, openToOpportunities: e.target.checked }))}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    const role = user?.role?.toLowerCase()

    switch (activeTab) {
      case 'account':
        return renderAccountSettings()
      case 'privacy':
        return renderPrivacySettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'safety':
        return renderSafetySettings()
      
      // Alumni-specific
      case 'professional':
        return role === 'alumni' ? renderProfessionalProfile() : null
      
      // Teacher-specific
      case 'moderation':
        return role === 'teacher' ? renderModerationSettings() : null
      
      default:
        return renderAccountSettings()
    }
  }

  const getTabsForRole = () => {
    const role = user?.role?.toLowerCase()
    const globalTabs = [
      { id: 'account', label: 'Account', icon: User },
      { id: 'privacy', label: 'Privacy & Visibility', icon: Eye },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'safety', label: 'Safety & Support', icon: Shield }
    ]

    if (role === 'alumni') {
      return [
        ...globalTabs,
        { id: 'professional', label: 'Professional Profile', icon: Briefcase }
      ]
    } else if (role === 'teacher') {
      return [
        ...globalTabs,
        { id: 'moderation', label: 'Community & Moderation', icon: Shield }
      ]
    }

    return globalTabs
  }

  if (loading) {
    return <div className="settings-loading">Loading settings...</div>
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Settings</h1>
        <button
          onClick={handleSave}
          className={`save-btn ${saveStatus}`}
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? (
            <>Saving...</>
          ) : saveStatus === 'success' ? (
            <>
              <CheckCircle size={18} />
              Saved
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {message && (
        <div className={`settings-message ${saveStatus}`}>
          {saveStatus === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          {message}
        </div>
      )}

      <div className="settings-tabs-horizontal">
        {getTabsForRole().map((tab) => (
          <button
            key={tab.id}
            className={`settings-tab-horizontal ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="settings-content">
        {renderContent()}
      </div>
    </div>
  )
}

export default Settings
