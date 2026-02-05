import { useState, useEffect } from 'react'
import { Search, Plus, Calendar, Users } from 'lucide-react'
import { eventService } from '../services/eventService'
import { useAuth } from '../context/AuthContext'
import '../styles/Mentorship.css'

interface Event {
  id: number
  title: string
  description: string
  startDateTime: string
  endDateTime: string
  location: string
  attendeeCount: number
  maxAttendees: number
  status: string
  createdBy: number
  isFeatured?: boolean
  bannerImageUrl?: string
  isVirtual?: boolean
  meetingLink?: string
}

const Mentorship = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'registered'>('upcoming')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    fetchEvents()
  }, [activeTab])

  const fetchEvents = async () => {
    setLoading(true)
    setError('')
    
    try {
      let response
      
      // For all tabs, fetch all published events
      response = await eventService.getAllEvents()
      
      if (response.success && response.data) {
        let fetchedEvents = response.data
        
        // Filter based on tab
        const now = new Date()
        if (activeTab === 'upcoming') {
          fetchedEvents = fetchedEvents.filter((event: Event) => 
            new Date(event.startDateTime) >= now
          )
        } else if (activeTab === 'past') {
          fetchedEvents = fetchedEvents.filter((event: Event) => 
            new Date(event.endDateTime) < now
          )
        } else if (activeTab === 'registered') {
          // For registered events, we would need to check if user has RSVP'd
          // For now, show empty or implement backend endpoint
          fetchedEvents = []
        }
        
        setEvents(fetchedEvents)
      }
    } catch (err: any) {
      console.error('Error fetching mentorship sessions:', err)
      
      // Handle specific error cases
      if (err.response?.status === 403) {
        setError('You do not have permission to view mentorship sessions. Please log in.')
      } else if (err.response?.status === 401) {
        setError('Please log in to view mentorship sessions.')
      } else {
        setError('Failed to load mentorship sessions. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }



  const formatTime = (startDateTime: string, endDateTime: string) => {
    const start = new Date(startDateTime)
    const end = new Date(endDateTime)
    const startTime = start.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    const endTime = end.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    return `${startTime} - ${endTime}`
  }

  const categories = ['All Categories', 'Career Guidance', 'Technical Skills', 'Leadership', 'Personal Development', 'Industry Insights']

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all'
    // TODO: Add category filtering when backend supports it
    return matchesSearch && matchesCategory
  })

  const handleRSVP = async (eventId: number) => {
    if (!user) {
      setError('Please log in to book mentorship sessions')
      return
    }
    
    try {
      const response = await eventService.rsvpToEvent(eventId)
      if (response.success) {
        // Refresh events to update attendee count
        fetchEvents()
        // Show success message briefly
        const successMsg = 'Successfully booked mentorship session!'
        setError('')
        setTimeout(() => {
          // Could show a success toast here
        }, 2000)
      }
    } catch (err: any) {
      console.error('Error booking mentorship session:', err)
      if (err.response?.status === 403 || err.response?.status === 401) {
        setError('Please log in to book mentorship sessions')
      } else {
        setError('Failed to book session. Please try again.')
      }
    }
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
            className={`mentorship-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Available All question
          </button>
          <button
            className={`mentorship-tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            My Question
          </button>
          <button
            className={`mentorship-tab ${activeTab === 'registered' ? 'active' : ''}`}
            onClick={() => setActiveTab('registered')}
          >
            My Answer
          </button>
        </div>
      </div>

      <div className="mentorship-controls">
        <div className="mentorship-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search mentorship sessions..."
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

        <button className="create-session-btn">
          <Plus size={18} />
          Ask the Community
        </button>
      </div>

      <div className="mentorship-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading sessions...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchEvents} className="retry-btn">Retry</button>
          </div>
        ) : activeTab === 'upcoming' && filteredEvents.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No Available Questions</h3>
            <p>There are no questions available at the moment. Check back later!</p>
          </div>
        ) : activeTab === 'past' && filteredEvents.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No Questions Yet</h3>
            <p>Your questions will appear here once you post them.</p>
          </div>
        ) : activeTab === 'registered' && filteredEvents.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>No Booked Sessions</h3>
            <p>Mentorship sessions you've booked will appear here.</p>
          </div>
        ) : (
          <div className="mentorship-grid">
            {filteredEvents.map(event => {
              return (
                <div key={event.id} className="session-card">
                  <div className="session-header">
                    <div className="session-profile">
                      <div className="mentor-avatar">
                        {event.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="mentor-info">
                        <h3 className="mentor-name">{event.title}</h3>
                        <p className="session-category">MENTORSHIP</p>
                      </div>
                    </div>
                  </div>

                  <p className="session-description">{event.description}</p>

                  <div className="session-footer">
                    <div className="session-organizer">
                      <p className="organizer-time">
                        {new Date(event.startDateTime).toLocaleDateString('en-US', { 
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })} at {new Date(event.startDateTime).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                      <p className="organizer-name">Answers: {event.attendeeCount}</p>
                    </div>
                    <button className="like-button">
                      <span className="heart-icon">♡</span> {event.attendeeCount}
                    </button>
                  </div>

                  <button 
                    className="book-session-btn"
                    onClick={() => handleRSVP(event.id)}
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
