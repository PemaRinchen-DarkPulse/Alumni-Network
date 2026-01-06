import React, { useState, useEffect } from 'react'
import { Search, Filter, Mail, Grid3x3, List, ChevronDown } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Select } from '../components/ui/select'
import { userAPI, connectionAPI } from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useAuth } from '../contexts/auth'

const Network = () => {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('relevance')
  const [filters, setFilters] = useState({
    batchYear: '',
    department: '',
    role: '',
    industry: ''
  })
  const [alumniData, setAlumniData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [connectionStatuses, setConnectionStatuses] = useState({}) // Track connection states

  // Generate batch years from 2016 to current year
  const currentYear = new Date().getFullYear()
  const batchYears = []
  for (let year = 2016; year <= currentYear; year++) {
    batchYears.push(year)
  }

  // Fetch users from the backend
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const filterParams = {}
      if (user?.email) {
        filterParams.currentUserEmail = user.email
      }
      
      const result = await userAPI.getAllUsers(filterParams)
      
      if (result.success) {
        // Transform backend data to match the UI format
        const transformedData = result.data.map(user => ({
          id: user.id,
          name: user.name,
          role: formatRole(user.role),
          year: user.batch || 'N/A',
          title: '', // These fields would need to be added to the User model
          company: '',
          location: '',
          skills: [],
          status: 'connect',
          bgColor: getRandomGradient(),
          image: null
        }))
        setAlumniData(transformedData)
        
        // Fetch connection statuses for all users
        if (user?.id) {
          await fetchConnectionStatuses(transformedData.map(u => u.id))
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load users. Please try again later.')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch connection statuses for all displayed users
  const fetchConnectionStatuses = async (userIds) => {
    if (!user?.id) return

    const statuses = {}
    
    // Fetch statuses for each user
    for (const userId of userIds) {
      if (userId !== user.id) {
        try {
          const result = await connectionAPI.getConnectionStatus(user.id, userId)
          if (result.success) {
            statuses[userId] = result.status
          }
        } catch (err) {
          console.error(`Error fetching connection status for user ${userId}:`, err)
        }
      }
    }
    
    setConnectionStatuses(statuses)
  }

  // Helper function to generate random gradient colors
  const getRandomGradient = () => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-emerald-400 to-teal-600',
      'from-orange-400 to-rose-500',
      'from-slate-700 to-slate-900',
      'from-pink-400 to-purple-500',
      'from-amber-400 to-orange-600',
      'from-cyan-400 to-blue-600',
      'from-violet-500 to-purple-700'
    ]
    return gradients[Math.floor(Math.random() * gradients.length)]
  }

  // Helper function to format role for display
  const formatRole = (role) => {
    if (!role) return ''
    // Convert STUDENT -> Student, ALUMNI -> Alumni, TEACHER -> Teacher
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
  }



  const handleClearFilters = () => {
    setFilters({
      batchYear: '',
      department: '',
      role: '',
      industry: ''
    })
    fetchUsers()
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const filterParams = {}
      if (user?.email) {
        filterParams.currentUserEmail = user.email
      }
      if (searchQuery) filterParams.search = searchQuery
      if (filters.batchYear) filterParams.batch = filters.batchYear
      if (filters.role) filterParams.role = filters.role
      
      const result = await userAPI.getAllUsers(filterParams)
      
      if (result.success) {
        const transformedData = result.data.map(user => ({
          id: user.id,
          name: user.name,
          role: formatRole(user.role),
          year: user.batch || 'N/A',
          title: '',
          company: '',
          location: '',
          skills: [],
          status: 'connect',
          bgColor: getRandomGradient(),
          image: null
        }))
        setAlumniData(transformedData)
        
        // Fetch connection statuses for search results
        if (user?.id) {
          await fetchConnectionStatuses(transformedData.map(u => u.id))
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Search failed. Please try again.')
      console.error('Error searching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (receiverId) => {
    console.log('=== Connection Request Debug ===')
    console.log('User object:', user)
    console.log('User ID:', user?.id)
    console.log('Receiver ID:', receiverId)
    
    if (!user || !user.id) {
      const errorMsg = 'You must be logged in to send connection requests'
      console.error(errorMsg)
      setError(errorMsg)
      return
    }

    try {
      // Update UI immediately to show pending state
      setConnectionStatuses(prev => ({
        ...prev,
        [receiverId]: 'PENDING'
      }))

      console.log('Sending connection request from:', user.id, 'to:', receiverId)
      const result = await connectionAPI.sendConnectionRequest(user.id, receiverId)
      console.log('Connection request result:', result)
      
      if (result.success) {
        // Connection request sent successfully
        console.log('✅ Connection request sent successfully:', result.message)
      } else {
        // Revert UI state on error
        console.error('❌ Connection request failed:', result.error)
        setConnectionStatuses(prev => ({
          ...prev,
          [receiverId]: 'NONE'
        }))
        setError(result.error || 'Failed to send connection request')
      }
    } catch (err) {
      // Revert UI state on error
      console.error('❌ Exception sending connection request:', err)
      setConnectionStatuses(prev => ({
        ...prev,
        [receiverId]: 'NONE'
      }))
      setError('Failed to send connection request. Please try again.')
    }
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
            <Button 
              onClick={handleSearch}
              className="h-12 px-8 bg-blue-600 hover:bg-blue-700"
            >
              Search
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={fetchUsers}
              className="mt-2 bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && alumniData.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No users found. Try adjusting your filters.</p>
          </div>
        )}

        {/* All Connected State */}
        {!loading && !error && alumniData.length > 0 && alumniData.filter(alumni => connectionStatuses[alumni.id] !== 'ACCEPTED' && connectionStatuses[alumni.id] !== 'PENDING').length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">You're already connected with all available users!</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters to find more users.</p>
          </div>
        )}

        {/* Alumni Grid */}
        {!loading && !error && alumniData.length > 0 && alumniData.filter(alumni => connectionStatuses[alumni.id] !== 'ACCEPTED' && connectionStatuses[alumni.id] !== 'PENDING').length > 0 && (
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'} mb-8`}>
          {alumniData
            .filter(alumni => connectionStatuses[alumni.id] !== 'ACCEPTED' && connectionStatuses[alumni.id] !== 'PENDING')
            .map((alumni) => (
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
                  {(alumni.role === 'Alumni' || alumni.role === 'Student') && alumni.year && alumni.year !== 'N/A' && (
                    <span className="text-xs text-blue-600 font-medium">Batch {alumni.year}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-auto">
                  {connectionStatuses[alumni.id] === 'PENDING' ? (
                    <Button 
                      disabled
                      className="w-full bg-yellow-100 text-yellow-600 cursor-not-allowed"
                    >
                      Pending
                    </Button>
                  ) : connectionStatuses[alumni.id] === 'ACCEPTED' ? (
                    <Button 
                      disabled
                      className="w-full bg-green-100 text-green-600 cursor-not-allowed"
                    >
                      Connected
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleConnect(alumni.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Load More Button */}
        {!loading && !error && alumniData.length > 0 && alumniData.filter(alumni => connectionStatuses[alumni.id] !== 'ACCEPTED' && connectionStatuses[alumni.id] !== 'PENDING').length > 0 && (
        <div className="text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 text-blue-600 hover:text-blue-700 font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Load more alumni
          </button>
        </div>
        )}
      </div>
    </div>
  )
}

export default Network