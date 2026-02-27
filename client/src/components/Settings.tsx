import { useState, useEffect } from 'react'
import { 
  User, Lock, Eye, EyeOff, Bell, Palette, Shield, 
  Upload, Save, AlertCircle, CheckCircle, Globe,
  Calendar, Briefcase, GraduationCap, Target, MapPin,
  Link, FileText, Clock, Users, Wifi, Download,
  History, Monitor, Trash2, Power, MessageSquare, ImagePlus
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { settingsService, type UserSettings } from '../services/settingsService'
import '../styles/Settings.css'

const Settings = () => {
  const { user } = useAuth()
  const isAlumni = user?.role?.toLowerCase() === 'alumni'
  const [activeTab, setActiveTab] = useState(isAlumni ? 'profile' : 'account')
  const [loading, setLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // ─── Alumni Settings State ───
  const [alumniProfile, setAlumniProfile] = useState({
    fullName: user?.name || '',
    profilePhoto: '',
    coverPhoto: '',
    bio: '',
    graduationYear: '',
    department: '',
    studentId: '',
    university: '',
    course: '',
    country: '',
    currentJobTitle: '',
    company: '',
    industry: '',
    workLocation: '',
    linkedinUrl: '',
    portfolioUrl: '',
    skills: [] as string[],
    resumeUpload: '',
    availableAsMentor: false,
    mentorshipAreas: [] as string[],
    preferredContactMethod: 'email',
    availableTimeSlots: ''
  })

  const [alumniPrivacy, setAlumniPrivacy] = useState({
    profileVisibility: 'public',
    showEmailTo: 'everyone',
    allowStudentConnectionRequests: true,
    allowTeacherContact: true,
    showInAlumniDirectory: true
  })

  const [alumniNotifications, setAlumniNotifications] = useState({
    email: {
      connectionRequest: true,
      messageReceived: true,
      mentorshipRequest: true,
      eventInvitation: true,
      jobPostings: true,
      alumniAnnouncements: true
    },
    inApp: {
      connectionRequest: true,
      messageReceived: true,
      mentorshipRequest: true,
      eventInvitation: true,
      jobPostings: true,
      alumniAnnouncements: true
    }
  })

  const [alumniAccount, setAlumniAccount] = useState({
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false
  })

  const [alumniNetworking, setAlumniNetworking] = useState({
    autoAcceptConnections: false,
    whoCanMessageMe: 'everyone',
    showOpenToWork: false,
    showOpenToMentor: false
  })

  const [alumniEvents, setAlumniEvents] = useState({
    eventReminderTime: '1day',
    interestedTopics: [] as string[],
    volunteerForEvents: false
  })

  // ─── Non-Alumni Settings State (Teacher / Student / Global) ───
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
      
      // Alumni-specific settings
      if (settings.alumniProfile) {
        setAlumniProfile(prev => ({ ...prev, ...settings.alumniProfile }))
      }
      if (settings.alumniPrivacy) {
        setAlumniPrivacy(prev => ({ ...prev, ...settings.alumniPrivacy }))
      }
      if (settings.alumniNotifications) {
        setAlumniNotifications(prev => ({ ...prev, ...settings.alumniNotifications }))
      }
      if (settings.alumniAccount) {
        setAlumniAccount(prev => ({ ...prev, ...settings.alumniAccount }))
      }
      if (settings.alumniNetworking) {
        setAlumniNetworking(prev => ({ ...prev, ...settings.alumniNetworking }))
      }
      if (settings.alumniEvents) {
        setAlumniEvents(prev => ({ ...prev, ...settings.alumniEvents }))
      }

      // Non-alumni shared settings
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

      const settingsData: Partial<UserSettings> = {}

      // Alumni saves all 7 sections
      if (isAlumni) {
        settingsData.alumniProfile = alumniProfile
        settingsData.alumniPrivacy = alumniPrivacy
        settingsData.alumniNotifications = alumniNotifications
        settingsData.alumniAccount = alumniAccount
        settingsData.alumniNetworking = alumniNetworking
        settingsData.alumniEvents = alumniEvents
      } else {
        settingsData.account = accountSettings
        settingsData.privacy = privacySettings
        settingsData.notifications = notificationSettings
        settingsData.appearance = appearanceSettings

        if (user?.role?.toLowerCase() === 'teacher') {
          settingsData.teaching = teachingSettings
          settingsData.moderation = moderationSettings
        } else if (user?.role?.toLowerCase() === 'student') {
          settingsData.learning = learningSettings
          settingsData.career = careerSettings
        }
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'profilePhoto' | 'coverPhoto') => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (isAlumni) {
          setAlumniProfile(prev => ({ ...prev, [field]: reader.result as string }))
        } else {
          setAccountSettings(prev => ({ ...prev, profilePhoto: reader.result as string }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAlumniProfile(prev => ({ ...prev, resumeUpload: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleSkill = (skill: string) => {
    setAlumniProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const toggleMentorshipArea = (area: string) => {
    setAlumniProfile(prev => ({
      ...prev,
      mentorshipAreas: prev.mentorshipAreas.includes(area)
        ? prev.mentorshipAreas.filter(a => a !== area)
        : [...prev.mentorshipAreas, area]
    }))
  }

  const toggleInterestedTopic = (topic: string) => {
    setAlumniEvents(prev => ({
      ...prev,
      interestedTopics: prev.interestedTopics.includes(topic)
        ? prev.interestedTopics.filter(t => t !== topic)
        : [...prev.interestedTopics, topic]
    }))
  }

  // ═══════════════════════════════════════════════
  // ALUMNI RENDER FUNCTIONS (7 Tabs)
  // ═══════════════════════════════════════════════

  const renderAlumniProfileSettings = () => (
    <div className="settings-section">
      {/* Basic Information */}
      <h2 className="section-title">
        <User size={20} />
        Basic Information
      </h2>
      <div className="settings-card">
        {/* Cover Photo */}
        <div className="form-group">
          <label>Cover Photo</label>
          <label htmlFor="cover-photo-upload" className={`cover-upload-zone${alumniProfile.coverPhoto ? ' has-image' : ''}`}>
            {alumniProfile.coverPhoto ? (
              <>
                <img src={alumniProfile.coverPhoto} alt="Cover" />
                <div className="cover-overlay">
                  <Upload size={22} />
                  <span>Change Cover Photo</span>
                </div>
              </>
            ) : (
              <div className="cover-placeholder-content">
                <ImagePlus size={32} />
                <span>Click to upload a cover photo</span>
                <small>Recommended: 1200 × 300px</small>
              </div>
            )}
          </label>
          <input
            id="cover-photo-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoUpload(e, 'coverPhoto')}
            style={{ display: 'none' }}
          />
        </div>

        <h3 className="subsection-title">Personal Details</h3>

        {/* Profile Hero: Photo left, Key info right */}
        <div className="profile-hero">
          <div className="profile-hero-photo">
            <div className="profile-avatar">
              {alumniProfile.profilePhoto ? (
                <img src={alumniProfile.profilePhoto} alt="Profile" />
              ) : (
                <User size={64} />
              )}
            </div>
            <label htmlFor="profile-photo-upload" className="avatar-text-btn">
              <Upload size={14} />
              {alumniProfile.profilePhoto ? 'Change Photo' : 'Upload Photo'}
            </label>
            <input
              id="profile-photo-upload"
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoUpload(e, 'profilePhoto')}
              style={{ display: 'none' }}
            />
          </div>

          <div className="profile-hero-info">
            <div className="form-row form-row-60-40">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={alumniProfile.fullName}
                  onChange={(e) => setAlumniProfile(prev => ({ ...prev, fullName: e.target.value }))}
                  className="form-input"
                  placeholder="Your full name"
                />
              </div>
              <div className="form-group">
                <label>Batch</label>
                <input
                  type="text"
                  value={alumniProfile.graduationYear}
                  onChange={(e) => setAlumniProfile(prev => ({ ...prev, graduationYear: e.target.value }))}
                  className="form-input"
                  placeholder="e.g., 2020"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Course</label>
              <input
                type="text"
                value={alumniProfile.course}
                onChange={(e) => setAlumniProfile(prev => ({ ...prev, course: e.target.value }))}
                className="form-input"
                placeholder="e.g., BSc Computer Science"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>University / Institution</label>
                <input
                  type="text"
                  value={alumniProfile.university}
                  onChange={(e) => setAlumniProfile(prev => ({ ...prev, university: e.target.value }))}
                  className="form-input"
                  placeholder="e.g., MIT, Oxford University"
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  value={alumniProfile.country}
                  onChange={(e) => setAlumniProfile(prev => ({ ...prev, country: e.target.value }))}
                  className="form-input"
                  placeholder="e.g., United States"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Bio / About Me</label>
          <textarea
            value={alumniProfile.bio}
            onChange={(e) => setAlumniProfile(prev => ({ ...prev, bio: e.target.value }))}
            className="form-textarea"
            placeholder="Tell the community about yourself..."
            rows={4}
          />
        </div>
      </div>

      {/* Professional Information */}
      <h2 className="section-title" style={{ marginTop: 32 }}>
        <Briefcase size={20} />
        Professional Information
      </h2>
      <div className="settings-card">
        <div className="form-row">
          <div className="form-group">
            <label>Current Job Title</label>
            <input
              type="text"
              value={alumniProfile.currentJobTitle}
              onChange={(e) => setAlumniProfile(prev => ({ ...prev, currentJobTitle: e.target.value }))}
              className="form-input"
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          <div className="form-group">
            <label>Company / Organization</label>
            <input
              type="text"
              value={alumniProfile.company}
              onChange={(e) => setAlumniProfile(prev => ({ ...prev, company: e.target.value }))}
              className="form-input"
              placeholder="e.g., Google"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Industry</label>
            <select
              value={alumniProfile.industry}
              onChange={(e) => setAlumniProfile(prev => ({ ...prev, industry: e.target.value }))}
              className="form-select"
            >
              <option value="">Select Industry</option>
              <option value="technology">Technology</option>
              <option value="finance">Finance & Banking</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="consulting">Consulting</option>
              <option value="marketing">Marketing & Advertising</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="government">Government</option>
              <option value="nonprofit">Non-Profit</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <MapPin size={16} />
              Work Location
            </label>
            <input
              type="text"
              value={alumniProfile.workLocation}
              onChange={(e) => setAlumniProfile(prev => ({ ...prev, workLocation: e.target.value }))}
              className="form-input"
              placeholder="e.g., San Francisco, CA"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <Link size={16} />
              LinkedIn URL
            </label>
            <input
              type="url"
              value={alumniProfile.linkedinUrl}
              onChange={(e) => setAlumniProfile(prev => ({ ...prev, linkedinUrl: e.target.value }))}
              className="form-input"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div className="form-group">
            <label>
              <Globe size={16} />
              Portfolio / Personal Website
            </label>
            <input
              type="url"
              value={alumniProfile.portfolioUrl}
              onChange={(e) => setAlumniProfile(prev => ({ ...prev, portfolioUrl: e.target.value }))}
              className="form-input"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Skills</label>
          <div className="tags-input">
            {['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'SQL', 'AWS', 'Docker', 'Machine Learning', 'Data Analysis', 'Project Management', 'Leadership', 'Marketing', 'Design', 'Communication'].map(skill => (
              <button
                key={skill}
                type="button"
                className={`tag-btn ${alumniProfile.skills.includes(skill) ? 'active' : ''}`}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Add custom skills (comma separated)"
            className="form-input"
            style={{ marginTop: 8 }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const val = (e.target as HTMLInputElement).value.trim()
                if (val) {
                  const newSkills = val.split(',').map(s => s.trim()).filter(Boolean)
                  setAlumniProfile(prev => ({
                    ...prev,
                    skills: [...new Set([...prev.skills, ...newSkills])]
                  }))
                  ;(e.target as HTMLInputElement).value = ''
                }
              }
            }}
          />
        </div>

        <div className="form-group">
          <label>
            <FileText size={16} />
            Resume Upload (PDF)
          </label>
          <div className="file-upload-area">
            <label htmlFor="resume-upload" className="upload-btn">
              <Upload size={16} />
              {alumniProfile.resumeUpload ? 'Replace Resume' : 'Upload Resume'}
            </label>
            {alumniProfile.resumeUpload && (
              <span className="file-status">
                <CheckCircle size={14} />
                Resume uploaded
              </span>
            )}
            <input
              id="resume-upload"
              type="file"
              accept="application/pdf"
              onChange={handleResumeUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderAlumniPrivacySettings = () => (
    <div className="settings-section">
      <h2 className="section-title">
        <Eye size={20} />
        Privacy & Visibility
      </h2>

      {/* Profile Visibility */}
      <div className="settings-card">
        <h3 className="subsection-title">Profile Visibility</h3>
        <div className="form-group">
          <label>Who can see your profile?</label>
          <div className="radio-group">
            {[
              { value: 'public', label: 'Public', desc: 'Visible to all users' },
              { value: 'logged-in', label: 'Logged-in Users', desc: 'Only users who are signed in' },
              { value: 'alumni', label: 'Only Alumni', desc: 'Visible to verified alumni only' },
              { value: 'private', label: 'Private', desc: 'Only you can see your profile' }
            ].map(opt => (
              <label key={opt.value} className="radio-item">
                <input
                  type="radio"
                  name="profileVisibility"
                  value={opt.value}
                  checked={alumniPrivacy.profileVisibility === opt.value}
                  onChange={(e) => setAlumniPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                />
                <div>
                  <h4>{opt.label}</h4>
                  <p>{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info Visibility */}
      <div className="settings-card" style={{ marginTop: 24 }}>
        <h3 className="subsection-title">Contact Information Visibility</h3>
        <div className="form-group">
          <label>Show Email to:</label>
          <select
            value={alumniPrivacy.showEmailTo}
            onChange={(e) => setAlumniPrivacy(prev => ({ ...prev, showEmailTo: e.target.value }))}
            className="form-select"
          >
            <option value="everyone">Everyone</option>
            <option value="connections">Connections Only</option>
            <option value="nobody">Nobody</option>
          </select>
        </div>
      </div>

      {/* Profile Discoverability */}
      <div className="settings-card" style={{ marginTop: 24 }}>
        <h3 className="subsection-title">Profile Discoverability</h3>
        <div className="toggle-group">
          <div className="toggle-item">
            <div>
              <h4>Allow students to send connection requests</h4>
              <p>Students can request to connect with you</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={alumniPrivacy.allowStudentConnectionRequests}
                onChange={(e) => setAlumniPrivacy(prev => ({ ...prev, allowStudentConnectionRequests: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div>
              <h4>Allow teachers to contact directly</h4>
              <p>Teachers can send you direct messages</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={alumniPrivacy.allowTeacherContact}
                onChange={(e) => setAlumniPrivacy(prev => ({ ...prev, allowTeacherContact: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div>
              <h4>Show in Alumni Directory</h4>
              <p>Appear in search results of the alumni directory</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={alumniPrivacy.showInAlumniDirectory}
                onChange={(e) => setAlumniPrivacy(prev => ({ ...prev, showInAlumniDirectory: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAlumniNotificationSettings = () => {
    const notifKeys = [
      { key: 'connectionRequest', label: 'New connection request', desc: 'When someone wants to connect' },
      { key: 'messageReceived', label: 'Message received', desc: 'When you get a new message' },
      { key: 'mentorshipRequest', label: 'Mentorship request', desc: 'When someone requests mentorship' },
      { key: 'eventInvitation', label: 'Event invitation', desc: 'When you\'re invited to an event' },
      { key: 'jobPostings', label: 'Job postings', desc: 'New job opportunities shared' },
      { key: 'alumniAnnouncements', label: 'Alumni announcements', desc: 'Important alumni community updates' }
    ] as const

    return (
      <div className="settings-section">
        <h2 className="section-title">
          <Bell size={20} />
          Notification Settings
        </h2>

        {/* Email Notifications */}
        <div className="settings-card">
          <h3 className="subsection-title">Email Notifications</h3>
          <div className="toggle-group">
            {notifKeys.map(({ key, label, desc }) => (
              <div className="toggle-item" key={`email-${key}`}>
                <div>
                  <h4>{label}</h4>
                  <p>{desc}</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={alumniNotifications.email[key]}
                    onChange={(e) => setAlumniNotifications(prev => ({
                      ...prev,
                      email: { ...prev.email, [key]: e.target.checked }
                    }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* In-App Notifications */}
        <div className="settings-card" style={{ marginTop: 24 }}>
          <h3 className="subsection-title">In-App Notifications</h3>
          <div className="toggle-group">
            {notifKeys.map(({ key, label, desc }) => (
              <div className="toggle-item" key={`inapp-${key}`}>
                <div>
                  <h4>{label}</h4>
                  <p>{desc}</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={alumniNotifications.inApp[key]}
                    onChange={(e) => setAlumniNotifications(prev => ({
                      ...prev,
                      inApp: { ...prev.inApp, [key]: e.target.checked }
                    }))}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderAlumniAccountSettings = () => (
    <div className="settings-section">
      <h2 className="section-title">
        <User size={20} />
        Account Settings
      </h2>

      <div className="settings-card">
        <div className="form-group">
          <label>Email Address</label>
          <div className="input-with-badge">
            <input
              type="email"
              value={alumniAccount.email}
              onChange={(e) => setAlumniAccount(prev => ({ ...prev, email: e.target.value }))}
              className="form-input"
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

        <h3 className="subsection-title">Change Password</h3>
        <div className="form-group">
          <input
            type="password"
            placeholder="Current Password"
            value={alumniAccount.currentPassword}
            onChange={(e) => setAlumniAccount(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="form-input"
          />
          <input
            type="password"
            placeholder="New Password"
            value={alumniAccount.newPassword}
            onChange={(e) => setAlumniAccount(prev => ({ ...prev, newPassword: e.target.value }))}
            className="form-input"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={alumniAccount.confirmPassword}
            onChange={(e) => setAlumniAccount(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="form-input"
          />
        </div>

        <div className="form-divider" />

        <div className="toggle-item">
          <div>
            <h4>Two-Factor Authentication</h4>
            <p>Add an extra layer of security to your account (Recommended)</p>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={alumniAccount.twoFactorEnabled}
              onChange={(e) => setAlumniAccount(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="form-divider" />

        <div className="safety-links">
          <button className="link-btn">
            <Monitor size={18} />
            <div>
              <h4>Login Activity / Active Sessions</h4>
              <p>View and manage your active sessions</p>
            </div>
          </button>
        </div>

        <div className="form-divider" />

        <div className="danger-actions">
          <button className="danger-btn">
            <Power size={16} />
            Deactivate Account
          </button>
          <button className="danger-btn destructive">
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )

  const renderAlumniNetworkingSettings = () => (
    <div className="settings-section">
      <h2 className="section-title">
        <Users size={20} />
        Networking & Connection Settings
      </h2>

      <div className="settings-card">
        <div className="toggle-group">
          <div className="toggle-item">
            <div>
              <h4>Auto-accept connection requests</h4>
              <p>Automatically accept all incoming connection requests</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={alumniNetworking.autoAcceptConnections}
                onChange={(e) => setAlumniNetworking(prev => ({ ...prev, autoAcceptConnections: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="form-divider" />

        <div className="form-group">
          <label>
            <MessageSquare size={16} />
            Who can send me messages?
          </label>
          <select
            value={alumniNetworking.whoCanMessageMe}
            onChange={(e) => setAlumniNetworking(prev => ({ ...prev, whoCanMessageMe: e.target.value }))}
            className="form-select"
          >
            <option value="everyone">Everyone</option>
            <option value="connections">Connections Only</option>
          </select>
        </div>

        <div className="form-divider" />

        <div className="toggle-group">
          <div className="toggle-item">
            <div>
              <h4>Show "Open to Work" badge</h4>
              <p>Let others know you're actively looking for opportunities</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={alumniNetworking.showOpenToWork}
                onChange={(e) => setAlumniNetworking(prev => ({ ...prev, showOpenToWork: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="toggle-item">
            <div>
              <h4>Show "Open to Mentor" badge</h4>
              <p>Display that you're available to mentor others</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={alumniNetworking.showOpenToMentor}
                onChange={(e) => setAlumniNetworking(prev => ({ ...prev, showOpenToMentor: e.target.checked }))}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAlumniEventSettings = () => (
    <div className="settings-section">
      <h2 className="section-title">
        <Calendar size={20} />
        Event & Community Preferences
      </h2>

      <div className="settings-card">
        <div className="form-group">
          <label>Event Reminder Time</label>
          <select
            value={alumniEvents.eventReminderTime}
            onChange={(e) => setAlumniEvents(prev => ({ ...prev, eventReminderTime: e.target.value }))}
            className="form-select"
          >
            <option value="1hour">1 hour before</option>
            <option value="1day">1 day before</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div className="form-divider" />

        <div className="form-group">
          <label>Interested Topics</label>
          <div className="tags-input">
            {['Tech', 'Business', 'Tourism', 'AI', 'Entrepreneurship', 'Healthcare', 'Design', 'Finance', 'Education', 'Science', 'Arts', 'Sports'].map(topic => (
              <button
                key={topic}
                type="button"
                className={`tag-btn ${alumniEvents.interestedTopics.includes(topic) ? 'active' : ''}`}
                onClick={() => toggleInterestedTopic(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        <div className="form-divider" />

        <div className="toggle-item">
          <div>
            <h4>Volunteer for Alumni Events</h4>
            <p>Show interest in helping organize or participate in alumni events</p>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={alumniEvents.volunteerForEvents}
              onChange={(e) => setAlumniEvents(prev => ({ ...prev, volunteerForEvents: e.target.checked }))}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  )

  const renderAlumniDataSecuritySettings = () => (
    <div className="settings-section">
      <h2 className="section-title">
        <Shield size={20} />
        Data & Security
      </h2>

      <div className="settings-card">
        <div className="safety-links">
          <button className="link-btn">
            <Download size={18} />
            <div>
              <h4>Download My Data</h4>
              <p>Request a copy of all your data</p>
            </div>
          </button>

          <button className="link-btn">
            <History size={18} />
            <div>
              <h4>Activity History</h4>
              <p>View your recent activity on the platform</p>
            </div>
          </button>

          <button className="link-btn">
            <Wifi size={18} />
            <div>
              <h4>Connected Devices</h4>
              <p>Manage devices that have access to your account</p>
            </div>
          </button>

          <button className="link-btn">
            <EyeOff size={18} />
            <div>
              <h4>Privacy Policy</h4>
              <p>Read our data privacy and handling policy</p>
            </div>
          </button>

          <button className="link-btn">
            <FileText size={18} />
            <div>
              <h4>Terms & Conditions</h4>
              <p>View the platform terms of service</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════
  // NON-ALUMNI RENDER FUNCTIONS (Teacher / Student / Global)
  // ═══════════════════════════════════════════════

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
              onChange={(e) => handlePhotoUpload(e, 'profilePhoto')}
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

    // Alumni gets dedicated 7-tab experience
    if (role === 'alumni') {
      switch (activeTab) {
        case 'profile': return renderAlumniProfileSettings()
        case 'privacy': return renderAlumniPrivacySettings()
        case 'notifications': return renderAlumniNotificationSettings()
        case 'account': return renderAlumniAccountSettings()
        case 'networking': return renderAlumniNetworkingSettings()
        case 'events': return renderAlumniEventSettings()
        case 'data-security': return renderAlumniDataSecuritySettings()
        default: return renderAlumniProfileSettings()
      }
    }

    // Non-alumni (teacher / student) uses shared tabs
    switch (activeTab) {
      case 'account': return renderAccountSettings()
      case 'privacy': return renderPrivacySettings()
      case 'notifications': return renderNotificationSettings()
      case 'safety': return renderSafetySettings()
      case 'moderation': return role === 'teacher' ? renderModerationSettings() : null
      default: return renderAccountSettings()
    }
  }

  const getTabsForRole = () => {
    const role = user?.role?.toLowerCase()

    if (role === 'alumni') {
      return [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'privacy', label: 'Privacy & Visibility', icon: Eye },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'account', label: 'Account', icon: Lock },
        { id: 'networking', label: 'Networking', icon: Users },
        { id: 'events', label: 'Events & Community', icon: Calendar },
        { id: 'data-security', label: 'Data & Security', icon: Shield }
      ]
    }

    const globalTabs = [
      { id: 'account', label: 'Account', icon: User },
      { id: 'privacy', label: 'Privacy & Visibility', icon: Eye },
      { id: 'notifications', label: 'Notifications', icon: Bell },
      { id: 'safety', label: 'Safety & Support', icon: Shield }
    ]

    if (role === 'teacher') {
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
