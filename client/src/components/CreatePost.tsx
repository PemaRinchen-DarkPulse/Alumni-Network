import React, { useState } from 'react'
import { blogService } from '../services/blogService'
import '../styles/CreatePost.css'

interface CreatePostProps {
  onClose: () => void
}

const CreatePost = ({ onClose }: CreatePostProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
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

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    const fileInput = document.getElementById('image-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('content', formData.content)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('status', status)
      
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      tags.forEach(tag => formDataToSend.append('tags', tag))
      
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      await blogService.createPost(formDataToSend)
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  const applyFormatting = (format: string) => {
    const textarea = document.querySelector('.create-post__content') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = formData.content.substring(start, end)
    let newText = formData.content

    switch (format) {
      case 'bold':
        newText = formData.content.substring(0, start) + `**${selectedText}**` + formData.content.substring(end)
        break
      case 'italic':
        newText = formData.content.substring(0, start) + `*${selectedText}*` + formData.content.substring(end)
        break
      case 'underline':
        newText = formData.content.substring(0, start) + `__${selectedText}__` + formData.content.substring(end)
        break
      case 'list':
        newText = formData.content.substring(0, start) + `\n• ${selectedText}` + formData.content.substring(end)
        break
    }

    setFormData(prev => ({ ...prev, content: newText }))
  }

  return (
    <div className="create-post">
      <div className="create-post__header">
        <div className="create-post__header-left">
          <button className="create-post__back-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="create-post__title">Write a New Blog Post</h1>
        </div>
        <div className="create-post__header-actions">
          <button 
            className="create-post__draft-btn"
            onClick={() => handleSubmit('DRAFT')}
            disabled={loading}
          >
            Save as Draft
          </button>
          <button 
            className="create-post__publish-btn"
            onClick={() => handleSubmit('PUBLISHED')}
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </div>

      {error && <div className="create-post__error">{error}</div>}

      <div className="create-post__content-wrapper">
        <div className="create-post__main">
          <div className="create-post__section">
            <h2 className="create-post__section-title">Blog Details</h2>
            
            <div className="create-post__field">
              <label className="create-post__label">
                Title <span className="create-post__required">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., My Journey to Success"
                className="create-post__input"
              />
            </div>

            <div className="create-post__field-row">
              <div className="create-post__field" style={{ flex: '0 0 40%' }}>
                <label className="create-post__label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="create-post__select"
                >
                  <option value="General">General</option>
                  <option value="Career">Career</option>
                  <option value="Technology">Technology</option>
                  <option value="Success Stories">Success Stories</option>
                  <option value="Tips & Advice">Tips & Advice</option>
                </select>
              </div>

              <div className="create-post__field" style={{ flex: '0 0 60%' }}>
                <label className="create-post__label">Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="career, technology, tips (separate with commas)"
                  className="create-post__input"
                />
            
              </div>
            </div>

            <div className="create-post__field">
              <label className="create-post__label">
                Content <span className="create-post__required">*</span>
              </label>
              <div className="create-post__editor">
                <div className="create-post__toolbar">
                  <button type="button" onClick={() => applyFormatting('bold')} className="create-post__toolbar-btn" title="Bold">
                    <strong>B</strong>
                  </button>
                  <button type="button" onClick={() => applyFormatting('italic')} className="create-post__toolbar-btn" title="Italic">
                    <em>I</em>
                  </button>
                  <button type="button" onClick={() => applyFormatting('underline')} className="create-post__toolbar-btn" title="Underline">
                    <u>U</u>
                  </button>
                  <button type="button" onClick={() => applyFormatting('list')} className="create-post__toolbar-btn" title="Bullet List">
                    ☰
                  </button>
                  <button type="button" className="create-post__toolbar-btn" title="Add Link">
                    🔗
                  </button>
                  <button type="button" className="create-post__toolbar-btn" title="Add Image">
                    🖼
                  </button>
                </div>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Share your story, insights, or experiences with the community..."
                  className="create-post__content"
                  rows={12}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="create-post__sidebar">
          <div className="create-post__card">
            <h3 className="create-post__card-title">
              Featured Image
            </h3>
            <p className="create-post__section-desc">
              Upload a high-quality image to make your post stand out. Recommended size 1200×600px.
            </p>
            
            {imagePreview ? (
              <div className="create-post__image-preview">
                <img src={imagePreview} alt="Preview" className="create-post__preview-img" />
                <button 
                  type="button" 
                  onClick={handleRemoveImage} 
                  className="create-post__remove-img"
                >
                  ✕ Remove Image
                </button>
              </div>
            ) : (
              <div className="create-post__upload-area">
                <label htmlFor="image-upload" className="create-post__upload-label">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <span className="create-post__upload-text">Click to upload image</span>
                  <span className="create-post__upload-hint">PNG, JPG, GIF up to 5MB</span>
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="create-post__file-input"
                />
              </div>
            )}
          </div>

          <div className="create-post__card create-post__tips">
            <h3 className="create-post__card-title">
              💡 Writing Tips
            </h3>
            <ul className="create-post__tips-list">
              <li>Start with an engaging hook to capture attention</li>
              <li>Share personal experiences and lessons learned</li>
              <li>Use clear headings to organize your content</li>
              <li>Include actionable takeaways for readers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost