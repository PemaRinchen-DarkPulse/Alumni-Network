import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PenSquare, 
  Calendar, 
  Briefcase, 
  Heart, 
  MessageSquare, 
  Share2, 
  ThumbsUp,
  MapPin,
  Clock,
  MoreHorizontal
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Student';

  // Mock data for activity feed
  const [activities, setActivities] = useState([
    {
      id: 1,
      author: 'Sonam Tshering',
      class: 'Class of 2015',
      timestamp: '2 hours ago',
      content: 'Just finished hosting the annual "Tech in Finance" webinar! It was amazing to see so many current students interested in fintech. If anyone wants the slides, feel free to connect and DM me. 💼',
      avatar: 'S',
      avatarColor: 'bg-blue-600'
    },
    {
      id: 2,
      author: 'Tashi Dorji',
      class: 'Class of 2018',
      timestamp: '5 hours ago',
      content: 'Excited to announce that our startup just closed Series A funding! Looking to hire talented developers from our alma mater. Check out the careers page!',
      avatar: 'T',
      avatarColor: 'bg-indigo-600'
    }
  ]);

  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Annual Alumni Gala Dinner',
      date: { month: 'OCT', day: '15' },
      location: 'Grand Hall',
      time: '7:00 PM',
      color: 'bg-blue-600'
    },
    {
      id: 2,
      title: 'Regional Networking Night',
      date: { month: 'NOV', day: '02' },
      location: 'Downtown Center',
      time: '6:30 PM',
      color: 'bg-blue-600'
    },
    {
      id: 3,
      title: 'Webinar: Future of AI',
      date: { month: 'NOV', day: '10' },
      location: 'Online',
      time: '1:00 PM',
      color: 'bg-blue-600'
    }
  ];

  const quickActions = [
    {
      icon: PenSquare,
      title: 'Write a Blog',
      description: 'Share your expertise',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => console.log('Navigate to blog creation')
    },
    {
      icon: Calendar,
      title: 'Create Event',
      description: 'Host a meetup',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => console.log('Navigate to event creation')
    },
    {
      icon: Briefcase,
      title: 'Post a Job',
      description: 'Hire graduates',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => console.log('Navigate to job posting')
    },
    {
      icon: Heart,
      title: 'Give Back',
      description: 'Donate to fund',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: () => console.log('Navigate to donations')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {firstName}</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your network today.</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Share2 className="mr-2 h-4 w-4" />
            Share Update
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`${action.bgColor} ${action.color} p-2 rounded-lg`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{action.title}</p>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Career Advancement Banner */}
          <div className="lg:col-span-2">
            <div className="bg-blue-600 rounded-xl p-8 h-full">
              <h2 className="text-2xl font-bold text-white mb-2">
                Advance Your Career
              </h2>
              <p className="text-blue-100 mb-6">
                Connect with alumni, find your next internship, or explore mentorship opportunities available for your major.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow text-left group">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Find a Mentor</h3>
                  <p className="text-sm text-gray-600">Get guidance from alumni</p>
                </button>

                <button className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow text-left group">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Alumni Directory</h3>
                  <p className="text-sm text-gray-600">Expand your network</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed and Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Happening Now - Activity Feed */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Happening Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {activities.map((activity) => (
                  <div key={activity.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                    <div className="flex gap-4">
                      <div className={`${activity.avatarColor} text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold text-lg flex-shrink-0`}>
                        {activity.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">{activity.author}</h4>
                            <p className="text-sm text-blue-600">• {activity.class}</p>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <span className="text-sm">{activity.timestamp}</span>
                            <button className="hover:bg-gray-100 p-1 rounded">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-3 leading-relaxed">{activity.content}</p>
                        <div className="flex items-center gap-4 mt-4">
                          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <ThumbsUp className="h-4 w-4" />
                            <span className="text-sm">React</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <MessageSquare className="h-4 w-4" />
                            <span className="text-sm">Comment</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Share2 className="h-4 w-4" />
                            <span className="text-sm">Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Events</CardTitle>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex gap-4">
                    <div className={`${event.color} text-white rounded-lg w-16 h-16 flex flex-col items-center justify-center flex-shrink-0`}>
                      <span className="text-xs font-semibold uppercase">{event.date.month}</span>
                      <span className="text-2xl font-bold">{event.date.day}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;