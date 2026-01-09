import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, ChevronDown, PenLine, ShieldX } from 'lucide-react';
import { useAuth } from '@/contexts/auth';

// Mock data for tributes
const mockTributes = [
  {
    id: 1,
    teacher: {
      name: 'Mr. John Keating',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      department: 'ENGLISH DEPT.',
      departmentColor: 'text-blue-600',
      years: '1988-1995',
    },
    quote: 'He taught me to look at things in a different way. "O Captain! My Captain!" will forever echo in my mind. He didn\'t just teach poetry; he taught us to seize the day and make our lives extraordinary.',
    author: {
      name: 'Todd Anderson',
      class: 'Class of \'89',
    },
    likes: 124,
  },
  {
    id: 2,
    teacher: {
      name: 'Mrs. McGonagall',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      department: 'SCIENCE DEPT.',
      departmentColor: 'text-green-600',
      years: '1990-Present',
    },
    quote: 'Stern but fair. She pushed me harder than any other teacher because she saw potential I didn\'t see in myself. I wouldn\'t be a scientist today without her unwavering belief in my abilities.',
    author: {
      name: 'Hermione G.',
      class: 'Class of \'98',
    },
    likes: 89,
  },
  {
    id: 3,
    teacher: {
      name: 'Mr. George Feeny',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      department: 'HISTORY',
      departmentColor: 'text-blue-600',
      years: '1985-2005',
    },
    quote: 'Believe in yourselves. Dream. Try. Do good. Mr. Feeny was more than a history teacher; he was a life mentor. His lessons extended far beyond the classroom walls.',
    author: {
      name: 'Cory Matthews',
      class: 'Class of \'00',
    },
    likes: 215,
  },
  {
    id: 4,
    teacher: {
      name: 'Ms. Jennifer Honey',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      department: 'PRIMARY ED.',
      departmentColor: 'text-blue-600',
      years: '1996-2010',
    },
    quote: 'She was the first teacher who made me feel safe. Her kindness was her superpower. In a world that often feels harsh, she created a haven of learning and love.',
    author: {
      name: 'Matilda W.',
      class: 'Class of \'02',
    },
    likes: 156,
  },
  {
    id: 5,
    teacher: {
      name: 'Mr. Dewey Finn',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      department: 'MUSIC',
      departmentColor: 'text-purple-600',
      years: '2003-2004',
    },
    quote: 'He wasn\'t exactly conventional, but man, did he teach us how to rock! He showed us the power of music to unite us and give us confidence we never knew we had.',
    author: {
      name: 'Zack M.',
      class: 'Class of \'04',
    },
    likes: 98,
  },
  {
    id: 6,
    teacher: {
      name: 'Prof. Charles Xavier',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
      department: 'HEADMASTER',
      departmentColor: 'text-blue-600',
      years: '1963-Present',
    },
    quote: 'He gave us a home when the world turned its back. His dream of coexistence is something I fight for every day. A true visionary who saw the best in all of us.',
    author: {
      name: 'Scott S.',
      class: 'Class of \'85',
    },
    likes: 342,
  },
];

// Department filter options
const departmentFilters = [
  { id: 'all', label: 'All Departments' },
  { id: 'science', label: 'Science' },
  { id: 'arts', label: 'Arts' },
  { id: 'humanities', label: 'Humanities' },
  { id: 'sports', label: 'Sports' },
];

// Tribute Card Component
const TributeCard = ({ tribute }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
    {/* Teacher Header */}
    <div className="flex items-start gap-3 mb-4">
      <Avatar className="w-12 h-12 border-2 border-gray-200">
        <AvatarImage src={tribute.teacher.avatar} />
        <AvatarFallback className="bg-blue-500 text-white">
          {tribute.teacher.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h3 className="font-bold text-gray-900">{tribute.teacher.name}</h3>
        <p className={`text-xs font-semibold ${tribute.teacher.departmentColor}`}>
          {tribute.teacher.department}
        </p>
      </div>
      <span className="text-xs text-gray-400 text-right whitespace-nowrap">
        {tribute.teacher.years}
      </span>
    </div>

    {/* Quote */}
    <div className="mb-4">
      <p className="text-sm text-gray-600 leading-relaxed italic">
        "{tribute.quote}"
      </p>
    </div>

    {/* Author and Likes */}
    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
      <div>
        <p className="text-sm font-medium text-gray-900">{tribute.author.name}</p>
        <p className="text-xs text-blue-600">{tribute.author.class}</p>
      </div>
      <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors">
        <Heart className="w-4 h-4" />
        <span className="text-sm font-medium">{tribute.likes}</span>
      </button>
    </div>
  </div>
);

const TributeSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const { user } = useAuth();

  const isTeacher = user?.role === 'teacher';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-amber-900">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="relative z-10 px-8 py-12">
          <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {isTeacher ? 'YOUR LEGACY' : 'COMMUNITY'}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            {isTeacher ? (
              <>See the lives you've<br />touched and inspired.</>
            ) : (
              <>Honoring those who<br />shaped our futures.</>
            )}
          </h1>
          <p className="text-gray-300 mb-6 max-w-lg">
            {isTeacher 
              ? "Read heartfelt messages from students and alumni who remember the difference you made in their lives."
              : "A dedicated space to express gratitude to the mentors who made a difference in our lives. Share your story today."
            }
          </p>
          {!isTeacher && (
            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-full flex items-center gap-2">
              <PenLine className="w-4 h-4" />
              Write a Tribute
            </Button>
          )}
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {/* Department Filter Pills */}
        <div className="flex gap-2 flex-wrap">
          {departmentFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <button className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
            Most Recent
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tributes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTributes.map((tribute) => (
          <TributeCard key={tribute.id} tribute={tribute} />
        ))}
      </div>
      </div>
    </div>
  );
};

export default TributeSection;