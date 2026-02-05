import { useState, useEffect } from 'react'
import { Search, Plus, Calendar, MapPin, Users, Clock } from 'lucide-react'
import { eventService } from '../services/eventService'
import { useAuth } from '../context/AuthContext'
import '../styles/Events.css'

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

const Events = () => {
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
      console.error('Error fetching events:', err)
      
      // Handle specific error cases
      if (err.response?.status === 403) {
        setError('You do not have permission to view these events. Please log in.')
      } else if (err.response?.status === 401) {
        setError('Please log in to view events.')
      } else {
        setError('Failed to load events. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const month = date.toLocaleString('en-US', { month: 'short' })
    const day = date.getDate()
    return { month, day: day.toString() }
  }

  const formatTime = (startDateTime: string, endDateTime: string) => {
    const start = new Date(startDateTime)
    const end = new Date(endDateTime)
    const startTime = start.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    const endTime = end.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    return `${startTime} - ${endTime}`
  }

  const getEventImageUrl = (bannerImageUrl?: string) => {
    if (bannerImageUrl) {
      return `data:image/jpeg;base64,${bannerImageUrl}`
    }
    return null
  }

  const categories = ['All Categories', 'Networking', 'Workshop', 'Competition', 'Career', 'Social']

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all'
    // TODO: Add category filtering when backend supports it
    return matchesSearch && matchesCategory
  })

  const featuredEvent = filteredEvents.find(event => event.isFeatured)
  const regularEvents = filteredEvents.filter(event => !event.isFeatured)

  const handleRSVP = async (eventId: number) => {
    if (!user) {
      setError('Please log in to RSVP to events')
      return
    }
    
    try {
      const response = await eventService.rsvpToEvent(eventId)
      if (response.success) {
        // Refresh events to update attendee count
        fetchEvents()
        // Show success message briefly
        const successMsg = 'Successfully registered for event!'
        setError('')
        setTimeout(() => {
          // Could show a success toast here
        }, 2000)
      }
    } catch (err: any) {
      console.error('Error RSVPing to event:', err)
      if (err.response?.status === 403 || err.response?.status === 401) {
        setError('Please log in to RSVP to events')
      } else {
        setError('Failed to RSVP. Please try again.')
      }
    }
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <div className="events-title-section">
          <h1>Events & Gatherings</h1>
          <p>Connect with your peers at upcoming workshops, reunions, and webinars.</p>
        </div>

        <div className="events-tabs">
          <button
            className={`events-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Events
          </button>
          <button
            className={`events-tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past Events
          </button>
          <button
            className={`events-tab ${activeTab === 'registered' ? 'active' : ''}`}
            onClick={() => setActiveTab('registered')}
          >
            Registered Events
          </button>
        </div>
      </div>

      <div className="events-controls">
        <div className="events-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="events-category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category.toLowerCase().replace(' ', '-')}>
              {category}
            </option>
          ))}
        </select>

        <button className="create-event-btn">
          <Plus size={18} />
          Create Event
        </button>
      </div>

      <div className="events-content">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchEvents} className="retry-btn">Retry</button>
          </div>
        ) : activeTab === 'upcoming' && filteredEvents.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No Upcoming Events</h3>
            <p>There are no upcoming events at the moment. Check back later!</p>
          </div>
        ) : activeTab === 'past' && filteredEvents.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No Past Events</h3>
            <p>Past events will appear here once they're completed.</p>
          </div>
        ) : activeTab === 'registered' && filteredEvents.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>No Registered Events</h3>
            <p>Events you've registered for will appear here.</p>
          </div>
        ) : (
          <>
            {featuredEvent && (
              <div className="featured-event-card">
                <div className="featured-badge">FEATURED</div>
                <div 
                  className="featured-event-image"
                  style={getEventImageUrl(featuredEvent.bannerImageUrl) ? {
                    backgroundImage: `url(${getEventImageUrl(featuredEvent.bannerImageUrl)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : {}}
                >
                  <div className="event-image-overlay"></div>
                </div>
                <div className="featured-event-content">
                  <h2>{featuredEvent.title}</h2>
                  <p>{featuredEvent.description}</p>
                  
                  <div className="featured-event-details">
                    <div className="event-detail">
                      <Calendar size={16} />
                      <span>
                        {new Date(featuredEvent.startDateTime).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })} • {formatTime(featuredEvent.startDateTime, featuredEvent.endDateTime)}
                      </span>
                    </div>
                    <div className="event-detail">
                      <MapPin size={16} />
                      <span>{featuredEvent.location || 'Virtual Event'}</span>
                    </div>
                    <div className="event-detail">
                      <Users size={16} />
                      <span>{featuredEvent.attendeeCount}/{featuredEvent.maxAttendees || 'Unlimited'} attending</span>
                    </div>
                  </div>

                  <button 
                    className="rsvp-btn primary"
                    onClick={() => handleRSVP(featuredEvent.id)}
                  >
                    RSVP Now
                  </button>
                </div>
              </div>
            )}

            <div className="events-grid">
              {regularEvents.map(event => {
                const { month, day } = formatDate(event.startDateTime)
                return (
                  <div key={event.id} className="event-card">
                    <div className="event-card-badge">EVENT</div>
                    <div className="event-card-date">
                      <span className="date-month">{month}</span>
                      <span className="date-day">{day}</span>
                    </div>
                    
                    <div 
                      className="event-card-image"
                      style={getEventImageUrl(event.bannerImageUrl) ? {
                        backgroundImage: `url(${getEventImageUrl(event.bannerImageUrl)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      } : {}}
                    >
                      <div className="event-image-overlay"></div>
                    </div>

                    <div className="event-card-content">
                      <h3>{event.title}</h3>
                      <p>{event.description}</p>

                      <div className="event-card-details">
                        <div className="event-detail">
                          <Clock size={14} />
                          <span>{formatTime(event.startDateTime, event.endDateTime)}</span>
                        </div>
                        <div className="event-detail">
                          <MapPin size={14} />
                          <span>{event.location || 'Virtual Event'}</span>
                        </div>
                      </div>

                      <div className="event-card-footer">
                        <div className="event-organizer">
                          <div className="organizer-avatar"></div>
                          <span>Alumni Association</span>
                        </div>
                        <div className="event-attendees">
                          <Users size={14} />
                          <span>{event.attendeeCount}/{event.maxAttendees || '∞'}</span>
                        </div>
                      </div>

                      <button 
                        className="rsvp-btn"
                        onClick={() => handleRSVP(event.id)}
                      >
                        RSVP now
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Events
