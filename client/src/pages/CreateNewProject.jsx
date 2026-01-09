import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bold, Italic, List, Link, Image, Target, Users, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateNewProject = () => {
  const navigate = useNavigate();
  const [projectTitle, setProjectTitle] = useState('');
  const [category, setCategory] = useState('');
  const [teamSize, setTeamSize] = useState('5');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const categories = [
    'Science & Tech',
    'Arts & Humanities',
    'Community',
    'Research',
    'Education',
    'Environment',
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/dashboard/media')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Projects Hub</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
        <p className="text-gray-500">Fill in the details below to launch your collaboration.</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        {/* Project Title */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Project Title
          </label>
          <input
            type="text"
            placeholder="e.g. Sustainable Campus Garden Initiative"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Category and Team Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white appearance-none cursor-pointer"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Estimated Team Size
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <span className="text-blue-600 text-sm font-medium">Collaborators</span>
            </div>
          </div>
        </div>

        {/* Project Description */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Project Description
          </label>
          {/* Toolbar */}
          <div className="flex items-center gap-1 p-2 border border-gray-200 border-b-0 rounded-t-lg bg-gray-50">
            <button className="p-2 hover:bg-gray-200 rounded transition-colors">
              <Bold className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded transition-colors">
              <Italic className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded transition-colors">
              <List className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded transition-colors">
              <Link className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded transition-colors">
              <Image className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <textarea
            placeholder="Describe the goals, timeline, and what you're looking for in collaborators..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-200 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
          />
        </div>

        {/* Public Project Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">Public Project</h4>
            <p className="text-gray-500 text-xs">Allow everyone in the network to see and join this project.</p>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isPublic ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span 
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                isPublic ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-8">
        <Button 
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-2 rounded-lg"
        >
          Save as Draft
        </Button>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2 rounded-lg">
          Create Project
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">Clear Goals</h4>
            <p className="text-gray-500 text-xs">Projects with specific goals and milestones attract 40% more collaborators.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">Diverse Teams</h4>
            <p className="text-gray-500 text-xs">Mixing students and alumni leads to better mentorship opportunities.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Megaphone className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">Publicity</h4>
            <p className="text-gray-500 text-xs">Public projects are showcased on the home dashboard for higher visibility.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewProject;
