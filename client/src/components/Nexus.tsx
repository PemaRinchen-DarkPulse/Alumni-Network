import { useState } from 'react'
import { Search, Plus, Briefcase, Users, MapPin, TrendingUp, Star, Filter, Calendar, Clock } from 'lucide-react'
import '../styles/Nexus.css'

interface NexusOpportunity {
  id: number
  title: string
  description: string
  category: 'collaboration' | 'mentorship' | 'job' | 'partnership' | 'project'
  creator: {
    name: string
    title: string
    avatar?: string
  }
  location: string
  type: 'remote' | 'onsite' | 'hybrid'
  participants: number
  maxParticipants?: number
  tags: string[]
  createdAt: string
  isFeatured?: boolean
  status: 'active' | 'filled' | 'expired'
}

interface ScheduleEvent {
  id: number
  title: string
  date: string
  time: string
  type: 'meeting' | 'event' | 'deadline'
}

const Nexus = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'my-connections'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading] = useState(false)

  // Mock data for schedule
  const scheduleEvents: ScheduleEvent[] = [
    {
      id: 1,
      title: 'Career Sync w/ Sarah J.',
      date: '2026-02-06',
      time: '2:00 PM - 2:30 PM',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Resume Review',
      date: '2026-02-08',
      time: '10:00 AM - 10:30 AM',
      type: 'meeting'
    },
    {
      id: 3,
      title: 'Interview Prep',
      date: '2026-02-10',
      time: '3:00 PM - 3:45 PM',
      type: 'event'
    },
    {
      id: 4,
      title: 'Career Planning',
      date: '2026-02-13',
      time: '1:00 PM - 1:30 PM',
      type: 'meeting'
    },
    {
      id: 5,
      title: 'Project Discussion',
      date: '2026-02-15',
      time: '4:00 PM - 4:30 PM',
      type: 'event'
    }
  ]

  // Mock data for nexus opportunities
  const mockOpportunities: NexusOpportunity[] = [
    {
      id: 1,
      title: 'Tech Startup Co-Founder Needed',
      description: 'Looking for a technical co-founder to build an AI-powered education platform. Seeking someone with full-stack development experience and passion for education technology.',
      category: 'partnership',
      creator: {
        name: 'Sarah Johnson',
        title: 'Product Manager at EdTech Inc.',
      },
      location: 'San Francisco, CA',
      type: 'hybrid',
      participants: 3,
      maxParticipants: 1,
      tags: ['AI', 'EdTech', 'Startup', 'Full-Stack'],
      createdAt: '2026-02-01',
      status: 'active'
    },
    {
      id: 2,
      title: 'Open Source Project - Alumni Directory',
      description: 'Contributors wanted for an open-source alumni management system. Great opportunity to improve your coding skills and build something meaningful for our community.',
      category: 'project',
      creator: {
        name: 'Michael Chen',
        title: 'Senior Software Engineer at Google',
      },
      location: 'Remote',
      type: 'remote',
      participants: 8,
      maxParticipants: 15,
      tags: ['Open Source', 'React', 'Node.js', 'MongoDB'],
      createdAt: '2026-01-28',
      status: 'active'
    },
    {
      id: 3,
      title: 'Marketing Strategy Collaboration',
      description: 'Seeking alumni with marketing expertise to collaborate on a digital marketing campaign for a non-profit organization.',
      category: 'collaboration',
      creator: {
        name: 'Emily Rodriguez',
        title: 'Marketing Director at Bright Future',
      },
      location: 'New York, NY',
      type: 'hybrid',
      participants: 2,
      maxParticipants: 5,
      tags: ['Marketing', 'Digital Strategy', 'Non-Profit'],
      createdAt: '2026-01-25',
      status: 'active'
    },
    {
      id: 4,
      title: 'Mentorship Program - Junior Developers',
      description: 'Experienced developers needed to mentor recent graduates transitioning into tech careers. Flexible time commitment, impactful experience.',
      category: 'mentorship',
      creator: {
        name: 'David Kim',
        title: 'Engineering Manager at Tech Corp',
      },
      location: 'Remote',
      type: 'remote',
      participants: 12,
      maxParticipants: 20,
      tags: ['Mentorship', 'Career Development', 'Programming'],
      createdAt: '2026-01-20',
      status: 'active'
    },
    {
      id: 5,
      title: 'Mobile App Development Team',
      description: 'Building a health & wellness mobile app. Looking for iOS/Android developers, UI/UX designers, and health professionals.',
      category: 'project',
      creator: {
        name: 'Jessica Thompson',
        title: 'Founder of WellnessHub',
      },
      location: 'Boston, MA',
      type: 'hybrid',
      participants: 5,
      maxParticipants: 10,
      tags: ['Mobile Dev', 'Health Tech', 'UI/UX', 'iOS', 'Android'],
      createdAt: '2026-01-15',
      status: 'active'
    },
    {
      id: 6,
      title: 'Investment Opportunities in Green Tech',
      description: 'Angel investors and advisors wanted for sustainable energy startup. Early-stage funding round open.',
      category: 'partnership',
      creator: {
        name: 'Robert Martinez',
        title: 'CEO at GreenFuture Energy',
      },
      location: 'Austin, TX',
      type: 'onsite',
      participants: 4,
      maxParticipants: 8,
      tags: ['Investment', 'Green Tech', 'Sustainability', 'Startup'],
      createdAt: '2026-01-10',
      status: 'active'
    }
  ]

  const categories = ['All Categories', 'Collaboration', 'Mentorship', 'Job', 'Partnership', 'Project']

  const filteredOpportunities = mockOpportunities.filter(opportunity => {
    const matchesSearch = opportunity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         opportunity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || opportunity.category === selectedCategory
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'active' && opportunity.status === 'active') ||
                       (activeTab === 'my-connections')
    return matchesSearch && matchesCategory && matchesTab
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'collaboration': return <Users size={16} />
      case 'mentorship': return <TrendingUp size={16} />
      case 'job': return <Briefcase size={16} />
      case 'partnership': return <Star size={16} />
      case 'project': return <Briefcase size={16} />
      default: return <Briefcase size={16} />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'collaboration': return '#0066ff'
      case 'mentorship': return '#10b981'
      case 'job': return '#f59e0b'
      case 'partnership': return '#8b5cf6'
      case 'project': return '#ec4899'
      default: return '#6b7280'
    }
  }

  return (
    <div className="nexus-page">
      <div className="nexus-header">
        <div className="nexus-title-section">
          <h1>Nexus Hub</h1>
          <p>Discover collaboration opportunities, partnerships, and meaningful connections within the alumni network.</p>
        </div>

        <div className="nexus-tabs">
          <button
            className={`nexus-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Opportunities
          </button>
          <button
            className={`nexus-tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button
            className={`nexus-tab ${activeTab === 'my-connections' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-connections')}
          >
            My Connections
          </button>
        </div>
      </div>

      <div className="nexus-controls">
        <div className="nexus-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search opportunities, skills, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="nexus-category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category.toLowerCase().replace(' ', '-')}>
              {category}
            </option>
          ))}
        </select>

        <button className="create-nexus-btn">
          <Plus size={18} />
          Post Opportunity
        </button>
      </div>

      <div className="nexus-content">
        <div className="nexus-main">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading opportunities...</p>
            </div>
          ) : filteredOpportunities.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={48} />
              <h3>No Opportunities Found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="nexus-grid">
            {filteredOpportunities.map(opportunity => (
                <div key={opportunity.id} className="nexus-card">
                  <div className="nexus-card-header">
                    <div className="category-badge" style={{ backgroundColor: getCategoryColor(opportunity.category) }}>
                      {getCategoryIcon(opportunity.category)}
                      <span>{opportunity.category.toUpperCase()}</span>
                    </div>
                    <div className="nexus-card-meta">
                      <span>{new Date(opportunity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="nexus-card-content">
                    <h3>{opportunity.title}</h3>
                    <p>{opportunity.description}</p>

                    <div className="nexus-card-details">
                      <div className="nexus-detail">
                        <MapPin size={14} />
                        <span>{opportunity.location}</span>
                      </div>
                      <div className="nexus-detail">
                        <Users size={14} />
                        <span>{opportunity.participants} {opportunity.maxParticipants ? `/ ${opportunity.maxParticipants}` : ''} joined</span>
                      </div>
                    </div>

                    <div className="nexus-tags">
                      {opportunity.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="tag-small">{tag}</span>
                      ))}
                      {opportunity.tags.length > 3 && (
                        <span className="tag-small more">+{opportunity.tags.length - 3}</span>
                      )}
                    </div>
                  </div>

                  <div className="nexus-card-footer">
                    <div className="creator-info">
                      <div className="creator-avatar"></div>
                      <div className="creator-details">
                        <span className="creator-name">{opportunity.creator.name}</span>
                        <span className="creator-title">{opportunity.creator.title}</span>
                      </div>
                    </div>
                    <button className="connect-btn">
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="nexus-sidebar">
          <div className="schedule-container">
            <div className="schedule-header">
              <div className="schedule-title">
                <Calendar size={20} />
                <h3>Your Schedule</h3>
              </div>
              <button className="view-all-btn">View All</button>
            </div>

            <div className="schedule-list">
              {scheduleEvents.map((event, index) => {
                const eventDate = new Date(event.date)
                const isToday = eventDate.toDateString() === new Date().toDateString()
                const day = eventDate.getDate()
                const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()

                return (
                  <div key={event.id} className="schedule-item">
                    <div className="schedule-date">
                      <span className="schedule-month">{isToday ? 'TODAY' : month}</span>
                      <span className="schedule-day">{day}</span>
                    </div>
                    <div className="schedule-details">
                      <h4>{event.title}</h4>
                      <div className="schedule-time">
                        <Clock size={14} />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <button className="schedule-new-btn">
              <Plus size={16} />
              Schedule New
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Nexus
