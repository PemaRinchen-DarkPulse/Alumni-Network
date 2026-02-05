import { useState, useEffect } from 'react'
import { connectionService } from '../services/connectionService'
import { eventService } from '../services/eventService'
import { useAuth } from '../context/AuthContext'

export const useDashboardData = () => {
  const { user } = useAuth()
  const [connections, setConnections] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalConnections: 0,
    mentees: 0,
    mentors: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch connections
        const connectionsResponse = await connectionService.getUserConnections(
          user.id,
          'ACCEPTED'
        )
        if (connectionsResponse.success) {
          setConnections(connectionsResponse.data)
        }

        // Fetch connection stats
        const statsResponse = await connectionService.getConnectionStats(user.id)
        if (statsResponse.success) {
          setStats(statsResponse.data)
        }

        // Fetch upcoming events
        const eventsResponse = await eventService.getAllEvents({ userId: user.id })
        if (eventsResponse.success) {
          setEvents(eventsResponse.data)
        }

        setLoading(false)
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  return {
    connections,
    events,
    stats,
    loading,
    error,
    user,
  }
}
