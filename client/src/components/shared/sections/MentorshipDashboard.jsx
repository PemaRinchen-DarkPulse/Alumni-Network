import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { Button } from '../../ui/button';
import { 
  Users, 
  Clock, 
  Star, 
  Calendar,
  MessageSquare,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAuth } from '../../../contexts/auth';
import LoadingSpinner from '../../ui/LoadingSpinner';
import { motion } from 'framer-motion';

const MentorshipDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isAccepting, setIsAccepting] = useState(true);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    activeMentees: 4,
    hoursDonated: 12.5,
    rating: 4.9,
    totalReviews: 5,
    incomingRequests: [],
    upcomingSessions: []
  });

  useEffect(() => {
    // Check for success message from navigation state
    if (location.state?.message) {
      setNotification({
        message: location.state.message,
        type: location.state.type || 'success'
      });
      
      // Clear the notification after 4 seconds
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      
      // Clear the location state
      window.history.replaceState({}, document.title);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    // TODO: Fetch mentorship dashboard data from API
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setDashboardData({
            activeMentees: 4,
            hoursDonated: 12.5,
            rating: 4.9,
            totalReviews: 5,
            incomingRequests: [
              {
                id: 1,
                name: 'Maya Lin',
                role: 'Computer Science Senior',
                topic: 'Career Guidance',
                message: '"Hi James, I saw your profile and I\'m very interested in your transition from engineering to product management. I\'d love to chat for 15 mins..."',
                avatar: null
              },
              {
                id: 2,
                name: 'Liam Scott',
                role: 'Design Major',
                topic: 'Portfolio Review',
                message: '"Hello! I am preparing my portfolio for summer internships and would greatly appreciate your feedback on my UX case studies."',
                avatar: null
              },
              {
                id: 3,
                name: 'Emma Wilson',
                role: 'Business Administration Junior',
                topic: 'Networking Strategies',
                message: '"Hi! I\'m looking to build my professional network and would love to learn from your experience about effective networking in the tech industry."',
                avatar: null
              },
              {
                id: 4,
                name: 'Alex Chen',
                role: 'MBA Candidate',
                topic: 'Career Transition',
                message: '"Good afternoon! I\'m transitioning from finance to tech and would appreciate your insights on making this career change successfully."',
                avatar: null
              },
              {
                id: 5,
                name: 'Sophie Martinez',
                role: 'Marketing Senior',
                topic: 'Industry Insights',
                message: '"Hello! I\'m exploring different career paths in tech marketing and would love to hear about your experiences in the industry."',
                avatar: null
              },
              {
                id: 6,
                name: 'James Thompson',
                role: 'Engineering Junior',
                topic: 'Technical Skills',
                message: '"Hi there! I\'m working on improving my coding skills and would appreciate guidance on what technologies to focus on for career growth."',
                avatar: null
              }
            ],
            upcomingSessions: [
              {
                id: 1,
                date: 'TODAY',
                day: '24',
                time: '2:00 PM - 2:30 PM',
                mentee: 'Sarah J.',
                canJoin: true,
                canReschedule: true
              },
              {
                id: 2,
                date: 'NOV',
                day: '02',
                time: '10:00 AM - 10:30 AM',
                mentee: 'David Chen',
                title: 'Resume Review',
                canJoin: false,
                canReschedule: true
              },
              {
                id: 3,
                date: 'NOV',
                day: '05',
                time: '3:00 PM - 3:45 PM',
                mentee: 'Emily Parker',
                title: 'Interview Prep',
                canJoin: false,
                canReschedule: true
              },
              {
                id: 4,
                date: 'NOV',
                day: '08',
                time: '1:00 PM - 1:30 PM',
                mentee: 'Michael Torres',
                title: 'Career Planning',
                canJoin: false,
                canReschedule: true
              },
              {
                id: 5,
                date: 'NOV',
                day: '10',
                time: '4:00 PM - 4:30 PM',
                mentee: 'Lisa Anderson',
                title: 'Project Discussion',
                canJoin: false,
                canReschedule: true
              },
              {
                id: 6,
                date: 'NOV',
                day: '12',
                time: '11:00 AM - 11:45 AM',
                mentee: 'Ryan Mitchell',
                title: 'Leadership Advice',
                canJoin: false,
                canReschedule: true
              }
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDecline = (requestId) => {
    console.log('Declining request:', requestId);
    // TODO: API call to decline request
  };

  const handleReview = (requestId) => {
    console.log('Reviewing request:', requestId);
    // TODO: Navigate to request detail or open modal
  };

  const handleUpdateAvailability = () => {
    console.log('Update availability clicked');
    // TODO: Navigate to availability settings
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Success/Error Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              notification.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
            <span>{notification.message}</span>
          </motion.div>
        )}
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full mb-3">
                Alumni Access
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Mentorship Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Manage your mentorship profile, availability, and incoming requests.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Accepting Mentees</p>
                <p className="text-xs text-gray-500">Toggle to manage requests</p>
              </div>
              <Switch
                checked={isAccepting}
                onCheckedChange={setIsAccepting}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Incoming Requests (2 columns) */}
          <div className="lg:col-span-2">
            {/* Incoming Requests Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Incoming Requests</h2>
              <button 
                onClick={() => setShowAllRequests(!showAllRequests)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {showAllRequests ? 'Show Less' : 'View All'}
              </button>
            </div>

            {/* Incoming Request Cards in 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {(showAllRequests ? dashboardData.incomingRequests : dashboardData.incomingRequests.slice(0, 4)).map((request) => (
                <Card key={request.id} className="p-6">
                  <div className="flex flex-col h-full">
                    {/* Avatar and Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {request.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{request.name}</h3>
                        <p className="text-sm text-gray-600">{request.role} • Asking for {request.topic}</p>
                      </div>
                    </div>

                    {/* Message */}
                    <p className="text-gray-700 text-sm italic flex-1 mb-4">
                      {request.message}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => handleDecline(request.id)}
                        variant="outline"
                        className="flex-1"
                      >
                        Decline
                      </Button>
                      <Button
                        onClick={() => handleReview(request.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Section - Your Schedule (1 column) */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gray-900 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold">Your Schedule</h3>
                </div>
                <button 
                  onClick={() => setShowAllSessions(!showAllSessions)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  {showAllSessions ? 'Show Less' : 'View All'}
                </button>
              </div>
              
              <div className="space-y-3">
                {(showAllSessions ? dashboardData.upcomingSessions : dashboardData.upcomingSessions.slice(0, 5)).map((session) => (
                  <div key={session.id} className="border-l-4 border-yellow-400 pl-4 py-3 bg-gray-800 rounded-r">
                    <div className="flex items-start gap-3">
                      {/* Date Badge */}
                      <div className="text-center flex-shrink-0">
                        <div className="text-xs text-gray-400 font-medium">{session.date}</div>
                        <div className="text-xl font-bold text-white">{session.day}</div>
                      </div>

                      {/* Session Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white mb-1">
                          {session.title || `Career Sync w/ ${session.mentee}`}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-blue-400">
                          <Clock className="w-3 h-3" />
                          <span>{session.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-sm text-blue-400 hover:text-blue-300 font-medium border border-gray-700 rounded hover:bg-gray-800 transition-colors">
                + Schedule New
              </button>
            </Card>
          </div>
        </div>

        {/* Mentee Progress and Shared Resources Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Mentee Progress */}
          <div className="lg:col-span-2">
            {/* Mentee Progress Header */}
            <div className="flex items-center justify-between mb-6 px-6">
              <h2 className="text-xl font-bold text-gray-900">Mentee Progress</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                View All Mentees
                <span>→</span>
              </button>
            </div>

            <Card className="p-6">
              {/* Progress Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase">Mentee</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase">Current Goal</th>
                      <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 uppercase">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Maya Lin */}
                    <tr className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                            M
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Maya Lin</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Career Transition
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-sm text-gray-600">2 days ago</span>
                      </td>
                    </tr>

                    {/* Liam Scott */}
                    <tr className="border-b border-gray-100 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                            L
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Liam Scott</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          Portfolio Build
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-sm text-gray-600">5 days ago</span>
                      </td>
                    </tr>

                    {/* David Chen */}
                    <tr className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold text-sm">
                            DC
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">David Chen</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                          Networking
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-sm text-gray-600">1 week ago</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Shared Resources and Mentor Tips */}
          <div className="lg:col-span-1 space-y-6">
            {/* Shared Resources */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Shared Resources</h3>
                <span className="text-sm text-blue-600 font-medium">4 Files</span>
              </div>

              <div className="space-y-3">
                {/* File 1 */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="p-2 bg-red-100 rounded">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Interview_Prep_Guide.pdf</p>
                    <p className="text-xs text-gray-500">Shared today</p>
                  </div>
                </div>

                {/* File 2 */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="p-2 bg-blue-100 rounded">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">Product_Case_Study.docx</p>
                    <p className="text-xs text-gray-500">Shared 2 days ago</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium border border-gray-200 rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <span>↓</span>
                Share New Resource
              </button>
            </Card>

            {/* Mentor Tips */}
            <Card className="p-6 bg-gray-900 text-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-400 text-xl">💡</span>
                <h3 className="font-semibold">Mentor Tips</h3>
              </div>
              <p className="text-sm text-gray-300">
                Not sure how to handle a difficult conversation?
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorshipDashboard;
