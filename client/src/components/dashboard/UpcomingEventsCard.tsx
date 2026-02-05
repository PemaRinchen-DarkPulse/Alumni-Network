interface Event {
  name: string
  date: string
  attendees: number
}

interface UpcomingEventsCardProps {
  events: Event[]
  onViewAllClick?: () => void
  onJoinClick?: (event: Event) => void
}

const UpcomingEventsCard = ({ events, onViewAllClick, onJoinClick }: UpcomingEventsCardProps) => {
  return (
    <div className="events-row">
      <div className="events-card">
        <div className="card-header">
          <h3>📅 Upcoming Events</h3>
          <button className="view-all-btn" onClick={onViewAllClick}>
            View All →
          </button>
        </div>
        <div className="events-list">
          {events.map((event, index) => (
            <div key={index} className="event-item">
              <div className="event-icon">📅</div>
              <div className="event-info">
                <span className="event-name">{event.name}</span>
                <span className="event-date">{event.date}</span>
              </div>
              <div className="event-attendees">
                <span className="attendees-count">{event.attendees}</span>
                <span className="attendees-label">attending</span>
              </div>
              <button 
                className="event-join-btn"
                onClick={() => onJoinClick?.(event)}
              >
                Join
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UpcomingEventsCard
