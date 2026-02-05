import React, { useState } from 'react'
import { eventService } from '../services/eventService'
import '../styles/CreateEvent.css'

interface CreateEventProps {
  onClose: () => void
}

const CreateEvent = ({ onClose }: CreateEventProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    meetingLink: '',
    maxAttendees: '',
    isVirtual: false,
    isFeatured: false,
    visibility: 'PUBLIC',
    imageUrl: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }

      setImageFile(file)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const handleSubmit = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required')
      return
    }

    if (!formData.startDateTime || !formData.endDateTime) {
      setError('Start and end date/time are required')
      return
    }

    if (new Date(formData.startDateTime) >= new Date(formData.endDateTime)) {
      setError('End date/time must be after start date/time')
      return
    }

    if (!formData.isVirtual && !formData.location.trim()) {
      setError('Location is required for in-person events')
      return
    }

    if (formData.isVirtual && !formData.meetingLink.trim()) {
      setError('Meeting link is required for virtual events')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Get user info from localStorage
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : null

      const eventData = {
        title: formData.title,
        description: formData.description,
        startDateTime: formData.startDateTime,
        endDateTime: formData.endDateTime,
        location: formData.isVirtual ? 'Virtual Event' : formData.location,
        meetingLink: formData.isVirtual ? formData.meetingLink : null,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
        isVirtual: formData.isVirtual,
        isFeatured: formData.isFeatured,
        visibility: formData.visibility,
        status,
        bannerImageUrl: formData.imageUrl || null,
        createdBy: user?.id || null
      }

      await eventService.createEventWithImage(eventData, imageFile || undefined)
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-event">
      <div className="create-event__header">
        <div className="create-event__header-left">
          <button className="create-event__back-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="create-event__title">Create New Event</h1>
        </div>
        <div className="create-event__header-actions">
          <button 
            className="create-event__draft-btn"
            onClick={() => handleSubmit('DRAFT')}
            disabled={loading}
          >
            Save as Draft
          </button>
          <button 
            className="create-event__publish-btn"
            onClick={() => handleSubmit('PUBLISHED')}
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish Event'}
          </button>
        </div>
      </div>

      {error && <div className="create-event__error">{error}</div>}

      <div className="create-event__content-wrapper">
        <div className="create-event__main">
          {/* Event Details Section */}
          <div className="create-event__section">
            <h2 className="create-event__section-title">Event Details</h2>
            
            <div className="create-event__field">
              <label className="create-event__label">
                Event Title <span className="create-event__required">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Annual Alumni Gala 2024"
                className="create-event__input"
              />
            </div>

            <div className="create-event__field">
              <label className="create-event__label">
                Description
              </label>
              <div className="create-event__editor-toolbar">
                <button type="button" className="editor-btn" title="Bold">
                  <strong>B</strong>
                </button>
                <button type="button" className="editor-btn" title="Italic">
                  <em>I</em>
                </button>
                <button type="button" className="editor-btn" title="Underline">
                  <u>U</u>
                </button>
                <span className="editor-divider"></span>
                <button type="button" className="editor-btn" title="Ordered List">
                  ≡
                </button>
                <button type="button" className="editor-btn" title="Unordered List">
                  ⋮
                </button>
                <button type="button" className="editor-btn" title="Link">
                  🔗
                </button>
                <button type="button" className="editor-btn" title="Image">
                  🖼
                </button>
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Write a detailed description about the event..."
                className="create-event__textarea"
                rows={6}
              />
            </div>
          </div>

          {/* Settings Section */}
          <div className="create-event__section">
            <h2 className="create-event__section-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '8px'}}>
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Settings
            </h2>
            
            <div className="settings-row">
              <div className="create-event__field">
                <label className="create-event__label">Visibility</label>
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleInputChange}
                  className="create-event__select"
                >
                  <option value="PUBLIC">Public (Everyone)</option>
                  <option value="ALUMNI">Alumni Only</option>
                  <option value="PRIVATE">Private (Invite Only)</option>
                </select>
              </div>

              <div className="create-event__field">
                <label className="create-event__label">Maximum Attendees</label>
                <input
                  type="number"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleInputChange}
                  placeholder="Enter limit (e.g., 50)"
                  className="create-event__input"
                  min="1"
                />
                <p className="create-event__hint-small">Leave empty for unlimited registration</p>
              </div>
            </div>
          </div>
        </div>

        <div className="create-event__sidebar">
          {/* Event Banner Section */}
          <div className="create-event__card">
            <h3 className="create-event__card-title">Event Banner</h3>
            <p className="create-event__banner-desc">
              Upload a high-quality image to capture attention. Recommended size <strong>1200×600px</strong>.
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />

            {imagePreview ? (
              <div className="create-event__image-preview">
                <img src={imagePreview} alt="Event banner preview" />
                <button 
                  type="button"
                  className="create-event__remove-image"
                  onClick={handleRemoveImage}
                  title="Remove image"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <div 
                className="create-event__upload-area"
                onClick={handleUploadClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ cursor: 'pointer' }}
              >
                <div className="upload-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                </div>
                <p className="upload-text">Click or drag image to upload</p>
                <p className="upload-formats">SVG, PNG, JPG or GIF (max. 5MB)</p>
              </div>
            )}
          </div>

          {/* Date & Time Section */}
          <div className="create-event__card">
            <h3 className="create-event__card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Date & Time
            </h3>
            
            <div className="create-event__field">
              <label className="create-event__label create-event__label-small">START</label>
              <div className="datetime-row">
                <div className="datetime-input-wrapper">
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <input
                    type="date"
                    name="startDateTime"
                    value={formData.startDateTime.split('T')[0] || ''}
                    onChange={(e) => {
                      const time = formData.startDateTime.split('T')[1] || '00:00';
                      handleInputChange({
                        ...e,
                        target: { ...e.target, name: 'startDateTime', value: `${e.target.value}T${time}` }
                      } as any);
                    }}
                    className="create-event__input create-event__input-compact datetime-input"
                  />
                </div>
                <div className="datetime-input-wrapper">
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <input
                    type="time"
                    name="startDateTime"
                    value={formData.startDateTime.split('T')[1] || ''}
                    onChange={(e) => {
                      const date = formData.startDateTime.split('T')[0] || '';
                      handleInputChange({
                        ...e,
                        target: { ...e.target, name: 'startDateTime', value: `${date}T${e.target.value}` }
                      } as any);
                    }}
                    className="create-event__input create-event__input-compact datetime-input"
                  />
                </div>
              </div>
            </div>

            <div className="create-event__field">
              <label className="create-event__label create-event__label-small">END</label>
              <div className="datetime-row">
                <div className="datetime-input-wrapper">
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <input
                    type="date"
                    name="endDateTime"
                    value={formData.endDateTime.split('T')[0] || ''}
                    onChange={(e) => {
                      const time = formData.endDateTime.split('T')[1] || '00:00';
                      handleInputChange({
                        ...e,
                        target: { ...e.target, name: 'endDateTime', value: `${e.target.value}T${time}` }
                      } as any);
                    }}
                    className="create-event__input create-event__input-compact datetime-input"
                  />
                </div>
                <div className="datetime-input-wrapper">
                  <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <input
                    type="time"
                    name="endDateTime"
                    value={formData.endDateTime.split('T')[1] || ''}
                    onChange={(e) => {
                      const date = formData.endDateTime.split('T')[0] || '';
                      handleInputChange({
                        ...e,
                        target: { ...e.target, name: 'endDateTime', value: `${date}T${e.target.value}` }
                      } as any);
                    }}
                    className="create-event__input create-event__input-compact datetime-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="create-event__card">
            <h3 className="create-event__card-title location-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Location
            </h3>
            
            <div className="create-event__virtual-toggle">
              <span className="toggle-label">Virtual Event</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  name="isVirtual"
                  checked={formData.isVirtual}
                  onChange={handleInputChange}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="create-event__field">
              <label className="create-event__label location-label">
                {formData.isVirtual ? 'Meeting Link' : 'Venue / Address'}
              </label>
              {formData.isVirtual ? (
                <input
                  type="url"
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleInputChange}
                  placeholder="https://zoom.us/j/123456789"
                  className="create-event__input"
                />
              ) : (
                <div className="location-search-wrapper">
                  <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter the address"
                    className="create-event__input location-search-input"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateEvent
