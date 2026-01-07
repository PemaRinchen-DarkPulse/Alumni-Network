import React, { useState } from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Select } from '../../ui/select';
import { Search, Calendar, Video, Clock, CheckCircle, XCircle, MessageSquare, FileText, Upload, Lightbulb } from 'lucide-react';

const FindMentorSection = () => {
  const [activeTab, setActiveTab] = useState('find');
  
  // Mock mentor data
  const mentors = [
    {
      id: 1,
      name: 'Karma Tshering',
      title: 'Senior PM at TechCorp',
      expertise: ['Product Mgmt', 'Leadership'],
      available: true,
      avatar: null
    },
    {
      id: 2,
      name: 'Sonam Dorji',
      title: 'VP of Engineering at StartUp.io',
      expertise: ['Software Eng', 'Scalability', 'React'],
      available: false,
      avatar: null
    },
    {
      id: 3,
      name: 'Pema Choden',
      title: 'Marketing Director at Global Brand',
      expertise: ['Marketing', 'Brand Strategy'],
      available: false,
      avatar: null
    },
    {
      id: 4,
      name: 'Tashi Wangmo',
      title: 'Founder & CEO at Innovate',
      expertise: ['Entrepreneurship', 'Fundraising'],
      available: true,
      avatar: null
    },
    {
      id: 5,
      name: 'Ugyen Tenzin',
      title: 'Data Scientist at DataFlow',
      expertise: ['Python', 'Machine Learning'],
      available: false,
      avatar: null
    },
    {
      id: 6,
      name: 'Kinley Wangchuk',
      title: 'UX Researcher at DesignCo',
      expertise: ['User Research', 'Figma'],
      available: false,
      avatar: null
    }
  ];

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
              {/* Mentor Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mentors.map((mentor) => (
                  <Card key={mentor.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                        {mentor.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{mentor.name}</h3>
                        <p className="text-sm text-gray-600">{mentor.title}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {mentor.expertise.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Request Mentorship
                    </Button>
                  </Card>
                ))}
              </div>
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
    </div>
  );
};

export default FindMentorSection;
