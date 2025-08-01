import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SectionLoadingSpinner } from '@/components/ui/LoadingSpinner';

// Animations and variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

// Role-specific themes
const themeColors = {
  teacher: {
    primary: "bg-emerald-500",
    secondary: "bg-emerald-100",
    gradient: "from-emerald-500 to-emerald-700",
    hover: "hover:bg-emerald-600",
    text: "text-emerald-800",
    border: "border-emerald-200",
    card: "bg-white/90 hover:bg-white/100 border-emerald-100"
  },
  alumni: {
    primary: "bg-indigo-600", 
    secondary: "bg-indigo-100",
    gradient: "from-indigo-500 to-indigo-800",
    hover: "hover:bg-indigo-700",
    text: "text-indigo-800",
    border: "border-indigo-200",
    card: "bg-white/90 hover:bg-white/100 border-indigo-100"
  },
  student: {
    primary: "bg-sky-500",
    secondary: "bg-sky-100",
    gradient: "from-sky-400 to-sky-600",
    hover: "hover:bg-sky-600",
    text: "text-sky-800",
    border: "border-sky-200",
    card: "bg-white/90 hover:bg-white/100 border-sky-100"
  }
};

// Sample quotes per role
const quotes = {
  teacher: "Inspiring minds, shaping futures.",
  alumni: "Experience shared is wisdom gained.",
  student: "Today a learner, tomorrow a leader."
};

const DashboardSection = () => {
  const { user } = useAuth();
  const role = user?.role || 'student';
  const theme = themeColors[role];
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data - would be fetched from API in a real implementation
  const mockData = {
    teacher: {
      stats: [
        { label: "Students Taught", value: 120, icon: "👨‍🎓" },
        { label: "Posts Published", value: 24, icon: "📝" },
        { label: "Upcoming Sessions", value: 3, icon: "📅" },
      ],
      quickActions: [
        { label: "Create Blog Post", icon: "✏️" },
        { label: "View Students", icon: "👥" },
        { label: "Schedule Session", icon: "🗓️" },
      ],
      notifications: [
        { text: "New comment on your post 'Modern Teaching Methods'", time: "2h ago" },
        { text: "Student Alex submitted their assignment", time: "5h ago" },
        { text: "Faculty meeting tomorrow at 3:00 PM", time: "1d ago" },
      ]
    },
    alumni: {
      stats: [
        { label: "Posts Shared", value: 18, icon: "📊" },
        { label: "Alumni Connected", value: 42, icon: "🔗" },
        { label: "Connection Requests", value: 7, icon: "📨" },
      ],
      quickActions: [
        { label: "Write Blog Post", icon: "✏️" },
        { label: "View Alumni", icon: "👥" },
        { label: "Join Mentoring", icon: "🤝" },
      ],
      notifications: [
        { text: "Sophia wants to connect with you", time: "1h ago" },
        { text: "New event: Alumni Meetup 2025", time: "3h ago" },
        { text: "Your post received 15 new likes", time: "1d ago" },
      ]
    },
    student: {
      stats: [
        { label: "Posts Read", value: 56, icon: "📚" },
        { label: "Comments Made", value: 13, icon: "💬" },
        { label: "Sessions Joined", value: 7, icon: "👨‍🏫" },
      ],
      quickActions: [
        { label: "Explore Posts", icon: "🔍" },
        { label: "Join Session", icon: "📅" },
        { label: "Find Mentors", icon: "🧠" },
      ],
      notifications: [
        { text: "New post from your mentor Dr. Roberts", time: "30m ago" },
        { text: "Upcoming Live Session: Web Development", time: "2h ago" },
        { text: "Your comment received a reply", time: "6h ago" },
      ]
    }
  };
  
  const userData = mockData[role] || mockData.student;
  
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return <SectionLoadingSpinner section="dashboard" />;
  }
  
  return (
    <motion.div 
      className="px-1 py-6 md:px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Header with role-based styling */}
      <motion.div 
        variants={itemVariants} 
        className={`mb-6 overflow-hidden rounded-xl bg-gradient-to-r ${theme.gradient} p-6 text-white shadow-lg backdrop-blur-sm`}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 border-2 border-white/30">
              {user?.profilePicture ? (
                <AvatarImage src={user.profilePicture} alt={user.name} />
              ) : (
                <AvatarFallback className="bg-white/20 text-lg text-white">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Welcome, {user?.name || 'User'}!
              </h1>
              <p className="text-white/80">
                {quotes[role] || quotes.student}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-white/10 text-white hover:bg-white/20">View Profile</Button>
            <Button className="bg-white/20 text-white hover:bg-white/30">
              {role === 'teacher' ? 'Create Post' : 
               role === 'alumni' ? 'Connect' : 'Explore'}
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Stats Cards */}
      <motion.div 
        variants={itemVariants}
        className="mb-8 grid gap-4 md:grid-cols-3"
      >
        {userData.stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`rounded-xl ${theme.card} border p-4 shadow-sm transition-all duration-200`}
          >
            <div className="flex items-center gap-4">
              <div className={`flex size-12 items-center justify-center rounded-lg ${theme.secondary} text-2xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="md:col-span-1">
          <Card className={`border ${theme.border} shadow-sm`}>
            <CardHeader>
              <CardTitle className={`${theme.text}`}>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {userData.quickActions.map((action, index) => (
                <Button 
                  key={index}
                  className={`justify-start gap-2 bg-transparent text-left text-gray-700 hover:${theme.secondary} hover:text-gray-900`}
                >
                  <span className="text-lg">{action.icon}</span>
                  <span>{action.label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Main Activity Section - Role Specific */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className={`border ${theme.border} shadow-sm`}>
            <CardHeader>
              <CardTitle className={`${theme.text}`}>
                {role === 'teacher' ? 'Student Engagement' :
                 role === 'alumni' ? 'Network Activity' :
                 'Learning Progress'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Teacher: Simple analytics chart (mocked with div bars) */}
              {role === 'teacher' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Student Participation</span>
                      <span>78%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div className={`h-2 w-[78%] rounded-full ${theme.primary}`}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Assignment Completion</span>
                      <span>64%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div className={`h-2 w-[64%] rounded-full ${theme.primary}`}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Content Engagement</span>
                      <span>92%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div className={`h-2 w-[92%] rounded-full ${theme.primary}`}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Alumni: Recent connections */}
              {role === 'alumni' && (
                <div className="space-y-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Avatar key={i} className="border-2 border-white">
                        <AvatarFallback className={`${theme.secondary} ${theme.text}`}>
                          {String.fromCharCode(64 + i)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    <div className={`flex size-8 items-center justify-center rounded-full ${theme.secondary} ${theme.text}`}>
                      +12
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className={`rounded-lg ${theme.secondary} p-3 text-center`}>
                      <p className="text-sm font-medium">Industry Connections</p>
                      <p className={`text-xl font-bold ${theme.text}`}>16</p>
                    </div>
                    <div className={`rounded-lg ${theme.secondary} p-3 text-center`}>
                      <p className="text-sm font-medium">Events Attended</p>
                      <p className={`text-xl font-bold ${theme.text}`}>8</p>
                    </div>
                    <div className={`rounded-lg ${theme.secondary} p-3 text-center`}>
                      <p className="text-sm font-medium">Mentorships</p>
                      <p className={`text-xl font-bold ${theme.text}`}>3</p>
                    </div>
                    <div className={`rounded-lg ${theme.secondary} p-3 text-center`}>
                      <p className="text-sm font-medium">Skills Shared</p>
                      <p className={`text-xl font-bold ${theme.text}`}>12</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Student: Suggested content and teachers */}
              {role === 'student' && (
                <div className="space-y-4">
                  <p className="font-medium">Suggested Mentors</p>
                  <div className="space-y-2">
                    {[
                      { name: "Dr. Sarah Johnson", expertise: "Data Science", avatar: "S" },
                      { name: "Prof. Michael Chen", expertise: "Web Development", avatar: "M" },
                      { name: "Dr. Emily Patel", expertise: "AI & Machine Learning", avatar: "E" }
                    ].map((mentor, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className={`${theme.primary} text-white`}>{mentor.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{mentor.name}</p>
                            <p className="text-sm text-gray-500">{mentor.expertise}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className={`border-${theme.border}`}>View</Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button className={`${theme.primary} text-white ${theme.hover} w-full`}>
                {role === 'teacher' ? 'View Detailed Analytics' : 
                 role === 'alumni' ? 'Expand Your Network' : 
                 'Explore More Learning Paths'}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        {/* Notifications Panel */}
        <motion.div variants={itemVariants} className="md:col-span-3">
          <Card className={`border ${theme.border} shadow-sm`}>
            <CardHeader>
              <CardTitle className={`${theme.text}`}>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {userData.notifications.map((notification, index) => (
                  <div key={index} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className={`size-2 rounded-full ${theme.primary}`}></div>
                      <p>{notification.text}</p>
                    </div>
                    <span className="text-sm text-gray-500">{notification.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="link" className={theme.text}>View All Notifications</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardSection;