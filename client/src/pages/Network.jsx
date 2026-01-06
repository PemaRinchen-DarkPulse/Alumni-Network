import React, { useState } from 'react'
import { Search, Filter, Mail, Grid3x3, List, ChevronDown } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select } from '../components/ui/select'

const Network = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('relevance')
  const [filters, setFilters] = useState({
    batchYear: '',
    department: '',
    role: '',
    industry: ''
  })

  // Generate batch years from 2016 to current year
  const currentYear = new Date().getFullYear()
  const batchYears = []
  for (let year = 2016; year <= currentYear; year++) {
    batchYears.push(year)
  }

  // Sample alumni data
  const alumniData = [
    {
      id: 1,
      name: 'Karma Wangchuk',
      role: 'Alumni',
      year: '2018',
      title: 'Product Designer at',
      company: 'Stripe',
      location: 'San Francisco, CA',
      skills: ['UX/UI', 'Figma'],
      status: 'connect',
      bgColor: 'from-blue-500 to-purple-600',
      image: null
    },
    {
      id: 2,
      name: 'Tashi Dorji',
      role: 'Student',
      year: '2020',
      title: 'Software Engineer at',
      company: 'Google',
      location: 'New York, NY',
      skills: ['Python', 'AI/ML'],
      status: 'pending',
      bgColor: 'from-emerald-400 to-teal-600',
      image: null
    },
    {
      id: 3,
      name: 'Pema Lhaden',
      role: 'Alumni',
      year: '2019',
      title: 'Marketing Director at',
      company: 'Spotify',
      location: 'Los Angeles, CA',
      skills: ['Mentor', 'Brand Strategy'],
      status: 'connect',
      bgColor: 'from-orange-400 to-rose-500',
      image: null
    },
    {
      id: 4,
      name: 'Sonam Tenzin',
      role: 'Teacher',
      year: '2017',
      title: 'Founder at DeepStart',
      company: '',
      location: 'Austin, TX',
      skills: ['Mentor', 'Entrepreneurship'],
      status: 'connect',
      bgColor: 'from-slate-700 to-slate-900',
      image: null
    },
    {
      id: 5,
      name: 'Dechen Wangmo',
      role: 'Alumni',
      year: '2016',
      title: 'HR Manager at',
      company: 'LinkedIn',
      location: 'Chicago, IL',
      skills: ['Recruiting', 'People Ops'],
      status: 'connect',
      bgColor: 'from-pink-400 to-purple-500',
      image: null
    },
    {
      id: 6,
      name: 'Ugyen Dorji',
      role: 'Student',
      year: '2021',
      title: 'Data Scientist at Netflix',
      company: '',
      location: 'Remote',
      skills: ['Big Data', 'SQL'],
      status: 'connect',
      bgColor: 'from-amber-400 to-orange-600',
      image: null
    },
    {
      id: 7,
      name: 'Sangay Choden',
      role: 'Alumni',
      year: '2022',
      title: 'Financial Analyst at',
      company: 'Chase',
      location: 'New York, NY',
      skills: ['Finance', 'Modeling'],
      status: 'connect',
      bgColor: 'from-cyan-400 to-blue-600',
      image: null
    },
    {
      id: 8,
      name: 'Kinley Dorji',
      role: 'Teacher',
      year: '2020',
      title: 'Architect at',
      company: 'DesignGroup',
      location: 'Seattle, WA',
      skills: ['Design', 'CAD'],
      status: 'connect',
      bgColor: 'from-violet-500 to-purple-700',
      image: null
    }
  ]

  const handleClearFilters = () => {
    setFilters({
      batchYear: '',
      department: '',
      role: '',
      industry: ''
    })
  }

  const handleConnect = (id) => {
    console.log('Connect with alumni:', id)
  }

  const handleMessage = (id) => {
    console.log('Message alumni:', id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Campus Community</h1>
          <p className="text-gray-600">
            Connect with peers, find mentors, and explore opportunities across the global alumni network.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
            <select 
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12"
              value={filters.batchYear}
              onChange={(e) => setFilters({...filters, batchYear: e.target.value})}
            >
              <option value="">Batch Year</option>
              {batchYears.reverse().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <select 
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12"
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
            >
              <option value="">Role</option>
              <option value="alumni">Alumni</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>
        </div>

        {/* Alumni Grid */}
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'} mb-8`}>
          {alumniData.map((alumni) => (
            <div key={alumni.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              {/* Colored Header */}
              <div className={`h-24 bg-gradient-to-br ${alumni.bgColor}`}></div>
              
              {/* Profile Picture */}
              <div className="relative px-6 -mt-14">
                <div className="w-28 h-28 rounded-full bg-gray-300 border-4 border-white overflow-hidden">
                  {alumni.image ? (
                    <img src={alumni.image} alt={alumni.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500"></div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-4 flex-1 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{alumni.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{alumni.role}</p>
                  {(alumni.role === 'Alumni' || alumni.role === 'Student') && (
                    <span className="text-xs text-blue-600 font-medium">Batch {alumni.year}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-auto">
                  {alumni.status === 'connect' ? (
                    <Button 
                      onClick={() => handleConnect(alumni.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Connect
                    </Button>
                  ) : (
                    <Button 
                      disabled
                      className="w-full bg-blue-100 text-blue-600 cursor-not-allowed"
                    >
                      Pending
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 text-blue-600 hover:text-blue-700 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Load more alumni
          </button>
        </div>
      </div>
    </div>
  )
}

export default Network