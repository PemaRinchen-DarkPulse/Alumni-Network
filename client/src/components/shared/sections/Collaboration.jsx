import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  MoreHorizontal,
  ArrowRight,
  MessageSquare,
  Calendar,
  Clock,
  Bookmark,
  X,
  Users,
} from "lucide-react";

// Mock data for incoming requests
const incomingRequests = [
  {
    id: 1,
    mentee: {
      name: "Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      program: "Computer Science",
    },
    requestType: "Career Guidance",
    message: "Looking for advice on transitioning into software engineering. I have been working in data analysis for the past three years and would love to understand the best path forward for making this career switch successfully.",
    timeAgo: "2h ago",
  },
  {
    id: 2,
    mentee: {
      name: "Michael Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      program: "Business Administration",
    },
    requestType: "Resume Review",
    message: "Would appreciate feedback on my resume for internship applications. I am targeting product management roles at tech companies and want to make sure my experience in business operations translates well on paper.",
    timeAgo: "5h ago",
  },
  {
    id: 3,
    mentee: {
      name: "Emily Davis",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      program: "Data Science",
    },
    requestType: "Interview Prep",
    message: "Need help preparing for upcoming tech interviews. I have final rounds scheduled with several major companies and would greatly appreciate guidance on system design questions and behavioral interview strategies.",
    timeAgo: "1d ago",
  },
];

// Mock data for schedule
const scheduleItems = [
  {
    id: 1,
    month: "TODAY",
    day: "24",
    title: "Career Sync w/ Sarah J.",
    time: "2:00 PM - 2:30 PM",
    color: "border-yellow-400",
  },
  {
    id: 2,
    month: "NOV",
    day: "02",
    title: "Resume Review",
    time: "10:00 AM - 10:30 AM",
    color: "border-yellow-400",
  },
  {
    id: 3,
    month: "NOV",
    day: "05",
    title: "Interview Prep",
    time: "3:00 PM - 3:45 PM",
    color: "border-yellow-400",
  },
  {
    id: 4,
    month: "NOV",
    day: "08",
    title: "Career Planning",
    time: "1:00 PM - 1:30 PM",
    color: "border-yellow-400",
  },
  {
    id: 5,
    month: "NOV",
    day: "10",
    title: "Project Discussion",
    time: "4:00 PM - 4:30 PM",
    color: "border-yellow-400",
  },
];

// Mock data for active projects
const activeProjects = [
  {
    id: 1,
    title: "Sustainable Energy Research",
    description:
      "Collaborative study on renewable energy implementation in urban environments. This project focuses on solar and wind power integration for residential areas, analyzing cost-effectiveness and environmental impact across multiple city districts.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
    progress: 75,
    progressColor: "bg-blue-500",
    team: [
      {
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
      },
      {
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
      },
    ],
    moreMembers: 2,
  },
  {
    id: 2,
    title: "Architecture Mentorship",
    description:
      "Reviewing final thesis submissions for the graduating class of 2025. Providing detailed feedback on structural design, sustainability practices, and innovative building materials for student projects.",
    image:
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
    status: "Pending Review",
    statusColor: "bg-blue-100 text-blue-700",
    progress: 90,
    progressColor: "bg-orange-500",
    team: [
      {
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop",
      },
    ],
    moreMembers: 5,
  },
  {
    id: 3,
    title: "AI Ethics Committee",
    description:
      "Working group focused on developing ethical guidelines for artificial intelligence research and implementation. Collaborating with industry experts and academic researchers to establish best practices.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
    status: "Active",
    statusColor: "bg-green-100 text-green-700",
    progress: 45,
    progressColor: "bg-blue-500",
    team: [
      {
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
      },
      {
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop",
      },
    ],
    moreMembers: 3,
  },
  {
    id: 4,
    title: "Community Outreach Program",
    description:
      "Organizing educational workshops and mentorship sessions for underprivileged students in local communities. Building partnerships with schools and community centers.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
    status: "In Progress",
    statusColor: "bg-yellow-100 text-yellow-700",
    progress: 60,
    progressColor: "bg-yellow-500",
    team: [
      {
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop",
      },
    ],
    moreMembers: 4,
  },
];

// Mock data for discoverable projects
const discoverableProjects = [
  {
    id: 1,
    title: "Robotics Club Mentorship",
    description: "Join the student-led robotics team as an alumni advisor. Help prepare for regional competitions and guide students through engineering challenges.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    category: "SCIENCE",
    categoryColor: "bg-blue-600",
    members: 12,
    date: "Starts Oct 15",
  },
  {
    id: 2,
    title: "Local History Archive",
    description: "We are digitizing city archives from the 1900s. Looking for history buffs and tech-savvy volunteers to help preserve local heritage.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
    category: "COMMUNITY",
    categoryColor: "bg-yellow-500",
    members: 5,
    date: "Ongoing",
  },
  {
    id: 3,
    title: "Winter Art Showcase",
    description: "Open call for student and alumni artists to collaborate on the upcoming winter exhibition. Seeking painters, sculptors, and digital artists.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop",
    category: "ARTS",
    categoryColor: "bg-purple-600",
    members: 28,
    date: "Dec 01",
  },
  {
    id: 4,
    title: "AI Research Initiative",
    description: "Collaborative research project exploring ethical AI applications in education. Looking for researchers, developers, and ethicists to contribute.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
    category: "SCIENCE",
    categoryColor: "bg-blue-600",
    members: 15,
    date: "Starts Nov 20",
  },
  {
    id: 5,
    title: "Community Garden Project",
    description: "Help us build and maintain a community garden on campus. Perfect for those interested in sustainability and environmental education.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
    category: "COMMUNITY",
    categoryColor: "bg-yellow-500",
    members: 8,
    date: "Ongoing",
  },
  {
    id: 6,
    title: "Music Production Workshop",
    description: "Learn music production from industry professionals. This workshop series covers everything from beat-making to mixing and mastering.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=300&fit=crop",
    category: "ARTS",
    categoryColor: "bg-purple-600",
    members: 20,
    date: "Jan 10",
  },
];

// Category filters
const categoryFilters = [
  { id: "all", label: "All Projects" },
  { id: "science", label: "Science & Tech" },
  { id: "arts", label: "Arts & Humanities" },
  { id: "community", label: "Community" },
];

// Discover Project Card Component
const DiscoverProjectCard = ({ project }) => (
  <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all">
    {/* Image with category badge and bookmark */}
    <div className="relative h-44 bg-gradient-to-br from-amber-100 to-amber-200 flex items-end justify-center">
      <img 
        src={project.image} 
        alt={project.title}
        className="w-full h-full object-cover"
      />
      {/* Category Badge */}
      <span className={`absolute bottom-3 left-3 ${project.categoryColor} text-white text-xs font-semibold px-2.5 py-1 rounded`}>
        {project.category}
      </span>
      {/* Bookmark Icon */}
      <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm">
        <Bookmark className="w-4 h-4 text-blue-600" />
      </button>
    </div>
    
    {/* Content */}
    <div className="p-4">
      <h3 className="font-bold text-gray-900 text-base mb-2">{project.title}</h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-3">{project.description}</p>
      
      {/* Members and Date */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{project.members} Members</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{project.date}</span>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg">
          Join Project
        </Button>
        <Button 
          variant="outline" 
          className="border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-medium px-4 py-2 rounded-lg"
        >
          View Details
        </Button>
      </div>
    </div>
  </div>
);

// Find Projects Modal Component
const FindProjectsModal = ({ isOpen, onClose, searchQuery, setSearchQuery, activeFilter, setActiveFilter }) => {
  if (!isOpen) return null;
  
  const filteredProjects = discoverableProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || 
                          project.category.toLowerCase() === activeFilter ||
                          (activeFilter === "science" && project.category === "SCIENCE") ||
                          (activeFilter === "arts" && project.category === "ARTS") ||
                          (activeFilter === "community" && project.category === "COMMUNITY");
    return matchesSearch && matchesFilter;
  });
  
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4 z-10">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        
        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects by name, topic, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            {/* Filter Pills */}
            <div className="flex gap-2 flex-wrap">
              {categoryFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Projects Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <DiscoverProjectCard key={project.id} project={project} />
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Request Card Component
const RequestCard = ({ request, onAccept, onDecline }) => (
  <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
    {/* Invited by header */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
          <AvatarImage src={request.mentee.avatar} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">
            {request.mentee.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-xs text-gray-500">Invited by</p>
          <p className="text-sm font-semibold text-blue-600">
            {request.mentee.name}
          </p>
        </div>
      </div>
      <span className="text-xs text-gray-400">{request.timeAgo}</span>
    </div>

    {/* Project/Board Title */}
    <h3 className="text-base font-bold text-gray-900 mb-2">
      {request.requestType}
    </h3>

    {/* Description */}
    <p className="text-sm text-gray-500 mb-5 line-clamp-3">{request.message}</p>

    {/* Action Buttons */}
    <div className="flex gap-3">
      <Button
        onClick={onAccept}
        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-lg"
      >
        Accept
      </Button>
      <Button
        onClick={onDecline}
        variant="ghost"
        className="text-gray-600 hover:text-gray-800 hover:bg-transparent text-sm font-medium px-4 py-2"
      >
        Decline
      </Button>
    </div>
  </div>
);

// Schedule Item Component
const ScheduleItem = ({ item }) => (
  <div className={`flex items-start gap-3 py-3 border-l-2 ${item.color} pl-3`}>
    <div className="text-center min-w-[40px]">
      <p className="text-xs text-gray-400 font-medium">{item.month}</p>
      <p className="text-xl font-bold text-white">{item.day}</p>
    </div>
    <div className="flex-1">
      <h4 className="text-white font-medium text-sm">{item.title}</h4>
      <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
        <Clock className="w-3 h-3" />
        <span>{item.time}</span>
      </div>
    </div>
  </div>
);

// Schedule Panel Component
const SchedulePanel = () => (
  <div className="bg-slate-800 rounded-xl p-5 min-h-[300px]">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-white" />
        <h3 className="text-white font-semibold">Your Schedule</h3>
      </div>
      <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
        View All
      </button>
    </div>

    <div className="space-y-1">
      {scheduleItems.map((item) => (
        <ScheduleItem key={item.id} item={item} />
      ))}
    </div>

    <Button className="w-full mt-4 bg-transparent border border-slate-600 text-blue-400 hover:bg-slate-700 hover:text-blue-300 font-medium rounded-lg">
      + Schedule New
    </Button>
  </div>
);

// Project Card Component
const ProjectCard = ({ project }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all">
    {/* Project Details */}
    <div className="p-4">
      <div className="flex items-start justify-between mb-2">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-md ${project.statusColor}`}
        >
          {project.status}
        </span>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <h3 className="font-semibold text-gray-900 text-base mb-1">
        {project.title}
      </h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
        {project.description}
      </p>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Progress</span>
          <span className="text-xs font-medium text-gray-700">
            {project.progress}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${project.progressColor} rounded-full`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Team & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {project.team.map((member, index) => (
              <Avatar key={index} className="w-8 h-8 border-2 border-white">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                  T
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          {project.moreMembers > 0 && (
            <span className="text-xs text-gray-500 ml-2">
              +{project.moreMembers}
            </span>
          )}
        </div>

        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
          Enter Workspace
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

const Collaboration = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Projects Hub
          </h1>
          <p className="text-gray-600">
            Manage active research, handle invitations, and explore new
            opportunities.
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 rounded-full flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-5 rounded-full flex items-center gap-2"
            onClick={() => navigate('/dashboard/find-projects')}
          >
            <Search className="w-4 h-4" />
            Find Projects
          </Button>
        </div>
      </div>

      {/* Incoming Requests & Schedule Section */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Collaboration Invitations
        </h2>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request Cards - 2 columns */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAccept={() => console.log("Accepted:", request.id)}
                  onDecline={() => console.log("Declined:", request.id)}
                />
              ))}
            </div>
          </div>

          {/* Schedule Panel - 1 column */}
          <div className="lg:col-span-1 self-start lg:-mt-12">
            <div className="bg-slate-900 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-white" />
                  <h3 className="text-lg font-semibold">Your Schedule</h3>
                </div>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {scheduleItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-l-4 border-yellow-400 pl-4 py-3 bg-slate-800 rounded-r"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-center flex-shrink-0">
                        <div className="text-xs text-gray-400 font-medium">
                          {item.month}
                        </div>
                        <div className="text-xl font-bold text-white">
                          {item.day}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white mb-1">
                          {item.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-blue-400">
                          <Clock className="w-3 h-3" />
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-sm text-blue-400 hover:text-blue-300 font-medium border border-slate-700 rounded hover:bg-slate-800 transition-colors">
                + Schedule New
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* My Active Projects Section */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Cards - 2 columns */}
          <div className="lg:col-span-2 self-start">
            <div className="flex items-center justify-between mb-4 px-3">
              <h2 className="text-xl font-bold text-gray-900">
                My Active Projects
              </h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                View All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines Panel - 1 column */}
          <div className="lg:col-span-1 self-start">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-bold text-gray-900">
                  Upcoming Deadlines
                </h3>
              </div>

              <div className="space-y-4">
                {/* Deadline Item 1 */}
                <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center min-w-[45px] bg-blue-50 rounded-lg py-2 px-2">
                    <p className="text-xs text-blue-600 font-medium">OCT</p>
                    <p className="text-xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Thesis Proposal Due
                    </h4>
                    <p className="text-xs text-gray-500">
                      Architecture Mentorship
                    </p>
                  </div>
                </div>

                {/* Deadline Item 2 */}
                <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center min-w-[45px] bg-blue-50 rounded-lg py-2 px-2">
                    <p className="text-xs text-blue-600 font-medium">OCT</p>
                    <p className="text-xl font-bold text-gray-900">15</p>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Quarterly Review
                    </h4>
                    <p className="text-xs text-gray-500">Sustainable Energy</p>
                  </div>
                </div>

                {/* Deadline Item 3 */}
                <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center min-w-[45px] bg-blue-50 rounded-lg py-2 px-2">
                    <p className="text-xs text-blue-600 font-medium">NOV</p>
                    <p className="text-xl font-bold text-gray-900">01</p>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      Research Submission
                    </h4>
                    <p className="text-xs text-gray-500">Energy Research</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Collaboration;
