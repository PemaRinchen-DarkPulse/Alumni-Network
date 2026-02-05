import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { questionService, type QuestionData } from '../services/questionService'
import '../styles/AskCommunity.css'

interface AskCommunityProps {
  onClose: () => void
  onSuccess?: () => void
}

const AskCommunity = ({ onClose, onSuccess }: AskCommunityProps) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Career Guidance',
    tags: ''
  })
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (type: 'draft' | 'publish') => {
    setLoading(true)
    setError('')

    try {
      if (!user) {
        setError('You must be logged in to post a question')
        return
      }

      const questionData: QuestionData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        isAnonymous: isAnonymous,
        authorId: user.id,
        authorName: user.name
      }

      if (type === 'draft') {
        await questionService.saveDraft(questionData)
        if (onSuccess) {
          onSuccess()
        } else {
          onClose()
        }
      } else {
        await questionService.publishQuestion(questionData)
        if (onSuccess) {
          onSuccess()
        } else {
          onClose()
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post question')
    } finally {
      setLoading(false)
    }
  }

  const applyFormatting = (format: string) => {
    const textarea = document.querySelector('.ask-community__description') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = formData.description.substring(start, end)
    let newText = formData.description

    switch (format) {
      case 'bold':
        newText = formData.description.substring(0, start) + `**${selectedText}**` + formData.description.substring(end)
        break
      case 'italic':
        newText = formData.description.substring(0, start) + `*${selectedText}*` + formData.description.substring(end)
        break
      case 'underline':
        newText = formData.description.substring(0, start) + `__${selectedText}__` + formData.description.substring(end)
        break
      case 'list':
        newText = formData.description.substring(0, start) + `\n• ${selectedText}` + formData.description.substring(end)
        break
      case 'code':
        newText = formData.description.substring(0, start) + `\`${selectedText}\`` + formData.description.substring(end)
        break
    }

    setFormData(prev => ({ ...prev, description: newText }))
  }

  return (
    <div className="ask-community">
      <div className="ask-community__header">
        <div className="ask-community__header-left">
          <button className="ask-community__back-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="ask-community__title">Ask the Community</h1>
        </div>
        <div className="ask-community__header-actions">
          <button 
            className="ask-community__draft-btn"
            onClick={() => handleSubmit('draft')}
            disabled={loading}
          >
            Save as Draft
          </button>
          <button 
            className="ask-community__publish-btn"
            onClick={() => handleSubmit('publish')}
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post Question'}
          </button>
        </div>
      </div>

      {error && <div className="ask-community__error">{error}</div>}

      <div className="ask-community__content-wrapper">
        <div className="ask-community__main">
          <div className="ask-community__section">
            <h2 className="ask-community__section-title">Question Details</h2>
            
            <div className="ask-community__field-row">
              <div className="ask-community__field" style={{ flex: '0 0 40%' }}>
                <label className="ask-community__label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="ask-community__select"
                >
                  <option value="Career Guidance">Career Guidance</option>
                  <option value="Technical Skills">Technical Skills</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Personal Development">Personal Development</option>
                  <option value="Industry Insights">Industry Insights</option>
                </select>
              </div>

              <div className="ask-community__field" style={{ flex: '0 0 60%' }}>
                <label className="ask-community__label">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="career, advice, tech (separate with commas)"
                  className="ask-community__input"
                />
              </div>
            </div>

            <div className="ask-community__field">
              <label className="ask-community__label">
                Ask Your Question <span className="ask-community__required">*</span>
              </label>
              <div className="ask-community__editor">
                <div className="ask-community__toolbar">
                  <button type="button" onClick={() => applyFormatting('bold')} className="ask-community__toolbar-btn" title="Bold">
                    <strong>B</strong>
                  </button>
                  <button type="button" onClick={() => applyFormatting('italic')} className="ask-community__toolbar-btn" title="Italic">
                    <em>I</em>
                  </button>
                  <button type="button" onClick={() => applyFormatting('underline')} className="ask-community__toolbar-btn" title="Underline">
                    <u>U</u>
                  </button>
                  <button type="button" onClick={() => applyFormatting('list')} className="ask-community__toolbar-btn" title="Bullet List">
                    ☰
                  </button>
                  <button type="button" onClick={() => applyFormatting('code')} className="ask-community__toolbar-btn" title="Code">
                    {'</>'}
                  </button>
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Provide more details about your question. Include context, what you've tried, and what specific help you're looking for..."
                  className="ask-community__description"
                  rows={12}
                />
              </div>
            </div>

            <div className="ask-community__field">
              <label className="ask-community__checkbox-label">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="ask-community__checkbox"
                />
                <span>Post Anonymously</span>
              </label>
              <p className="ask-community__checkbox-hint">
                Your identity will be hidden from other users, but moderators can still see your information.
              </p>
            </div>
          </div>
        </div>

        <div className="ask-community__sidebar">
          <div className="ask-community__card ask-community__guidelines">
            <h3 className="ask-community__card-title">
              📋 Question Guidelines
            </h3>
            <ul className="ask-community__guidelines-list">
              <li>Be specific and clear in your question title</li>
              <li>Provide relevant context and background</li>
              <li>Mention what you've already tried</li>
              <li>Use appropriate tags for better visibility</li>
              <li>Be respectful and professional</li>
            </ul>
          </div>

          <div className="ask-community__card ask-community__stats">
            <h3 className="ask-community__card-title">
              📊 Community Stats
            </h3>
            <div className="ask-community__stat-item">
              <div className="ask-community__stat-number">2,543</div>
              <div className="ask-community__stat-label">Questions Answered</div>
            </div>
            <div className="ask-community__stat-item">
              <div className="ask-community__stat-number">95%</div>
              <div className="ask-community__stat-label">Response Rate</div>
            </div>
            <div className="ask-community__stat-item">
              <div className="ask-community__stat-number">{'< 24h'}</div>
              <div className="ask-community__stat-label">Avg. Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AskCommunity
