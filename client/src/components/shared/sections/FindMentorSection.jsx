import React, { useState, useEffect } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Select } from '../../ui/select';
import { Search, Calendar, Video, Clock, CheckCircle, XCircle, MessageSquare, FileText, Upload, Lightbulb } from 'lucide-react';
import { mentorshipAPI } from '../../../services/api';
import { useAuth } from '../../../contexts/auth';
import LoadingSpinner from '../../ui/LoadingSpinner';

const FindMentorSection = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('find');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [requestingMentorId, setRequestingMentorId] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  
  // Fetch mentors on component mount and when user changes
  useEffect(() => {
    fetchMentors();
  }, [user]);
  
  const fetchMentors = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Add current user ID to filters to exclude mentors with existing requests
      const filtersWithUser = {
        ...filters,
        currentUserId: user?.id
      };
      
      const result = await mentorshipAPI.getAllMentors(filtersWithUser);
      
      if (result.success) {
        setMentors(result.data);
      } else {
        setError(result.error || 'Failed to fetch mentors');
        setMentors([]);
      }
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setError('An error occurred while fetching mentors');
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search and filter
  const handleSearch = () => {
    const filters = {};
    if (searchQuery) filters.search = searchQuery;
    if (expertiseFilter) filters.expertise = expertiseFilter;
    if (topicFilter) filters.topic = topicFilter;
    
    fetchMentors(filters);
  };
  
  const handleRequestMentorship = async (mentorId, mentorName) => {
    if (!user || !user.id) {
      alert('Please log in to request mentorship');
      return;
    }
    
    // Find the mentor from the mentors array to get their topics
    const mentor = mentors.find(m => m.userId === mentorId);
    setSelectedMentor({ 
      id: mentorId, 
      name: mentorName,
      topics: mentor ? [...(mentor.selectedTopics || []), ...(mentor.otherTopics || [])] : []
    });
    setShowMessageModal(true);
  };
  
  const submitMentorshipRequest = async () => {
    if (!selectedTopic) {
      alert('Please select a topic for mentorship');
      return;
    }
    
    if (!requestMessage.trim()) {
      alert('Please enter a message to the mentor');
      return;
    }
    
    try {
      setRequestingMentorId(selectedMentor.id);
      
      const requestData = {
        menteeId: user.id,
        mentorId: selectedMentor.id,
        topic: selectedTopic,
        message: requestMessage
      };
      
      const result = await mentorshipAPI.createRequest(requestData);
      
      if (result.success) {
        alert(`Mentorship request sent successfully to ${selectedMentor.name}!`);
        setShowMessageModal(false);
        setRequestMessage('');
        setSelectedTopic('');
        setSelectedMentor(null);
      } else {
        alert(result.error || 'Failed to send mentorship request');
      }
    } catch (err) {
      console.error('Error sending mentorship request:', err);
      alert('An error occurred while sending your request');
    } finally {
      setRequestingMentorId(null);
    }
  };

  // Mock mentors data for mentee view
  const myMentors = [
    {
      id: 1,
      name: 'Karma Tshering',
      myGoal: 'Career Transition',
      progress: 75,
      nextSession: 'Jan 15, 2026',
      avatar: null
    },
    {
      id: 2,
      name: 'Sonam Dorji',
      myGoal: 'Portfolio Build',
      progress: 40,
      nextSession: 'Jan 18, 2026',
      avatar: null
    },
    {
      id: 3,
      name: 'Pema Choden',
      myGoal: 'Networking',
      progress: 15,
      nextSession: 'Jan 22, 2026',
      avatar: null
    }
  ];

  // Mock shared resources
  const upcomingSessions = [
    {
      id: 1,
      title: 'Career Sync w/ Sarah J.',
      date: 'TODAY',
      day: '24',
      time: '2:00 PM - 2:30 PM'
    },
    {
      id: 2,
      title: 'Resume Review',
      date: 'NOV',
      day: '02',
      time: '10:00 AM - 10:30 AM'
    },
    {
      id: 3,
      title: 'Interview Prep',
      date: 'NOV',
      day: '05',
      time: '3:00 PM - 3:45 PM'
    },
    {
      id: 4,
      title: 'Career Planning',
      date: 'NOV',
      day: '08',
      time: '1:00 PM - 1:30 PM'
    },
    {
      id: 5,
      title: 'Project Discussion',
      date: 'NOV',
      day: '10',
      time: '4:00 PM - 4:30 PM'
    }
  ];

  const getGoalColor = (goal) => {
    const colors = {
      'Career Transition': 'bg-green-100 text-green-700',
      'Portfolio Build': 'bg-blue-100 text-blue-700',
      'Networking': 'bg-yellow-100 text-yellow-700'
    };
    return colors[goal] || 'bg-gray-100 text-gray-700';
  };

  const getProgressColor = (progress) => {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 40) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Tabs */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Find a Mentor</h1>
            <p className="text-gray-600">Connect with alumni who can help guide your career path.</p>
          </div>
          
          {/* Tabs for navigation */}
          <div className="flex gap-1">
            <button 
              onClick={() => setActiveTab('find')}
              className={`px-6 py-2 text-sm font-medium ${activeTab === 'find' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Find a Mentor
            </button>
            <button 
              onClick={() => setActiveTab('sessions')}
              className={`px-6 py-2 text-sm font-medium ${activeTab === 'sessions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              My Sessions
            </button>
          </div>
        </div>

        {activeTab === 'find' ? (
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Search and Filters */}
              <div className="mb-6 flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by name, headline, or bio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
              
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              )}
              
              {/* Error State */}
              {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
              
              {/* Empty State */}
              {!loading && !error && mentors.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No mentors found. Try adjusting your search or filters.</p>
                </div>
              )}

              {/* Mentor Grid */}
              {!loading && !error && mentors.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mentors.map((mentor) => (
                    <Card key={mentor.userId} className="p-6 hover:shadow-lg transition-shadow flex flex-col">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                          {mentor.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{mentor.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{mentor.professionalHeadline}</p>
                        </div>
                      </div>

                      {/* Expertise Section */}
                      {mentor.expertise && mentor.expertise.length > 0 && (
                        <div className="mb-1.5">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Expertise</p>
                          <div className="flex flex-wrap gap-2">
                            {mentor.expertise.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {mentor.expertise.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{mentor.expertise.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Topics Section */}
                      {mentor.selectedTopics && mentor.selectedTopics.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Topics</p>
                          <div className="flex flex-wrap gap-2">
                            {mentor.selectedTopics.slice(0, 3).map((topic, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium"
                              >
                                {topic}
                              </span>
                            ))}
                            {mentor.selectedTopics.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{mentor.selectedTopics.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <Button 
                        onClick={() => handleRequestMentorship(mentor.userId, mentor.name)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-auto"
                        disabled={!mentor.openForBookings || requestingMentorId === mentor.userId}
                      >
                        {requestingMentorId === mentor.userId ? 'Sending...' : 
                         mentor.openForBookings ? 'Request Mentorship' : 'Not Available'}
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-6">
            {/* Left Section - My Mentors */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl font-bold text-gray-900">My Mentors</h2>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  View All →
                </a>
              </div>
              
              <Card className="bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Mentor</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">My Goal</th>
                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Next Session</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myMentors.map((mentor) => (
                        <tr key={mentor.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                                {mentor.name.charAt(0)}
                              </div>
                              <span className="font-medium text-gray-900">{mentor.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getGoalColor(mentor.myGoal)}`}>
                              {mentor.myGoal}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600">{mentor.nextSession}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Right Section - Your Schedule & Tips */}
            <div className="w-96 space-y-6">
              {/* Your Schedule */}
              <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-white">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-yellow-500" />
                      <h3 className="text-lg font-bold">Upcoming session</h3>
                    </div>
                    <a href="#" className="text-sm text-blue-400 hover:text-blue-300 font-medium">View All</a>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="bg-gray-700/50 rounded-lg p-4 border-l-4 border-yellow-500 hover:bg-gray-700/70 transition-colors">
                        <div className="flex gap-3">
                          <div className="text-center flex-shrink-0">
                            <div className="text-xs text-gray-400 font-medium mb-1">{session.date}</div>
                            <div className="text-2xl font-bold">{session.day}</div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-white mb-1">{session.title}</p>
                            <div className="flex items-center gap-1 text-xs text-blue-400">
                              <Clock className="w-3 h-3" />
                              {session.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="w-full py-3 bg-gray-700/50 hover:bg-gray-700 text-blue-400 rounded-lg font-medium transition-colors border border-gray-600">
                    Request New Session
                  </button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Request Mentorship from {selectedMentor?.name}
            </h3>
            
            {/* Topic Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Topic <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a topic...</option>
                {selectedMentor?.topics && selectedMentor.topics.length > 0 ? (
                  selectedMentor.topics.map((topic, index) => (
                    <option key={index} value={topic}>
                      {topic}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No topics available</option>
                )}
              </select>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Introduce yourself and explain what you'd like to learn or discuss with this mentor.
            </p>
            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              placeholder="Hi! I'm interested in learning about..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="5"
            />
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setShowMessageModal(false);
                  setRequestMessage('');
                  setSelectedTopic('');
                  setSelectedMentor(null);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={submitMentorshipRequest}
                disabled={!selectedTopic || !requestMessage.trim() || requestingMentorId}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {requestingMentorId ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindMentorSection;
