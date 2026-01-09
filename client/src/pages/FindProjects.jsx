import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Bookmark, Users, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for discoverable projects
const discoverableProjects = [
  {
    id: 1,
    title: "Robotics Club Mentorship",
    description: "Join the student-led robotics team as an alumni advisor. Help prepare for regional competitions and guide students through engineering challenges. This is a fantastic opportunity to share your industry experience with the next generation of engineers. You'll work closely with students on mechanical design, programming, and project management skills that will prepare them for real-world engineering careers.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    category: "SCIENCE",
    categoryColor: "bg-blue-600",
    members: 12,
    date: "Starts Oct 15",
  },
  {
    id: 2,
    title: "Local History Archive",
    description: "We are digitizing city archives from the 1900s. Looking for history buffs and tech-savvy volunteers to help preserve local heritage. This project involves scanning historical documents, organizing metadata, and creating searchable databases that will be accessible to researchers and the public. Your contributions will help preserve our community's rich history for future generations to explore and learn from.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
    category: "COMMUNITY",
    categoryColor: "bg-yellow-500",
    members: 5,
    date: "Ongoing",
  },
  {
    id: 3,
    title: "Winter Art Showcase",
    description: "Open call for student and alumni artists to collaborate on the upcoming winter exhibition. Seeking painters, sculptors, and digital artists. This year's theme explores the intersection of tradition and innovation in contemporary art. Selected artists will have their work displayed in the main gallery and will participate in artist talks and workshops throughout the exhibition period.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop",
    category: "ARTS",
    categoryColor: "bg-purple-600",
    members: 28,
    date: "Dec 01",
  },
  {
    id: 4,
    title: "AI Research Initiative",
    description: "Collaborative research project exploring ethical AI applications in education. Looking for researchers, developers, and ethicists to contribute. We're investigating how machine learning can be used responsibly to enhance learning outcomes while protecting student privacy and ensuring equitable access. This interdisciplinary project brings together experts from computer science, education, philosophy, and policy to develop comprehensive guidelines.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
    category: "SCIENCE",
    categoryColor: "bg-blue-600",
    members: 15,
    date: "Starts Nov 20",
  },
  {
    id: 5,
    title: "Community Garden Project",
    description: "Help us build and maintain a community garden on campus. Perfect for those interested in sustainability and environmental education. We're creating green spaces that serve as outdoor classrooms, provide fresh produce for the campus food bank, and demonstrate sustainable agriculture practices. Volunteers will learn about organic gardening, composting, water conservation, and how to grow food in urban environments.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
    category: "COMMUNITY",
    categoryColor: "bg-yellow-500",
    members: 8,
    date: "Ongoing",
  },
  {
    id: 6,
    title: "Music Production Workshop",
    description: "Learn music production from industry professionals. This workshop series covers everything from beat-making to mixing and mastering. Whether you're a complete beginner or looking to refine your skills, our expert instructors will guide you through the creative and technical aspects of modern music production. You'll have access to professional equipment and software, and by the end of the series, you'll have produced your own complete track.",
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
  <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all border border-gray-200">
    {/* Content */}
    <div className="p-5">
      {/* Category Badge and Bookmark */}
      <div className="flex items-center justify-between mb-3">
        <span className={`${project.categoryColor} text-white text-xs font-semibold px-2.5 py-1 rounded`}>
          {project.category}
        </span>
        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm border border-gray-200">
          <Bookmark className="w-4 h-4 text-blue-600" />
        </button>
      </div>

      <h3 className="font-bold text-gray-900 text-base mb-2">{project.title}</h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-5">{project.description}</p>
      
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

const FindProjects = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/dashboard/media')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Projects Hub</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Projects</h1>
        <p className="text-gray-600">Discover and join exciting projects from around the community.</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <DiscoverProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No projects found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default FindProjects;
