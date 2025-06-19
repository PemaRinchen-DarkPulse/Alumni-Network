import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllAlumni } from '@/services/directoryService';

const DirectorySection = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        const response = await getAllAlumni();
        
        if (response.success) {
          setAlumni(response.data.data.alumni);
        } else {
          setError(response.error || 'Failed to fetch alumni directory');
        }
      } catch (err) {
        setError('Failed to fetch alumni directory');
        console.error('Error fetching alumni:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Alumni Directory</h1>
          <p className="text-gray-600 mb-10">Connect with fellow alumni from your institution.</p>
        </div>
        
        <div className="flex justify-center items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        
        <p className="text-center mt-4 text-gray-500">Loading alumni profiles...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Alumni Directory</h1>
          <p className="text-gray-600 mb-10">Connect with fellow alumni from your institution.</p>
        </div>
        
        <div className="max-w-md mx-auto text-center p-6 bg-white rounded-xl shadow-md">
          <div className="w-16 h-16 bg-red-50 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Directory</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary/90 transition-colors inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }
  const filteredAlumni = alumni.filter(person => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      person.name?.toLowerCase().includes(search) ||
      person.currentOccupation?.toLowerCase().includes(search) ||
      person.batch?.toLowerCase().includes(search) ||
      person.bio?.toLowerCase().includes(search)
    );
  });
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Title and Search Bar */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Alumni Directory</h1>
        <p className="text-gray-600 mb-10">Connect with fellow alumni from your institution.</p>
        
        <div className="max-w-xl mx-auto relative">
          <div className="flex items-center border border-gray-300 rounded-full bg-white shadow-sm">
            <div className="pl-4">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search alumni by name, batch, occupation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-4 rounded-full focus:outline-none text-gray-700"
            />
          </div>
        </div>
      </div>
        {/* Results Information - More subtle counter */}
      <div className="flex justify-center mb-6">
        <div className="text-sm text-gray-500">
          Showing {filteredAlumni.length} alumni
        </div>
      </div>
        {/* Alumni Cards */}
      {filteredAlumni.length === 0 ? (
        <div className="text-center py-16 max-w-lg mx-auto">
          <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3">No alumni found</h2>
          <p className="text-gray-500 mb-6">
            {alumni.length > 0 
              ? 'We couldn\'t find alumni matching your search criteria. Try adjusting your search or browsing the full directory.' 
              : 'No alumni are registered in the system yet. Check back soon!'}
          </p>
          {alumni.length > 0 && (
            <button 
              onClick={() => setSearchTerm('')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              View All Alumni
            </button>
          )}
        </div>) : (        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((person) => (
            <div              key={person._id} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col min-h-[450px]"
            >              {/* Use flex with h-full to create a proper layout structure */}
              <div className="flex flex-col h-full">
                {/* Top content area */}
                <div className="flex-grow">
                  {/* Profile Header */}
                  <div className="flex flex-col items-center pt-8 pb-4">
                    {/* Circular Profile Picture */}
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm mb-4">
                      {person.profilePicture ? (
                        <img 
                          src={person.profilePicture} 
                          alt={person.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/60 to-primary flex items-center justify-center text-white text-2xl font-bold">
                          {person.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    {/* User Name and Batch */}
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{person.name}</h3>
                    <div className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 mb-3">
                      Batch: {person.batch || 'N/A'}
                    </div>
                    
                    {/* Current Occupation */}
                    {person.currentOccupation && (
                      <p className="text-primary font-medium text-sm mb-3">{person.currentOccupation}</p>
                    )}

                    {/* Mentoring Badge */}
                    {person.networkingPreferences?.openToMentoring && (
                      <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium mb-3 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        Available for mentoring
                      </div>
                    )}
                  </div>
                    
                  {/* Bio Section */}
                  <div className="px-6 pb-4">
                    {person.bio ? (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {person.bio}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm italic">No bio available</p>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons - Always at the bottom */}
                <div className="px-6 py-4 mt-auto border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Link 
                      to={`/alumni/${person._id}`} 
                      className="flex-1 text-center py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      View Profile
                    </Link>
                    <a 
                      href={`mailto:${person.email}?subject=Connection Request&body=Hello ${person.name}, I'd like to connect with you.`}
                      className="flex-1 text-center py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Connect
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DirectorySection;