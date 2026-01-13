import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Image, 
  Link, 
  TrendingUp,
  MoreHorizontal,
  Briefcase,
  GraduationCap,
  Building,
  FlaskConical,
  Calendar,
  Bookmark,
  Users,
  Mail
} from 'lucide-react';

// Mock data for blog posts
const mockPosts = [
  {
    id: 1,
    author: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      badge: 'ALUMNI \'15',
      badgeColor: 'bg-blue-100 text-blue-700',
      role: 'Senior Product Manager @ TechFlow',
    },
    timeAgo: '2h ago',
    category: 'CAREER ADVICE',
    categoryColor: 'text-blue-600',
    title: 'Transitioning from Campus to Corporate: A Survival Guide',
    content: 'Moving from a university environment to a corporate setting can be jarring. The structured syllabus is replaced by ambiguous OKRs, and your grades are now performance reviews. After 8 years in the industry, I\'ve compiled 5 essential tips that I...',
    image: null,
    hashtags: [],
    likes: 248,
    comments: 42,
    readTime: '5 min read',
  },
  {
    id: 2,
    author: {
      name: 'Dr. David Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      badge: 'FACULTY',
      badgeColor: 'bg-purple-100 text-purple-700',
      role: 'Physics Department Head',
    },
    timeAgo: '5h ago',
    category: 'DEPARTMENT NEWS',
    categoryColor: 'text-blue-600',
    title: 'New Physics Department Research Grants Announced',
    content: 'I am thrilled to announce that the Department of Physics has secured three major grants for the upcoming academic year. These funds will support our ongoing research in quantum computing and renewable energy materials. We are looking for alumni mentors to guide our Ph.D. students...',
    image: null,
    hashtags: ['#Physics', '#Research', '#Grants2024'],
    likes: 86,
    comments: 12,
    readTime: '3 min read',
  },
  {
    id: 3,
    author: {
      name: 'Alumni Association',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      badge: 'OFFICIAL',
      badgeColor: 'bg-red-100 text-red-700',
      role: 'Admin',
    },
    timeAgo: '1d ago',
    category: 'EVENTS RECAP',
    categoryColor: 'text-blue-600',
    title: 'Class of 2014 Reunion Recap: A Night to Remember',
    content: 'What an incredible turnout! Over 150 alumni from the class of 2014 gathered at the Main Hall last Saturday. We shared stories, reconnected with old friends, and even danced to some hits from our college days. Check out the full photo gallery and see if you can spot...',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=200&fit=crop',
    hashtags: [],
    likes: 312,
    comments: 89,
    readTime: '2 min read',
  },
];

// Category filter options
const categoryFilters = [
  { id: 'for-you', label: 'For You', icon: ThumbsUp },
  { id: 'career-advice', label: 'Career Advice', icon: Briefcase },
  { id: 'campus-news', label: 'Campus News', icon: Building },
  { id: 'research', label: 'Research', icon: FlaskConical },
  { id: 'events', label: 'Events', icon: Calendar },
];

// Trending topics data
const trendingTopics = [
  { tag: '#TechJobs', posts: '2.4k posts' },
  { tag: '#Mentorship', posts: '1.8k posts' },
  { tag: '#UniversityNews', posts: '940 posts' },
  { tag: '#Startups', posts: '850 posts' },
];

// Top contributors data
const topContributors = [
  { name: 'James Wilson', role: 'Alumni \'12 • Entrepreneur', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
  { name: 'Emily Roberts', role: 'Student • Journalism', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
];

// Post Card Component
const PostCard = ({ post }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
    {/* Author Header */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <Avatar className="w-11 h-11">
          <AvatarImage src={post.author.avatar} />
          <AvatarFallback className="bg-blue-500 text-white">
            {post.author.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 text-sm">{post.author.name}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${post.author.badgeColor}`}>
              {post.author.badge}
            </span>
          </div>
          <p className="text-xs text-gray-500">{post.author.role} • {post.timeAgo}</p>
        </div>
      </div>
      <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
        <MoreHorizontal className="w-5 h-5 text-gray-400" />
      </button>
    </div>

    {/* Category */}
    <p className={`text-xs font-semibold ${post.categoryColor} mb-2`}>{post.category}</p>

    {/* Title */}
    <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>

    {/* Content */}
    <p className="text-sm text-gray-600 leading-relaxed">
      {post.content}
    </p>

    {/* Hashtags */}
    {post.hashtags.length > 0 && (
      <div className="flex gap-2 mt-3">
        {post.hashtags.map((tag, index) => (
          <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
    )}

    {/* Actions */}
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span className="text-sm">{post.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm">{post.comments} Comments</span>
        </button>
        <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-600 transition-colors">
          <Share2 className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </button>
      </div>
      <span className="text-xs text-gray-400 flex items-center gap-1">
        <Bookmark className="w-3.5 h-3.5" />
        {post.readTime}
      </span>
    </div>
  </div>
);

// Post Composer Component
const PostComposer = () => {
  const [postContent, setPostContent] = useState('');

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm mb-6">
      <div className="flex gap-3">
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
          <AvatarFallback className="bg-blue-500 text-white">U</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <textarea
            placeholder="Share your industry insights or campus news, Alex..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            rows={3}
            className="w-full resize-none border-none focus:outline-none text-sm text-gray-700 placeholder-gray-400"
          />
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Image className="w-5 h-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Link className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg">
              Publish Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Category Filter Pills Component
const CategoryFilters = ({ activeFilter, setActiveFilter }) => (
  <div className="flex gap-2 mb-6 flex-wrap">
    {categoryFilters.map((filter) => {
      const Icon = filter.icon;
      return (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter.id
              ? 'bg-blue-500 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Icon className="w-4 h-4" />
          {filter.label}
        </button>
      );
    })}
  </div>
);

// Sidebar Component
const Sidebar = () => (
  <div className="space-y-6">
    {/* Trending Topics */}
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        <h3 className="font-bold text-gray-900">Trending Topics</h3>
      </div>
      <div className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">
              {topic.tag}
            </span>
            <span className="text-xs text-gray-400">{topic.posts}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Top Contributors */}
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Top Contributors</h3>
        <button className="text-xs text-blue-600 font-medium hover:underline">View All</button>
      </div>
      <div className="space-y-3">
        {topContributors.map((contributor, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src={contributor.avatar} />
                <AvatarFallback className="bg-blue-500 text-white text-xs">
                  {contributor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-gray-900">{contributor.name}</p>
                <p className="text-xs text-gray-500">{contributor.role}</p>
              </div>
            </div>
            <button className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors">
              <Users className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* Weekly Digest */}
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
      <h3 className="font-bold mb-2">Weekly Digest</h3>
      <p className="text-sm text-blue-100 mb-4">
        Get the best stories and alumni updates delivered to your inbox.
      </p>
      <input
        type="email"
        placeholder="Your email address"
        className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 mb-3"
      />
      <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-medium text-sm py-2 rounded-lg">
        Subscribe
      </Button>
    </div>

    {/* Footer Links */}
    <div className="text-center text-xs text-gray-400 space-y-2">
      <div className="flex justify-center gap-3">
        <a href="#" className="hover:text-gray-600">About</a>
        <a href="#" className="hover:text-gray-600">Guidelines</a>
        <a href="#" className="hover:text-gray-600">Privacy</a>
        <a href="#" className="hover:text-gray-600">Help</a>
      </div>
      <p>© 2024 Alumni Network Inc.</p>
    </div>
  </div>
);

// Main BlogSection Component
const BlogSection = () => {
  const [activeFilter, setActiveFilter] = useState('for-you');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Insights & Stories</h1>
              <p className="text-gray-600 mt-1">Share knowledge, experiences, and stay updated with the alumni network.</p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard/blog/create')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-5 py-2 rounded-full flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Write Post
            </Button>
          </div>
        </div>

      {/* Main Layout: Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">

          {/* Category Filters */}
          <CategoryFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

          {/* Posts Feed */}
          <div className="space-y-6">
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Sidebar />
        </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSection;