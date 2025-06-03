import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth';

const ActivitySection = () => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [activityHistory, setActivityHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activitiesPerPage] = useState(5);
  
  // Fetch activity history
  useEffect(() => {
    const fetchActivityHistory = async () => {
      setLoading(true);
      setError(null);
        try {
        // In a real app, fetch from API        // Get current date to generate relative dates for mock activities
        const currentDate = new Date();
        
        // Base set of activities applicable to all users
        let mockActivities = [
          {
            id: '1',
            type: 'event',
            title: 'Annual Alumni Meetup 2025',
            date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 3).toISOString(),
            status: 'attended',
            link: '/dashboard/events/annual-meetup'
          },
          {
            id: '5',
            type: 'event',
            title: 'Virtual Networking Event',
            date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 15).toISOString(),
            status: 'registered',
            link: '/dashboard/events/virtual-networking'
          },
          {
            id: '6',
            type: 'profile',
            title: 'Updated Profile Information',
            date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 10).toISOString(),
            link: '/profile'
          }
        ];
        
        // Add role-specific activities
        if (user) {
          if (user.role === 'alumni') {
            // Alumni-specific activities
            mockActivities = [
              ...mockActivities,
              {
                id: '2',
                type: 'mentorship',
                title: 'Mentorship Session with Jane Smith',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7).toISOString(),
                status: 'completed',
                link: '/dashboard/mentorship/sessions/jane-smith'
              },
              {
                id: '3',
                type: 'post',
                title: 'Posted "Career Opportunities in Tech"',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 14).toISOString(),
                link: '/dashboard/blog/career-opportunities'
              },
              {
                id: '7',
                type: 'mentorship',
                title: 'New Mentorship Request from Alex Johnson',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1).toISOString(),
                status: 'pending',
                link: '/dashboard/mentorship/requests/alex-johnson'
              }
            ];
            
            // If user is a mentor, add mentor-specific activities
            if (user.isMentor) {
              mockActivities.push({
                id: '8',
                type: 'mentorship',
                title: 'Upcoming Mentorship Session with Michael Brown',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 2).toISOString(),
                status: 'scheduled',
                link: '/dashboard/mentorship/sessions/michael-brown'
              });
            }
          } else if (user.role === 'student') {
            // Student-specific activities
            mockActivities = [
              ...mockActivities,
              {
                id: '9',
                type: 'mentorship',
                title: 'Sent Mentorship Request to James Wilson',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 5).toISOString(),
                status: 'pending',
                link: '/dashboard/mentorship/requests/james-wilson'
              },
              {
                id: '10',
                type: 'comment',
                title: 'Commented on "Internship Opportunities"',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 2).toISOString(),
                link: '/dashboard/forum/internship-opportunities'
              }
            ];
          } else if (user.role === 'teacher') {
            // Teacher-specific activities
            mockActivities = [
              ...mockActivities,
              {
                id: '11',
                type: 'event',
                title: 'Created "Annual Teacher-Alumni Meet"',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 8).toISOString(),
                status: 'organizing',
                link: '/dashboard/events/teacher-alumni-meet'
              },
              {
                id: '12',
                type: 'comment',
                title: 'Commented on "Teaching Methodologies Discussion"',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 4).toISOString(),
                link: '/dashboard/forum/teaching-methodologies'
              },
              {
                id: '4',
                type: 'comment',
                title: 'Commented on "Alumni Reunion Plans"',
                date: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 20).toISOString(),
                link: '/dashboard/forum/alumni-reunion'
              }
            ];
          }
        }
        
        // Sort by date (newest first)
        mockActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setActivityHistory(mockActivities);
      } catch (err) {
        setError('Failed to load activity history');
        console.error('Error fetching activity history:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivityHistory();
  }, [user]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
    // Get icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'event':
        return (
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        );
      case 'mentorship':
        return (
          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
        );
      case 'post':
        return (
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-400">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        );
      case 'profile':
        return (
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600 dark:text-indigo-400">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-400">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
        );
    }
  };
    // Get status badge
  const getStatusBadge = (status) => {
    if (!status) return null;
    
    let bgColor = '';
    let textColor = '';
    
    switch (status) {
      case 'attended':
        bgColor = 'bg-green-100 dark:bg-green-900/30';
        textColor = 'text-green-800 dark:text-green-200';
        break;
      case 'registered':
        bgColor = 'bg-blue-100 dark:bg-blue-900/30';
        textColor = 'text-blue-800 dark:text-blue-200';
        break;
      case 'completed':
        bgColor = 'bg-purple-100 dark:bg-purple-900/30';
        textColor = 'text-purple-800 dark:text-purple-200';
        break;
      case 'pending':
        bgColor = 'bg-amber-100 dark:bg-amber-900/30';
        textColor = 'text-amber-800 dark:text-amber-200';
        break;
      case 'scheduled':
        bgColor = 'bg-indigo-100 dark:bg-indigo-900/30';
        textColor = 'text-indigo-800 dark:text-indigo-200';
        break;
      case 'organizing':
        bgColor = 'bg-pink-100 dark:bg-pink-900/30';
        textColor = 'text-pink-800 dark:text-pink-200';
        break;
      default:
        bgColor = 'bg-gray-100 dark:bg-gray-800';
        textColor = 'text-gray-800 dark:text-gray-200';
    }
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
        <CardDescription>
          Your recent activities and contributions on the Alumni Network
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-sm text-muted-foreground">Loading activity history...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-md text-red-800 dark:text-red-200">
            <p>{error}</p>
          </div>
        ) : activityHistory.length === 0 ? (
          <div className="bg-muted/30 p-6 rounded-md text-center">
            <p className="text-sm text-muted-foreground">No activity history yet.</p>
            <p className="text-sm mt-2">
              Participate in events, mentorship, discussions, or create posts to see your activity here.
            </p>
          </div>        ) : (
          <div className="space-y-6">
            {/* Activity Timeline */}
            <div className="relative pl-8 border-l border-border">
              {activityHistory
                .slice((currentPage - 1) * activitiesPerPage, currentPage * activitiesPerPage)
                .map((activity) => (
                <div key={activity.id} className="mb-6 relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-10 top-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="mb-1 flex items-center gap-2">
                    {activity.link ? (
                      <a 
                        href={activity.link} 
                        className="text-sm font-medium hover:text-primary hover:underline"
                      >
                        {activity.title}
                      </a>
                    ) : (
                      <h3 className="text-sm font-medium">{activity.title}</h3>
                    )}
                    {activity.status && getStatusBadge(activity.status)}
                  </div>
                  
                  <div className="flex justify-between">
                    <time dateTime={activity.date} className="text-xs text-muted-foreground">
                      {formatDate(activity.date)}
                    </time>
                    
                    {activity.link && (
                      <a 
                        href={activity.link}
                        className="text-xs text-primary hover:underline"
                      >
                        View details
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {activityHistory.length > activitiesPerPage && (
              <div className="flex items-center justify-center space-x-2 pt-4 mt-4 border-t border-border">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md hover:bg-muted ${
                    currentPage === 1 ? 'text-muted-foreground cursor-not-allowed' : 'text-foreground'
                  }`}
                  aria-label="Previous page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                
                <div className="text-sm">
                  Page {currentPage} of {Math.ceil(activityHistory.length / activitiesPerPage)}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(activityHistory.length / activitiesPerPage)))}
                  disabled={currentPage >= Math.ceil(activityHistory.length / activitiesPerPage)}
                  className={`p-2 rounded-md hover:bg-muted ${
                    currentPage >= Math.ceil(activityHistory.length / activitiesPerPage) 
                      ? 'text-muted-foreground cursor-not-allowed' 
                      : 'text-foreground'
                  }`}
                  aria-label="Next page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivitySection;
