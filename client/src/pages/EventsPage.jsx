import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  CalendarDays, 
  MapPin, 
  Search, 
  LayoutGrid, 
  List, 
  Plus,
  Clock,
  Users
} from 'lucide-react';
import { eventAPI } from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/auth/useAuth';

const EventsPage = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleEvents, setVisibleEvents] = useState(6);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleRsvp = async (eventId) => {
    if (!token || !user) {
      alert('Please login to RSVP for events');
      return;
    }

    try {
      const response = await eventAPI.rsvpToEvent(eventId, token);
      if (response.success) {
        // Update local state immediately
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.id === eventId
              ? { ...event, isRsvped: true, attendeeCount: event.attendeeCount + 1 }
              : event
          )
        );
        alert('Successfully registered for the event!');
      } else {
        alert('Failed to RSVP: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error RSVPing:', error);
      alert('Failed to RSVP. Please try again.');
    }
  };

  const handleCancelRsvp = async (eventId) => {
    if (!token || !user) {
      alert('Please login to cancel RSVP');
      return;
    }

    if (!confirm('Are you sure you want to cancel your RSVP for this event?')) {
      return;
    }

    try {
      const response = await eventAPI.cancelRsvp(eventId, token);
      if (response.success) {
        // Update local state immediately
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.id === eventId
              ? { ...event, isRsvped: false, attendeeCount: Math.max(0, event.attendeeCount - 1) }
              : event
          )
        );
        alert('RSVP cancelled successfully!');
      } else {
        alert('Failed to cancel RSVP: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error cancelling RSVP:', error);
      alert('Failed to cancel RSVP. Please try again.');
    }
  };

  // Fetch events from the database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await eventAPI.getAllEvents();
        
        if (response.success) {
          // Transform backend data to match frontend structure
          const transformedEvents = response.data.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            date: new Date(event.startDateTime),
            time: formatEventTime(event.startDateTime, event.endDateTime),
            location: event.isVirtual ? (event.meetingLink || 'Online (Virtual)') : (event.location || 'TBD'),
            image: event.bannerImageUrl 
              ? `data:image/jpeg;base64,${event.bannerImageUrl}` 
              : 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80',
            category: 'Featured', // Can be derived from event type if added to backend
            badge: event.isFeatured ? 'FEATURED' : 'EVENT',
            organizer: {
              name: 'Alumni Association', // Will need to join with user table for actual organizer
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${event.createdBy || 'default'}`
            },
            attendeeCount: event.attendees.length,
            capacity: event.maxAttendees || 100,
            attendees: event.attendees,
            isFeatured: event.isFeatured || false,
            isVirtual: event.isVirtual,
            virtualLink: event.meetingLink,
            isRsvped: user ? event.attendees.some(attendee => attendee.id === user.id) : false,
          }));
          
          setEvents(transformedEvents);
        } else {
          setError(response.error || 'Failed to fetch events');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Helper function to format event time
  const formatEventTime = (startDateTime, endDateTime) => {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    
    const formatTime = (date) => {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    };
    
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  // Filter events based on active tab
  const currentDate = new Date();
  const filteredByTab = events.filter(event => {
    const isUpcoming = event.date >= currentDate;
    if (activeTab === 'upcoming') {
      return isUpcoming && !event.isRsvped;
    } else if (activeTab === 'past') {
      return !isUpcoming;
    } else if (activeTab === 'registered') {
      return event.isRsvped;
    }
    return true;
  });

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit'
    }).format(date);
  };

  const formatDay = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit'
    }).format(date);
  };

  const formatMonth = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short'
    }).format(date).toUpperCase();
  };

  const getBadgeColor = (badge) => {
    const colors = {
      'FEATURED': 'bg-blue-600',
      'Workshop': 'bg-orange-500',
      'Date': 'bg-pink-500',
      'Career': 'bg-green-600',
      'Cultural': 'bg-purple-500',
      'Networking': 'bg-teal-600'
    };
    return colors[badge] || 'bg-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Events & Gatherings</h1>
            <p className="text-gray-600">
              Connect with your peers at upcoming workshops, reunions, and webinars.
            </p>
          </div>
          
          {/* Top Right Tabs */}
          <div className="flex gap-1 border-b">
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2 font-medium transition-colors ${
                activeTab === 'upcoming' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Upcoming Events
            </button>
            <button 
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2 font-medium transition-colors ${
                activeTab === 'past' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Past Events
            </button>
            <button 
              onClick={() => setActiveTab('registered')}
              className={`px-6 py-2 font-medium transition-colors ${
                activeTab === 'registered' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Registered Events
            </button>
          </div>
        </div>

        {/* Tabs removed as requested */}

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 h-12">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="career">Career</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="reunion">Reunion</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6"
              onClick={() => navigate('/dashboard/events/create')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <LoadingSpinner size="large" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <CalendarDays className="w-16 h-16 mx-auto mb-4 text-red-300" />
              <h3 className="text-xl font-semibold text-red-900 mb-2">
                Error Loading Events
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 hover:bg-red-700"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

            {/* Events Content */}
            {!loading && !error && (
                <>
                    {filteredByTab.length === 0 ? (
                        <div className="text-center py-16">
                            <CalendarDays className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No {activeTab} events found
                            </h3>
                            <p className="text-gray-600">
                                {activeTab === 'past'
                                    ? 'There are no past events yet.'
                                    : 'Check back later for upcoming events.'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Featured Events */}
                            {filteredByTab.slice(0, visibleEvents).map((event) => (
                                event.isFeatured && activeTab === 'upcoming' ? (
                                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow p-0 border-0 shadow-lg rounded-2xl">
                                        <div className="relative h-[28rem]">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                                <span className={`${getBadgeColor(event.badge)} text-white text-xs font-semibold px-3 py-1 rounded-full w-fit mb-4`}>
                                                    {event.badge}
                                                </span>
                                                <h2 className="text-4xl font-bold mb-3">{event.title}</h2>
                                                <p className="text-lg text-gray-200 mb-4 max-w-3xl">
                                                    {event.description}
                                                </p>
                                                <div className="flex items-center gap-6 text-sm mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <CalendarDays className="w-5 h-5" />
                                                        <span>{formatDate(event.date)} • {event.time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-5 h-5" />
                                                        <span>{event.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-5 h-5" />
                                                        <span>{event.attendeeCount}/{event.capacity} attending</span>
                                                    </div>
                                                </div>
                                                <Button 
                                                    className="bg-white text-blue-600 hover:bg-gray-100 w-fit"
                                                    onClick={() => activeTab === 'registered' ? handleCancelRsvp(event.id) : handleRsvp(event.id)}
                                                    disabled={activeTab === 'upcoming' && event.isRsvped}
                                                >
                                                    {activeTab === 'registered' ? 'Cancel RSVP' : (event.isRsvped ? 'Registered' : 'RSVP Now')}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ) : null
                            ))}

                            {/* Non-Featured Events Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredByTab.slice(0, visibleEvents).map((event) => (
                                    !event.isFeatured || activeTab !== 'upcoming' ? (
                                        <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow p-0">
                                            <div className="relative">
                                                {/* Date Badge */}
                                                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 text-center z-10">
                                                    <div className="text-xs font-semibold text-gray-600">
                                                        {formatMonth(event.date)}
                                                    </div>
                                                    <div className="text-2xl font-bold text-gray-900">
                                                        {formatDay(event.date)}
                                                    </div>
                                                </div>

                                                {/* Badge */}
                                                {event.badge && (
                                                    <div className="absolute top-4 right-4 z-10">
                                                        <span className={`${getBadgeColor(event.badge)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                                                            {event.badge}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Event Image */}
                                                <div className="h-48 overflow-hidden">
                                                    <img
                                                        src={event.image}
                                                        alt={event.title}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            </div>

                                            <CardContent className="p-6 pb-4">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                    {event.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                    {event.description}
                                                </p>

                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Clock className="w-4 h-4 mr-2" />
                                                        <span>{event.time}</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                                        <MapPin className="w-4 h-4 mr-2" />
                                                        <span>{event.location}</span>
                                                    </div>
                                                </div>

                                                {/* Organizer and Attendee Count */}
                                                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="w-8 h-8">
                                                            <AvatarImage src={event.organizer?.avatar} alt={event.organizer?.name} />
                                                            <AvatarFallback>{event.organizer?.name?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-sm text-gray-600">{event.organizer?.name}</span>
                                                    </div>

                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <Users className="w-4 h-4" />
                                                        <span>{event.attendeeCount}/{event.capacity}</span>
                                                    </div>
                                                </div>

                                                {/* RSVP Button */}
                                                <Button
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                                                    disabled={activeTab === 'past'}
                                                    onClick={() => activeTab === 'registered' ? handleCancelRsvp(event.id) : handleRsvp(event.id)}
                                                >
                                                    {activeTab === 'past' 
                                                        ? 'Event Ended' 
                                                        : activeTab === 'registered'
                                                            ? 'Cancel RSVP'
                                                            : event.isRsvped 
                                                                ? 'Registered' 
                                                                : 'RSVP now'}
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ) : null
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Load More Button */}
                    {filteredByTab.length > 0 && visibleEvents < filteredByTab.length && (
                        <div className="mt-8 text-center">
                            <Button
                                variant="outline"
                                className="px-8"
                                onClick={() => setVisibleEvents(prev => prev + 6)}
                            >
                                Load More Events →
                            </Button>
                        </div>
                    )}
                </>
            )}
      </div>
    </div>
  );
};

export default EventsPage;
