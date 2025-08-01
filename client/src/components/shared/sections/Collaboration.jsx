import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Icon } from '@/components/shared/icons/Icon';
import { InlineSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/auth';
import { format } from 'date-fns';
import SectionHero from '@/components/shared/layout/SectionHero';

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

// Mock user projects
const mockUserProjects = [
  {
    id: 3,
    title: "E-commerce Mobile App",
    description: "Building a complete e-commerce solution with React Native and Node.js backend.",
    leader: {
      name: "Current User", // This would be the logged-in user
      role: "Computer Science Student",
      avatar: null
    },
    members: [
      { name: "Sarah Wilson", role: "Frontend Developer" },
      { name: "Mike Chen", role: "Backend Developer" }
    ],
    mentor: {
      name: "Lisa Anderson",
      role: "Senior Full Stack Developer",
      company: "Amazon"
    },
    status: "active",
    progress: 80,
    domain: "Web Development",
    teamSize: "3/4",
    deadline: new Date('2025-08-30'),
    tags: ["React Native", "Node.js", "MongoDB"]
  },
  {
    id: 4,
    title: "Machine Learning Study Assistant",
    description: "AI-powered study assistant that helps students with personalized learning recommendations.",
    leader: {
      name: "Current User",
      role: "Data Science Student",
      avatar: null
    },
    members: [
      { name: "Tom Rodriguez", role: "ML Engineer" }
    ],
    mentor: null,
    status: "recruiting",
    progress: 30,
    domain: "AI/ML",
    teamSize: "2/5",
    deadline: new Date('2025-12-15'),
    tags: ["Python", "TensorFlow", "NLP"]
  }
];

// Mock collaboration invitations
const mockInvitations = [
  {
    id: 1,
    type: "project_invitation",
    project: {
      title: "Smart Campus Navigation App",
      leader: "Alex Thompson",
      domain: "Mobile Development"
    },
    role: "UI/UX Designer",
    message: "We'd love to have you join our team as a UI/UX Designer. Your portfolio shows great mobile design skills!",
    invitedBy: {
      name: "Alex Thompson",
      role: "Project Leader",
      avatar: null
    },
    invitedAt: new Date('2025-07-30'),
    status: "pending" // pending, accepted, declined
  },
  {
    id: 2,
    type: "mentorship_request",
    project: {
      title: "Blockchain Voting System",
      leader: "Emma Davis",
      domain: "Blockchain"
    },
    message: "Hi! We're working on a blockchain-based voting system and would greatly appreciate your guidance on smart contract security.",
    requestedBy: {
      name: "Emma Davis",
      role: "Computer Science Student",
      avatar: null
    },
    requestedAt: new Date('2025-07-28'),
    status: "pending"
  },
  {
    id: 3,
    type: "collaboration_request",
    project: {
      title: "Mental Health Support App",
      leader: "Jordan Kim",
      domain: "Healthcare Tech"
    },
    role: "Backend Developer",
    message: "Your experience with healthcare APIs would be perfect for our mental health support platform.",
    requestedBy: {
      name: "Jordan Kim",
      role: "Psychology Student",
      avatar: null
    },
    requestedAt: new Date('2025-07-25'),
    status: "pending"
  }
];

// Invitation Card Component
const InvitationCard = ({ invitation }) => {
  const [isResponding, setIsResponding] = useState(false);

  const getInvitationType = (type) => {
    const types = {
      project_invitation: { icon: "users", color: "bg-blue-500", label: "Project Invitation" },
      mentorship_request: { icon: "handshake", color: "bg-purple-500", label: "Mentorship Request" },
      collaboration_request: { icon: "user-plus", color: "bg-green-500", label: "Collaboration Request" }
    };
    return types[type] || types.project_invitation;
  };

  const handleAccept = async () => {
    setIsResponding(true);
    // Simulate API call
    setTimeout(() => {
      console.log(`Accepted invitation: ${invitation.id}`);
      setIsResponding(false);
    }, 1000);
  };

  const handleDecline = async () => {
    setIsResponding(true);
    // Simulate API call
    setTimeout(() => {
      console.log(`Declined invitation: ${invitation.id}`);
      setIsResponding(false);
    }, 1000);
  };

  const typeInfo = getInvitationType(invitation.type);

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${typeInfo.color}`}>
            <Icon name={typeInfo.icon} size={12} className="mr-1" />
            {typeInfo.label}
          </span>
          <span className="text-xs text-gray-500">
            {format(invitation.invitedAt || invitation.requestedAt, 'MMM d')}
          </span>
        </div>
        <CardTitle className="text-lg font-bold line-clamp-1">{invitation.project.title}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {invitation.project.domain} {invitation.role && `• ${invitation.role}`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex items-center mb-3">
          <Avatar className="h-8 w-8 mr-3">
            <AvatarFallback>
              {(invitation.invitedBy?.name || invitation.requestedBy?.name).charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {invitation.invitedBy?.name || invitation.requestedBy?.name}
            </p>
            <p className="text-xs text-gray-500">
              {invitation.invitedBy?.role || invitation.requestedBy?.role}
            </p>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-3 mb-3">{invitation.message}</p>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button 
          onClick={handleAccept} 
          disabled={isResponding}
          className="flex-1 bg-green-500 hover:bg-green-600"
        >
          {isResponding ? (
            <>
              <InlineSpinner variant="white" className="mr-2" />
              Accepting...
            </>
          ) : (
            <>
              <Icon name="check" size={16} className="mr-2" />
              Accept
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleDecline} 
          disabled={isResponding}
          variant="outline"
          className="flex-1"
        >
          {isResponding ? (
            <>
              <InlineSpinner variant="current" className="mr-2" />
              Declining...
            </>
          ) : (
            <>
              <Icon name="x" size={16} className="mr-2" />
              Decline
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Project Card Component
const ProjectCard = ({ project, isOwner = false }) => {
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

  const handleEditProject = () => {
    // Handle editing project
    console.log(`Editing project: ${project.title}`);
  };

  const handleManageTeam = () => {
    // Handle team management
    console.log(`Managing team for project: ${project.title}`);
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
        {isOwner ? (
          // Owner actions
          <>
            <Button onClick={handleEditProject} variant="outline" className="flex-1">
              <Icon name="edit" size={16} className="mr-2" />
              Edit Project
            </Button>
            <Button onClick={handleManageTeam} className="flex-1">
              <Icon name="users" size={16} className="mr-2" />
              Manage Team
            </Button>
          </>
        ) : (
          // Non-owner actions
          <>
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
          </>
        )}
      </CardFooter>
    </Card>
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
  const [activeTab, setActiveTab] = useState('invitations');
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter function for projects
  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Filter function for user projects
  const filteredUserProjects = mockUserProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Filter function for invitations
  const filteredInvitations = mockInvitations.filter(invitation => {
    const matchesSearch = invitation.project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invitation.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
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
          <SectionHero 
            title="Collaboration Hub"
            description="Connect, learn, and grow together through events, projects, and shared experiences"
            icon="handshake"
            actionButton={{
              label: "Create Project",
              icon: "plus",
              onClick: () => setShowCreateProjectModal(true)
            }}
          />
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Icon name="search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'invitations' ? "Search invitations..." : "Search projects..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {activeTab !== 'invitations' && (
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="recruiting">Recruiting</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            )}
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm mb-6">
            {[
              { id: 'invitations', label: 'Collaboration Invitations', icon: 'mail' },
              { id: 'my-projects', label: 'My Projects', icon: 'user' },
              { id: 'discover', label: 'Discover Projects', icon: 'search' }
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
                {tab.id === 'invitations' && filteredInvitations.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                    {filteredInvitations.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Collaboration Invitations Tab */}
        {activeTab === 'invitations' && (
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">📧 Collaboration Invitations</h2>
                <p className="text-gray-600">Review and respond to collaboration requests and project invitations</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInvitations.map((invitation) => (
                <motion.div key={invitation.id} variants={itemVariants}>
                  <InvitationCard invitation={invitation} />
                </motion.div>
              ))}
            </div>
            
            {filteredInvitations.length === 0 && (
              <div className="text-center py-12">
                <Icon name="mail" size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No invitations found</h3>
                <p className="text-gray-500">You're all caught up! New collaboration requests will appear here.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* My Projects Tab */}
        {activeTab === 'my-projects' && (
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">📁 My Projects</h2>
                <p className="text-gray-600">Manage and track your ongoing projects</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUserProjects.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <ProjectCard project={project} isOwner={true} />
                </motion.div>
              ))}
            </div>
            
            {filteredUserProjects.length === 0 && (
              <div className="text-center py-12">
                <Icon name="user" size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-500">
                  {searchQuery || filterStatus !== 'all' 
                    ? "Try adjusting your search or filter criteria" 
                    : "Start your first project and begin collaborating with others!"}
                </p>
                {!searchQuery && filterStatus === 'all' && (
                  <Button 
                    onClick={() => setShowCreateProjectModal(true)}
                    className="mt-4"
                  >
                    <Icon name="plus" size={16} className="mr-2" />
                    Create Your First Project
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Discover Projects Tab */}
        {activeTab === 'discover' && (
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">🔍 Discover Projects</h2>
                <p className="text-gray-600">Find and join exciting projects from other students</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <motion.div key={project.id} variants={itemVariants}>
                  <ProjectCard project={project} isOwner={false} />
                </motion.div>
              ))}
            </div>
            
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <Icon name="search" size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Create Project Modal */}
        <CreateProjectModal 
          isOpen={showCreateProjectModal} 
          onClose={() => setShowCreateProjectModal(false)} 
        />
      </div>
    </motion.div>
  );
};

export default Collaboration;