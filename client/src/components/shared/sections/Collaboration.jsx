import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Icon } from '@/components/shared/icons/Icon';
import { useAuth } from '@/contexts/auth';
import { format } from 'date-fns';

// Animation variants
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

// Mock data - replace with API calls
const mockEvents = [
  {
    id: 1,
    title: "AI in Software Development: Industry Trends",
    date: new Date('2025-08-15T14:00:00'),
    host: {
      name: "Dr. Sarah Chen",
      role: "Senior Software Engineer",
      company: "Google",
      avatar: null
    },
    description: "Join us for an insightful discussion on how AI is transforming the software development landscape, featuring real-world applications and future trends.",
    status: "upcoming", // live, upcoming, ended
    attendees: 142,
    type: "webinar",
    tags: ["AI", "Software Development", "Technology"]
  },
  {
    id: 2,
    title: "Career Transition: From Student to Professional",
    date: new Date('2025-08-10T16:30:00'),
    host: {
      name: "Michael Rodriguez",
      role: "Product Manager",
      company: "Microsoft",
      avatar: null
    },
    description: "Learn practical tips and strategies for making a smooth transition from academic life to professional career.",
    status: "live",
    attendees: 89,
    type: "guest_lecture",
    tags: ["Career", "Professional Development"]
  },
  {
    id: 3,
    title: "Entrepreneurship Masterclass",
    date: new Date('2025-07-28T10:00:00'),
    host: {
      name: "Emily Johnson",
      role: "Founder & CEO",
      company: "TechStart Inc.",
      avatar: null
    },
    description: "A comprehensive guide to starting your own tech company, covering funding, team building, and market validation.",
    status: "ended",
    attendees: 256,
    type: "masterclass",
    tags: ["Entrepreneurship", "Business", "Startup"]
  }
];

const mockProjects = [
  {
    id: 1,
    title: "Smart Campus Navigation App",
    description: "Developing an AR-powered mobile app to help students navigate campus buildings and find facilities.",
    leader: {
      name: "Alex Thompson",
      role: "Computer Science Student",
      avatar: null
    },
    members: [
      { name: "Jessica Park", role: "UI/UX Designer" },
      { name: "David Kim", role: "Mobile Developer" },
      { name: "Prof. Maria Santos", role: "Faculty Advisor" }
    ],
    mentor: {
      name: "James Wilson",
      role: "Senior Mobile Developer",
      company: "Uber"
    },
    status: "active",
    progress: 65,
    domain: "Mobile Development",
    teamSize: "4/5",
    deadline: new Date('2025-09-15'),
    tags: ["React Native", "AR", "Firebase"]
  },
  {
    id: 2,
    title: "Sustainable Energy Analytics Platform",
    description: "Building a data analytics platform to track and optimize renewable energy consumption across campus.",
    leader: {
      name: "Priya Sharma",
      role: "Environmental Engineering Student",
      avatar: null
    },
    members: [
      { name: "Carlos Rodriguez", role: "Data Scientist" },
      { name: "Dr. Lisa Chang", role: "Faculty Supervisor" }
    ],
    mentor: {
      name: "Robert Chen",
      role: "Data Analytics Lead",
      company: "Tesla"
    },
    status: "recruiting",
    progress: 25,
    domain: "Data Science",
    teamSize: "3/6",
    deadline: new Date('2025-10-30'),
    tags: ["Python", "Machine Learning", "IoT"]
  }
];

const mockStories = [
  {
    id: 1,
    title: "From Intern to Tech Lead: My 5-Year Journey",
    author: {
      name: "Jennifer Liu",
      role: "Tech Lead",
      company: "Apple",
      graduationYear: 2018,
      avatar: null
    },
    excerpt: "Starting as a nervous intern, I never imagined I'd be leading a team of 12 engineers working on cutting-edge iOS features. Here's what I learned along the way...",
    content: "Starting as a nervous intern, I never imagined I'd be leading a team of 12 engineers working on cutting-edge iOS features...",
    publishedAt: new Date('2025-07-25'),
    tags: ["Career Growth", "Leadership", "iOS Development"],
    likes: 234,
    comments: 67,
    bookmarks: 89,
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "Breaking into Data Science Without a CS Degree",
    author: {
      name: "Marcus Johnson",
      role: "Senior Data Scientist",
      company: "Netflix",
      graduationYear: 2019,
      avatar: null
    },
    excerpt: "With a background in Biology, transitioning to Data Science seemed impossible. Here's how I made it happen and what resources helped me the most...",
    content: "With a background in Biology, transitioning to Data Science seemed impossible...",
    publishedAt: new Date('2025-07-20'),
    tags: ["Career Change", "Data Science", "Self-Learning"],
    likes: 312,
    comments: 45,
    bookmarks: 156,
    readTime: "12 min read"
  },
  {
    id: 3,
    title: "Building a Startup While Working Full-Time",
    author: {
      name: "Rachel Kim",
      role: "Founder",
      company: "EduTech Solutions",
      graduationYear: 2017,
      avatar: null
    },
    excerpt: "Balancing a demanding job while building a startup required strict time management and clear priorities. Here's my playbook for side-hustle success...",
    content: "Balancing a demanding job while building a startup required strict time management...",
    publishedAt: new Date('2025-07-18'),
    tags: ["Entrepreneurship", "Time Management", "EdTech"],
    likes: 187,
    comments: 32,
    bookmarks: 91,
    readTime: "10 min read"
  }
];

// Event Card Component
const EventCard = ({ event }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const getStatusBadge = (status) => {
    const badges = {
      live: { color: "bg-red-500", text: "🔴 LIVE", pulse: true },
      upcoming: { color: "bg-blue-500", text: "📅 Upcoming", pulse: false },
      ended: { color: "bg-gray-500", text: "⏰ Ended", pulse: false }
    };
    
    const badge = badges[status] || badges.upcoming;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${badge.color} ${badge.pulse ? 'animate-pulse' : ''}`}>
        {badge.text}
      </span>
    );
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    // Simulate API call
    setTimeout(() => {
      setIsRegistered(true);
      setIsRegistering(false);
    }, 1000);
  };

  const handleJoin = () => {
    // Handle joining live event
    window.open(`/events/${event.id}/join`, '_blank');
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          {getStatusBadge(event.status)}
          <div className="flex items-center text-sm text-gray-500">
            <Icon name="users" size={16} className="mr-1" />
            {event.attendees}
          </div>
        </div>
        <CardTitle className="text-lg font-bold line-clamp-2">{event.title}</CardTitle>
        <CardDescription className="flex items-center text-sm text-gray-600">
          <Icon name="calendar" size={16} className="mr-2" />
          {format(event.date, 'MMM d, yyyy')} at {format(event.date, 'h:mm a')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex items-center mb-3">
          <Avatar className="h-8 w-8 mr-3">
            {event.host.avatar ? (
              <AvatarImage src={event.host.avatar} alt={event.host.name} />
            ) : (
              <AvatarFallback>{event.host.name.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="text-sm font-medium">{event.host.name}</p>
            <p className="text-xs text-gray-500">{event.host.role} at {event.host.company}</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-3 mb-3">{event.description}</p>
        
        <div className="flex flex-wrap gap-1">
          {event.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {event.status === 'live' ? (
          <Button onClick={handleJoin} className="flex-1 bg-red-500 hover:bg-red-600">
            <Icon name="video" size={16} className="mr-2" />
            Join Live
          </Button>
        ) : event.status === 'upcoming' ? (
          <Button 
            onClick={handleRegister} 
            disabled={isRegistering || isRegistered}
            className="flex-1"
            variant={isRegistered ? "outline" : "default"}
          >
            {isRegistering ? (
              <>
                <Icon name="loader" size={16} className="mr-2 animate-spin" />
                Registering...
              </>
            ) : isRegistered ? (
              <>
                <Icon name="check" size={16} className="mr-2" />
                Registered
              </>
            ) : (
              "Register"
            )}
          </Button>
        ) : (
          <Button variant="outline" className="flex-1">
            <Icon name="video" size={16} className="mr-2" />
            View Recording
          </Button>
        )}
        
        <Button variant="ghost" size="icon">
          <Icon name="bookmark" size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Project Card Component
const ProjectCard = ({ project }) => {
  const [showRequestDialog, setShowRequestDialog] = useState(false);

  const getStatusBadge = (status) => {
    const badges = {
      active: { color: "bg-green-500", text: "🚀 Active" },
      recruiting: { color: "bg-orange-500", text: "👥 Recruiting" },
      completed: { color: "bg-blue-500", text: "✅ Completed" }
    };
    
    return badges[status] || badges.active;
  };

  const handleRequestGuidance = () => {
    setShowRequestDialog(true);
  };

  const handleJoinProject = () => {
    // Handle joining project
    console.log(`Joining project: ${project.title}`);
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusBadge(project.status).color}`}>
            {getStatusBadge(project.status).text}
          </span>
          <span className="text-sm text-gray-500">{project.teamSize}</span>
        </div>
        <CardTitle className="text-lg font-bold line-clamp-2">{project.title}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {project.domain} • Due {format(project.deadline, 'MMM d')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 line-clamp-3 mb-4">{project.description}</p>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-700">Progress</span>
            <span className="text-xs text-gray-500">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Team Members */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Team</p>
          <div className="space-y-1">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback className="text-xs">{project.leader.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-medium">{project.leader.name}</p>
                <p className="text-xs text-gray-500">Project Leader</p>
              </div>
            </div>
            {project.members.slice(0, 2).map((member, index) => (
              <div key={index} className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarFallback className="text-xs">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              </div>
            ))}
            {project.members.length > 2 && (
              <p className="text-xs text-gray-500 ml-8">+{project.members.length - 2} more</p>
            )}
          </div>
        </div>
        
        {/* Mentor */}
        {project.mentor && (
          <div className="bg-purple-50 p-2 rounded-lg">
            <p className="text-xs font-medium text-purple-700 mb-1">Mentor</p>
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback className="text-xs bg-purple-200">{project.mentor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-medium">{project.mentor.name}</p>
                <p className="text-xs text-gray-500">{project.mentor.role}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {project.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        {project.status === 'recruiting' ? (
          <Button onClick={handleJoinProject} className="flex-1">
            <Icon name="users" size={16} className="mr-2" />
            Join Project
          </Button>
        ) : (
          <Button variant="outline" className="flex-1">
            <Icon name="eye" size={16} className="mr-2" />
            View Details
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={handleRequestGuidance}
          className="flex-1"
        >
          <Icon name="handshake" size={16} className="mr-2" />
          Request Guidance
        </Button>
      </CardFooter>
    </Card>
  );
};

// Story Card Component
const StoryCard = ({ story }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: story.excerpt,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              {story.author.avatar ? (
                <AvatarImage src={story.author.avatar} alt={story.author.name} />
              ) : (
                <AvatarFallback>{story.author.name.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="text-sm font-medium">{story.author.name}</p>
              <p className="text-xs text-gray-500">
                {story.author.role} at {story.author.company} • Class of {story.author.graduationYear}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Icon name="more-horizontal" size={16} />
          </Button>
        </div>
        
        <CardTitle className="text-lg font-bold line-clamp-2 mb-2">{story.title}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {format(story.publishedAt, 'MMM d, yyyy')} • {story.readTime}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 line-clamp-4 mb-4">{story.excerpt}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {story.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Icon name="heart" size={14} className="mr-1" />
              {story.likes}
            </span>
            <span className="flex items-center">
              <Icon name="message-square" size={14} className="mr-1" />
              {story.comments}
            </span>
            <span className="flex items-center">
              <Icon name="bookmark" size={14} className="mr-1" />
              {story.bookmarks}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLike}
            className={`${isLiked ? 'text-red-500' : 'text-gray-500'}`}
          >
            <Icon name="heart" size={16} className={`mr-1 ${isLiked ? 'fill-current' : ''}`} />
            Like
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <Icon name="message-square" size={16} className="mr-1" />
            Comment
          </Button>
          
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Icon name="share" size={16} className="mr-1" />
            Share
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBookmark}
          className={`${isBookmarked ? 'text-blue-500' : 'text-gray-500'}`}
        >
          <Icon name="bookmark" size={16} className={`${isBookmarked ? 'fill-current' : ''}`} />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Create Event Modal Component
const CreateEventModal = ({ isOpen, onClose }) => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    type: 'webinar'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle event creation
    console.log('Creating event:', eventData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Create New Event</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="x" size={20} />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event Title</label>
              <input
                type="text"
                value={eventData.title}
                onChange={(e) => setEventData({...eventData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={eventData.date}
                  onChange={(e) => setEventData({...eventData, date: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  value={eventData.time}
                  onChange={(e) => setEventData({...eventData, time: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Event Type</label>
              <select
                value={eventData.type}
                onChange={(e) => setEventData({...eventData, type: e.target.value})}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="webinar">Webinar</option>
                <option value="guest_lecture">Guest Lecture</option>
                <option value="masterclass">Masterclass</option>
                <option value="workshop">Workshop</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={eventData.description}
                onChange={(e) => setEventData({...eventData, description: e.target.value})}
                rows="4"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">Create Event</Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Create Project Modal Component
const CreateProjectModal = ({ isOpen, onClose }) => {
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    domain: '',
    teamSize: '',
    deadline: '',
    skills: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle project creation
    console.log('Creating project:', projectData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Create New Project</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="x" size={20} />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project Title</label>
              <input
                type="text"
                value={projectData.title}
                onChange={(e) => setProjectData({...projectData, title: e.target.value})}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={projectData.description}
                onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Domain</label>
                <select
                  value={projectData.domain}
                  onChange={(e) => setProjectData({...projectData, domain: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Domain</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Design">Design</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Team Size</label>
                <input
                  type="number"
                  min="2"
                  max="10"
                  value={projectData.teamSize}
                  onChange={(e) => setProjectData({...projectData, teamSize: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                type="date"
                value={projectData.deadline}
                onChange={(e) => setProjectData({...projectData, deadline: e.target.value})}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Required Skills</label>
              <input
                type="text"
                placeholder="e.g., React, Node.js, Python"
                value={projectData.skills}
                onChange={(e) => setProjectData({...projectData, skills: e.target.value})}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">Create Project</Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Collaboration = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('events');
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter functions
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredStories = mockStories.filter(story => {
    return story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
           story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-6">
            <h1 className="text-3xl font-bold mb-2">Collaboration Hub</h1>
            <p className="text-blue-100">
              Connect, learn, and grow together through events, projects, and shared experiences
            </p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Icon name="search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, projects, or stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                {activeTab === 'events' && (
                  <>
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="ended">Ended</option>
                  </>
                )}
                {activeTab === 'projects' && (
                  <>
                    <option value="active">Active</option>
                    <option value="recruiting">Recruiting</option>
                    <option value="completed">Completed</option>
                  </>
                )}
              </select>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-6">
            {[
              { id: 'events', label: 'Events & Webinars', icon: 'calendar' },
              { id: 'projects', label: 'Project Collaboration', icon: 'handshake' },
              { id: 'stories', label: 'Success Stories', icon: 'star' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon name={tab.icon} size={20} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Events & Webinars Tab */}
        {activeTab === 'events' && (
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">📅 Events & Webinars</h2>
                <p className="text-gray-600">Join live sessions, webinars, and guest lectures</p>
              </div>
              {(user?.role === 'teacher' || user?.role === 'alumni') && (
                <Button onClick={() => setShowCreateEventModal(true)}>
                  <Icon name="plus" size={16} className="mr-2" />
                  Create Event
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <motion.div key={event.id} variants={itemVariants}>
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
            
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Icon name="calendar" size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Project Collaboration Tab */}
        {activeTab === 'projects' && (
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">🤝 Project Collaboration</h2>
                <p className="text-gray-600">Join projects, find team members, and get mentorship</p>
              </div>
              {user?.role === 'student' && (
                <Button onClick={() => setShowCreateProjectModal(true)}>
                  <Icon name="plus" size={16} className="mr-2" />
                  Create Project
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
            
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <Icon name="handshake" size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Success Stories Tab */}
        {activeTab === 'stories' && (
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">🌟 Success Stories & Career Advice</h2>
                <p className="text-gray-600">Learn from alumni experiences and career journeys</p>
              </div>
              {user?.role === 'alumni' && (
                <Button>
                  <Icon name="plus" size={16} className="mr-2" />
                  Share Your Story
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStories.map((story) => (
                <motion.div key={story.id} variants={itemVariants}>
                  <StoryCard story={story} />
                </motion.div>
              ))}
            </div>
            
            {filteredStories.length === 0 && (
              <div className="text-center py-12">
                <Icon name="star" size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No stories found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Modals */}
        <CreateEventModal 
          isOpen={showCreateEventModal} 
          onClose={() => setShowCreateEventModal(false)} 
        />
        
        <CreateProjectModal 
          isOpen={showCreateProjectModal} 
          onClose={() => setShowCreateProjectModal(false)} 
        />
      </div>
    </motion.div>
  );
};

export default Collaboration;