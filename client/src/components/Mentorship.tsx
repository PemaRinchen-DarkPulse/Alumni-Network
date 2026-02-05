import { useState, useEffect } from 'react'
import { Search, Plus, Calendar, Users } from 'lucide-react'
import { questionService, type Question } from '../services/questionService'
import { useAuth } from '../context/AuthContext'
import AskCommunity from './AskCommunity'
import '../styles/Mentorship.css'

const Mentorship = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'myQuestions' | 'myAnswers'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAskCommunity, setShowAskCommunity] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchQuestions()
  }, [activeTab])

  const fetchQuestions = async () => {
    setLoading(true)
    setError('')
    
    try {
      let fetchedQuestions: Question[] = []
      
      if (activeTab === 'all') {
        fetchedQuestions = await questionService.getAllQuestions()
      } else if (activeTab === 'myQuestions' && user) {
        fetchedQuestions = await questionService.getUserQuestions(user.id)
      } else if (activeTab === 'myAnswers') {
        // TODO: Implement answers endpoint when available
        fetchedQuestions = []
      }
      
      setQuestions(fetchedQuestions)
    } catch (err: any) {
      console.error('Error fetching questions:', err)
      
      if (err.response?.status === 403) {
        setError('You do not have permission to view questions. Please log in.')
      } else if (err.response?.status === 401) {
        setError('Please log in to view questions.')
      } else {
        setError('Failed to load questions. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const categories = ['All Categories', 'Career Guidance', 'Technical Skills', 'Leadership', 'Personal Development', 'Industry Insights']

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                           question.category.toLowerCase().replace(' ', '-') === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAnswerClick = (questionId: number) => {
    // TODO: Navigate to question detail page or open answer modal
    console.log('Answer question:', questionId)
  }

  const handleQuestionPosted = () => {
    setShowAskCommunity(false)
    fetchQuestions() // Refresh the questions list
  }

  const handleCloseAskCommunity = () => {
    setShowAskCommunity(false)
  }

  // If Ask Community modal is open, show it
  if (showAskCommunity) {
    return <AskCommunity onClose={handleCloseAskCommunity} onSuccess={handleQuestionPosted} />
  }

  return (
    <div className="mentorship-page">
      <div className="mentorship-header">
        <div className="mentorship-title-section">
          <h1>Community Mentorship</h1>
          <p>Connect with experienced mentors for guidance, career advice, and skill development.</p>
        </div>

        <div className="mentorship-tabs">
          <button
            className={`mentorship-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Available All Questions
          </button>
          <button
            className={`mentorship-tab ${activeTab === 'myQuestions' ? 'active' : ''}`}
            onClick={() => setActiveTab('myQuestions')}
          >
            My Questions
          </button>
          <button
            className={`mentorship-tab ${activeTab === 'myAnswers' ? 'active' : ''}`}
            onClick={() => setActiveTab('myAnswers')}
          >
            My Answers
          </button>
        </div>
      </div>

      <div className="mentorship-controls">
        <div className="mentorship-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="mentorship-category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category.toLowerCase().replace(' ', '-')}>
              {category}
            </option>
          ))}
        </select>

        <button 
          className="create-session-btn"
          onClick={() => setShowAskCommunity(true)}
        >
          <Plus size={18} />
          Ask the Community
        </button>
      </div>

      <div className="mentorship-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading questions...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchQuestions} className="retry-btn">Retry</button>
          </div>
        ) : activeTab === 'all' && filteredQuestions.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No Available Questions</h3>
            <p>There are no questions available at the moment. Check back later!</p>
          </div>
        ) : activeTab === 'myQuestions' && filteredQuestions.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No Questions Yet</h3>
            <p>Your questions will appear here once you post them.</p>
          </div>
        ) : activeTab === 'myAnswers' && filteredQuestions.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>No Answers Yet</h3>
            <p>Questions you've answered will appear here.</p>
          </div>
        ) : (
          <div className="mentorship-grid">
            {filteredQuestions.map(question => {
              return (
                <div key={question.id} className="session-card">
                  <div className="session-header">
                    <div className="session-profile">
                      <div className="mentor-avatar">
                        {question.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div className="mentor-info">
                        <h3 className="mentor-name">{question.authorName}</h3>
                        <p className="session-category">{question.category.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>

                  <h4 className="question-title">{question.title}</h4>
                  <p className="session-description">{question.description}</p>

                  {question.tags && question.tags.length > 0 && (
                    <div className="question-tags">
                      {question.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="session-footer">
                    <div className="session-organizer">
                      <p className="organizer-time">
                        {new Date(question.createdAt).toLocaleDateString('en-US', { 
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })} at {new Date(question.createdAt).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                      <p className="organizer-name">Answers: {question.answerCount}</p>
                    </div>
                    <button className="like-button">
                      <span className="heart-icon">♡</span> {question.upvoteCount}
                    </button>
                  </div>

                  <button 
                    className="book-session-btn"
                    onClick={() => handleAnswerClick(question.id)}
                  >
                    Answer now
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Mentorship
