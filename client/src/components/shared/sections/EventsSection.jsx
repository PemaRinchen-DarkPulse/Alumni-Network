import React, { useState, useEffect } from 'react'
import { 
  Card,
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { SectionLoadingSpinner, InlineSpinner } from '@/components/ui/LoadingSpinner'
import SectionHero from '@/components/shared/layout/SectionHero'

// Stub eventService (backend removed)
const eventService = {
  registerForEvent: async () => ({}),
  getAllEvents: async () => ({ data: { events: [] } }),
  createEvent: async () => ({}),
};

// Mock data for events - would normally come from an API
const mockEvents = [
  {
    id: 1,
    title: 'Industry Networking Mixer',
    date: new Date('2025-10-12'),
    venue: 'Downtown Conference Center',
    description: 'Connect with alumni working in various industries in a casual networking environment. Meet leaders from tech, finance, healthcare, education, and many other sectors.',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmV0d29ya2luZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 2,
    title: 'Alumni Career Workshop',
    date: new Date('2025-11-05'),
    venue: 'Virtual Event',
    description: 'Join us for a comprehensive career development workshop led by successful alumni. Get insights on job searching, resume building, interview preparation, and career advancement strategies.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d29ya3Nob3B8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 3,
    title: 'Annual Alumni Gala',
    date: new Date('2025-12-15'),
    venue: 'Grand Ballroom, Alumni Center',
    description: 'Join us for our most prestigious event of the year. The Annual Alumni Gala brings together distinguished alumni, faculty, and friends of the university for an evening of celebration, recognition, and fundraising.',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2FsYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60'
  }
]

const EventCard = ({ event }) => {
  const [isRegistering, setIsRegistering] = useState(false)
  
  const handleRegister = async () => {
    try {
      setIsRegistering(true)
      // Call API to register for the event
      await eventService.registerForEvent(event._id || event.id)
      alert('Successfully registered for this event!')
    } catch (error) {
      console.error('Failed to register:', error)
      alert('Failed to register. Please try again.')
    } finally {
      setIsRegistering(false)
    }
  }
  
  const handleLearnMore = () => {
    // This would navigate to the event details page
    // You could implement this with React Router
    alert(`View details for: ${event.title}`)
  }
  
  // Handle image path (backend removed)
  const imageSrc = event.image?.startsWith('http') 
    ? event.image 
    : 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80'
  
  return (
    <Card className="overflow-hidden flex flex-col h-full shadow-md hover:shadow-lg transition-shadow duration-300 p-0">
      <div className="w-full h-48 overflow-hidden m-0 p-0">
        <img 
          src={imageSrc} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
      </div>
      <CardHeader className="pt-4">
        <div className="flex items-center text-blue-500 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {format(new Date(event.date), 'MMMM d, yyyy')}
        </div>
        <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
        <CardDescription className="text-gray-600">{event.venue}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="line-clamp-3 text-gray-700">
          {event.description}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 pb-6 gap-2">
        <Button variant="outline" className="flex-1" onClick={handleLearnMore}>Learn More</Button>
        <Button 
          className="flex-1" 
          onClick={handleRegister}
          disabled={isRegistering}
        >
          {isRegistering ? (
            <>
              <InlineSpinner variant="white" className="mr-2" />
              Registering...
            </>
          ) : 'Register'}
        </Button>
      </CardFooter>
    </Card>
  )
}

const CreateEventModal = ({ isOpen, onClose, onSubmit }) => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    venue: '',
    description: '',
    image: null
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setEventData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEventData(prev => ({ ...prev, image: e.target.files[0] }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(eventData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
        <button 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event Title</label>
              <input 
                type="text" 
                name="title"
                value={eventData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Event Date</label>
              <input 
                type="date" 
                name="date"
                value={eventData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Venue</label>
              <input 
                type="text" 
                name="venue"
                value={eventData.venue}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Banner Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea 
                name="description"
                value={eventData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
          </div>
          <div className="mt-6">
            <Button type="submit" className="w-full">Publish Event</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

const EventsSection = () => {
  const [events, setEvents] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const response = await eventService.getAllEvents()
        setEvents(response.data)
        setError(null)
      } catch (error) {
        console.error('Failed to fetch events:', error)
        setError('Failed to load events. Please try again later.')
        // Use mock data as fallback when API fails
        setEvents(mockEvents)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const handleCreateEvent = async (newEvent) => {
    try {
      // Create FormData instance for file uploads
      const formData = new FormData();
      
      // Add all fields to the formData
      formData.append('title', newEvent.title);
      formData.append('date', newEvent.date);
      formData.append('venue', newEvent.venue);
      formData.append('description', newEvent.description);
      
      // Only append image if it exists
      if (newEvent.image) {
        formData.append('image', newEvent.image);
      }
      
      // Send the formData to the server
      const response = await eventService.createEvent(formData);
      
      // Add the newly created event to the state
      setEvents([response.data.event, ...events]);
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
      
      // Fallback for demo when API fails
      const eventWithId = {
        ...newEvent,
        id: Date.now(),
        date: new Date(newEvent.date),
        // For demo purposes, using a placeholder image
        image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGV2ZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60'
      };
      setEvents([eventWithId, ...events]);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SectionHero 
        title="Upcoming Events"
        description="Join us for exciting events, workshops, and networking opportunities designed to connect our community and foster growth."
        icon="calendar"
        gradient="from-orange-500 to-red-600"
        actionButton={{
          label: "Create New Event",
          icon: "plus",
          onClick: () => setIsModalOpen(true)
        }}
      />
      
      {loading ? (
        <SectionLoadingSpinner section="events" />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No events found.</p>
          <p className="text-gray-500">Be the first to create an event!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event._id || event.id} event={event} />
          ))}
        </div>
      )}

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
    </div>
  )
}

export default EventsSection