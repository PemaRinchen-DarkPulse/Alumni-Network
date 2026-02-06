import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import tributeService from '../services/tributeService'
import '../styles/CreateTribute.css'

interface CreateTributeProps {
  onClose: () => void
}

const CreateTribute = ({ onClose }: CreateTributeProps) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    teacherName: '',
    department: '',
    yearsFrom: '',
    yearsTo: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    if (!formData.teacherName.trim() || !formData.message.trim()) {
      setError('Teacher name and message are required')
      return
    }

    if (!user) {
      setError('You must be logged in to submit a tribute')
      return
    }

    setLoading(true)
    setError('')

    try {
      await tributeService.createTribute({
        teacherName: formData.teacherName,
        department: formData.department,
        yearsFrom: formData.yearsFrom,
        yearsTo: formData.yearsTo,
        subject: formData.subject,
        message: formData.message,
        authorId: user.id,
        authorName: user.name
      })
      
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit tribute')
    } finally {
      setLoading(false)
    }
  }

  const applyFormatting = (format: string) => {
    const textarea = document.querySelector('.create-tribute__message') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = formData.message.substring(start, end)
    let newText = formData.message

    switch (format) {
      case 'bold':
        newText = formData.message.substring(0, start) + `**${selectedText}**` + formData.message.substring(end)
        break
      case 'italic':
        newText = formData.message.substring(0, start) + `*${selectedText}*` + formData.message.substring(end)
        break
      case 'underline':
        newText = formData.message.substring(0, start) + `__${selectedText}__` + formData.message.substring(end)
        break
      case 'list':
        newText = formData.message.substring(0, start) + `\n• ${selectedText}` + formData.message.substring(end)
        break
    }

    setFormData(prev => ({ ...prev, message: newText }))
  }

  return (
    <div className="create-tribute">
      <div className="create-tribute__header">
        <div className="create-tribute__header-left">
          <button className="create-tribute__back-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="create-tribute__title">Write a Tribute</h1>
        </div>
        <div className="create-tribute__header-actions">
          <button 
            className="create-tribute__publish-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Tribute'}
          </button>
        </div>
      </div>

      {error && <div className="create-tribute__error">{error}</div>}

      <div className="create-tribute__content-wrapper">
        <div className="create-tribute__main">
          <div className="create-tribute__section">
            <h2 className="create-tribute__section-title">Teacher Information</h2>
            <div className="create-tribute__field">
              <label className="create-tribute__label">
                Teacher's Name <span className="create-tribute__required">*</span>
              </label>
              <input
                type="text"
                name="teacherName"
                value={formData.teacherName}
                onChange={handleInputChange}
                placeholder="e.g., Mr. John Smith"
                className="create-tribute__input"
              />
            </div>

            <div className="create-tribute__field-row">
              <div className="create-tribute__field">
                <label className="create-tribute__label">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="create-tribute__select"
                >
                  <option value="">Select Department</option>
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Arts">Arts</option>
                  <option value="Music">Music</option>
                  <option value="Physical Education">Physical Education</option>
                  <option value="Languages">Languages</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="create-tribute__field">
                <label className="create-tribute__label">Subject Taught</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., Advanced Physics"
                  className="create-tribute__input"
                />
              </div>
            </div>

            <div className="create-tribute__field-row">
              <div className="create-tribute__field">
                <label className="create-tribute__label">Years (From)</label>
                <input
                  type="text"
                  name="yearsFrom"
                  value={formData.yearsFrom}
                  onChange={handleInputChange}
                  placeholder="e.g., 2010"
                  className="create-tribute__input"
                />
              </div>

              <div className="create-tribute__field">
                <label className="create-tribute__label">Years (To)</label>
                <input
                  type="text"
                  name="yearsTo"
                  value={formData.yearsTo}
                  onChange={handleInputChange}
                  placeholder="e.g., 2020 or Present"
                  className="create-tribute__input"
                />
              </div>
            </div>
          </div>

          <div className="create-tribute__section">
            <h2 className="create-tribute__section-title">Your Tribute Message</h2>
            <p className="create-tribute__section-desc">
              Share your heartfelt message about how this teacher impacted your life.
            </p>
            
            <div className="create-tribute__field">
              <label className="create-tribute__label">
                Message <span className="create-tribute__required">*</span>
              </label>
              <div className="create-tribute__editor">
                <div className="create-tribute__toolbar">
                  <button type="button" onClick={() => applyFormatting('bold')} className="create-tribute__toolbar-btn" title="Bold">
                    <strong>B</strong>
                  </button>
                  <button type="button" onClick={() => applyFormatting('italic')} className="create-tribute__toolbar-btn" title="Italic">
                    <em>I</em>
                  </button>
                  <button type="button" onClick={() => applyFormatting('underline')} className="create-tribute__toolbar-btn" title="Underline">
                    <u>U</u>
                  </button>
                  <button type="button" onClick={() => applyFormatting('list')} className="create-tribute__toolbar-btn" title="Bullet List">
                    ☰
                  </button>
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your tribute message here... Share specific memories, lessons learned, or how this teacher inspired you..."
                  className="create-tribute__message"
                  rows={12}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="create-tribute__sidebar">
          <div className="create-tribute__card create-tribute__tips">
            <h3 className="create-tribute__card-title">
              💡 Writing Tips
            </h3>
            <ul className="create-tribute__tips-list">
              <li>Share a specific moment or memory that stands out</li>
              <li>Describe how they influenced your life or career</li>
              <li>Be genuine and write from the heart</li>
              <li>Mention lessons that stayed with you</li>
              <li>Keep it respectful and positive</li>
            </ul>
          </div>

          <div className="create-tribute__card create-tribute__note">
            <h3 className="create-tribute__card-title">
              📝 Note
            </h3>
            <p className="create-tribute__note-text">
              Your tribute will be reviewed before being published to ensure it meets our community guidelines. This usually takes 1-2 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTribute
