import React, { useState } from 'react';
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

// Mock data for events
const mockEvents = [
  {
    id: 1,
    title: 'Annual Alumni Gala 2024',
    description: 'Join us for an evening of networking, celebration, and giving back. Connect with fellow graduates and celebrate our collective achievements',
    date: new Date('2024-10-24'),
    time: '5:00 PM',
    location: 'Grand Hall, Main Campus',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80',
    category: 'Featured',
    badge: 'FEATURED',
    organizer: {
      name: 'Priya Sharma',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya'
    },
    attendeeCount: 156,
    capacity: 200,
    attendees: [
      { id: 1, name: 'User 1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
      { id: 2, name: 'User 2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
      { id: 3, name: 'User 3', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
    ],
    isFeatured: true
  },
  {
    id: 2,
    title: 'Intro to Data Science',
    description: 'A comprehensive workshop for beginners to learn the fundamentals of Data Science and Data Analytics',
    date: new Date('2024-11-05'),
    time: '7:30 PM - 9:30 PM',
    location: 'Coffee Ground',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    category: 'Workshop',
    badge: 'Workshop',
    organizer: {
      name: 'Dr. James Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james'
    },
    attendeeCount: 89,
    capacity: 120,
    attendees: [
      { id: 1, name: 'User 1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
      { id: 2, name: 'User 2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
    ]
  },
  {
    id: 3,
    title: 'Class of 2014 Reunion',
    description: 'It\'s been 10 years since our class graduated! Let\'s come together to reconnect, reminisce, and mingle',
    date: new Date('2024-12-12'),
    time: '7:00 PM - 11:00 PM',
    location: 'Alumni Center',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
    category: 'Date',
    badge: 'Date',
    organizer: {
      name: 'Sarah Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
    },
    attendeeCount: 142,
    capacity: 150,
    attendees: [
      { id: 1, name: 'User 1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6' },
      { id: 2, name: 'User 2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7' },
      { id: 3, name: 'User 3', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8' },
    ]
  },
  {
    id: 4,
    title: 'Tech Trends 2025',
    description: 'Join industry experts as they share insights into the future of technology, AI, and digital transformation',
    date: new Date('2024-11-18'),
    time: '10:00 AM - 3:30 PM',
    location: 'Online (Webinar)',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
    category: 'Career',
    badge: 'Career',
    organizer: {
      name: 'Michael Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael'
    },
    attendeeCount: 325,
    capacity: 500,
    attendees: [
      { id: 1, name: 'User 1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9' },
      { id: 2, name: 'User 2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10' },
    ]
  },
  {
    id: 5,
    title: 'Autumn Music Fest',
    description: 'A delightful autumn evening filled with our student body and alumni network',
    date: new Date('2024-12-01'),
    time: '5:00 PM - 10:00 PM',
    location: 'Amphitheater',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    category: 'Cultural',
    badge: 'Cultural',
    organizer: {
      name: 'Emily Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily'
    },
    attendeeCount: 98,
    capacity: 200,
    attendees: [
      { id: 1, name: 'User 1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11' },
      { id: 2, name: 'User 2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12' },
      { id: 3, name: 'User 3', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=13' },
    ]
  },
  {
    id: 6,
    title: 'Start-up Pitch Night',
    description: 'Watch innovative startups pitch their ideas to investors. Great networking opportunity.',
    date: new Date('2024-12-01'),
    time: '6:30 PM - 9:00 PM',
    location: 'Innovation Hub',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
    category: 'Networking',
    badge: 'Networking',
    organizer: {
      name: 'David Kim',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david'
    },
    attendeeCount: 67,
    capacity: 80,
    attendees: [
      { id: 1, name: 'User 1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=14' },
      { id: 2, name: 'User 2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=15' },
    ]
  }
];

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
              className="px-6 py-2 text-blue-600 border-b-2 border-blue-600 font-medium"
            >
              Upcoming Events
            </button>
            <button 
              className="px-6 py-2 text-gray-500 hover:text-gray-700 font-medium"
            >
              Past Events
            </button>
            <button 
              className="px-6 py-2 text-gray-500 hover:text-gray-700 font-medium"
            >
              My Events
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
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>

        {/* Events Content */}
        {/* Featured Event */}
        {mockEvents[0].isFeatured && (
          <Card className="mb-8 overflow-hidden p-0 border-0 shadow-lg rounded-2xl">
            <div className="relative h-[32rem]">
              <img 
                src={mockEvents[0].image} 
                alt={mockEvents[0].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <span className={`${getBadgeColor(mockEvents[0].badge)} text-white text-xs font-semibold px-3 py-1 rounded-full w-fit mb-4`}>
                  {mockEvents[0].badge}
                </span>
                <h2 className="text-4xl font-bold mb-3">{mockEvents[0].title}</h2>
                <p className="text-lg text-gray-200 mb-4 max-w-3xl">
                  {mockEvents[0].description}
                </p>
                <div className="flex items-center gap-6 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" />
                    <span>{formatDate(mockEvents[0].date)} • {mockEvents[0].time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{mockEvents[0].location}</span>
                  </div>
                </div>
                <Button className="bg-white text-blue-600 hover:bg-gray-100 w-fit">
                  RSVP Now
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Event Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'flex flex-col gap-4'}>
          {mockEvents.slice(1).map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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

              <CardContent className="p-6">
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
                    <span className="text-sm text-gray-600">by {event.organizer?.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{event.attendeeCount}/{event.capacity}</span>
                  </div>
                </div>

                {/* RSVP Button */}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  RSVP
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Suggest an Event Card */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 bg-gray-50">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Suggest an Event
              </h3>
              <p className="text-gray-600 text-sm text-center mb-4">
                Submit your proposal to the board
              </p>
              <Button variant="outline" className="mt-auto">
                Suggest Event
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Load More Button */}
        <div className="mt-8 text-center">
          <Button variant="outline" className="px-8">
            Load More Events →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
