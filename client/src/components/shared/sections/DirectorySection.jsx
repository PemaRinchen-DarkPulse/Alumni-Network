import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllAlumni } from '@/services/directoryService';
import { useAuth } from '@/contexts/auth';
import PageHeader from '../layout/PageHeader';
import ContentCard from '../cards/ContentCard';

const DirectorySection = () => {  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedOccupation, setSelectedOccupation] = useState('');
  const { user: currentUser } = useAuth();
    // Constants for the header
  const headerTitle = "Alumni Directory";
  const headerDescription = "Connect with fellow alumni from your institution.";

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        const response = await getAllAlumni();
        
        if (response.success) {          // Filter out the current user from the alumni list
          const filteredAlumni = response.data.data.alumni.filter(
            alumnus => alumnus._id !== currentUser?.id && alumnus.id !== currentUser?.id
          );
          setAlumni(filteredAlumni);
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
  }, [currentUser]);
  
  if (loading) {
    return (
      <>
        <PageHeader title={headerTitle} description={headerDescription} />
        
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 relative">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          
          <p className="text-center mt-4 text-slate-500">Loading alumni profiles...</p>
        </div>
      </>
    );
  }  if (error) {
    return (
      <>
        <PageHeader title={headerTitle} description={headerDescription} />
        
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
      </>    );
  }
  // Get unique batch years for filter dropdown
  const uniqueBatches = [...new Set(alumni.map(person => person.batch).filter(Boolean))].sort();
  
  // Get unique occupations for filter dropdown
  const uniqueOccupations = [...new Set(alumni.map(person => person.currentOccupation).filter(Boolean))].sort();
  
  const filteredAlumni = alumni.filter(person => {
    // Text search filter
    const matchesSearch = !searchTerm || 
      person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.currentOccupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.batch?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Batch filter
    const matchesBatch = !selectedBatch || person.batch === selectedBatch;
    
    // Occupation filter
    const matchesOccupation = !selectedOccupation || person.currentOccupation === selectedOccupation;
    
    // Return true only if all active filters match
    return matchesSearch && matchesBatch && matchesOccupation;
  });
  
  return (
    <>
      {/* Page Title and Search Bar */}      <PageHeader title={headerTitle} description={headerDescription} />
      
      <div className="mb-6">
        <ContentCard>
          <div className="flex items-center gap-3">
            {/* Search Bar - 50% width */}
            <div className="relative w-1/2">
              <input
                type="text"
                placeholder="Search alumni..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-4 py-2 pr-8 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white"
              />
              <svg 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            
            {/* Filter dropdowns container - 50% width combined */}
            <div className="flex w-1/2 gap-3">
              {/* Batch Filter */}
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-1/2 rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white text-sm"
                aria-label="Filter by batch"
              >
                <option value="">Batch: All</option>
                {uniqueBatches.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
              
              {/* Occupation Filter */}
              <select
                value={selectedOccupation}
                onChange={(e) => setSelectedOccupation(e.target.value)}
                className="w-1/2 rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white text-sm"
                aria-label="Filter by occupation"
              >
                <option value="">Role: All</option>
                {uniqueOccupations.map(occupation => (
                  <option key={occupation} value={occupation}>{occupation}</option>
                ))}
              </select>
            </div>
            
            {/* Clear Filters Button - Only show when filters are applied */}
            {(searchTerm || selectedBatch || selectedOccupation) && (
              <div className="flex-none">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedBatch('');
                    setSelectedOccupation('');
                  }}
                  className="text-xs text-primary hover:text-primary/80 font-medium flex items-center whitespace-nowrap px-2 py-1.5 border border-primary/20 rounded-md"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  Clear
                </button>
              </div>
            )}
          </div>
        </ContentCard>
      </div>{/* Results Information - More subtle counter */}      <div className="flex justify-center mb-4">
        <div className="text-sm text-slate-500">
          Showing {filteredAlumni.length} alumni
          {selectedBatch && ` from batch ${selectedBatch}`}
          {selectedOccupation && ` in ${selectedOccupation}`}
          {(searchTerm || selectedBatch || selectedOccupation) && 
            ` (filtered from ${alumni.length} total)`}
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
          <h2 className="text-2xl font-bold mb-3">No alumni found</h2>          <p className="text-gray-500 mb-6">
            {alumni.length > 0 
              ? 'We couldn\'t find alumni matching your filter criteria. Try adjusting your filters or browsing the full directory.' 
              : 'No alumni are registered in the system yet. Check back soon!'}
          </p>
          {alumni.length > 0 && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedBatch('');
                setSelectedOccupation('');
              }}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              View All Alumni
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">          {filteredAlumni.map((person) => (
            <div
              key={person._id} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col min-h-[450px]"
            >
              {/* Use flex with h-full to create a proper layout structure */}
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
                    )}</div>
                  
                  {/* Bio Section */}
                  <div className="px-6 pb-4">
                    {person.bio ? (
                      <p className="text-gray-600 text-sm h-16 overflow-hidden text-ellipsis">
                        {person.bio}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm italic">No bio available</p>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons - Always at the bottom */}                <div className="px-6 py-4 mt-auto border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Link 
                      to={`/dashboard/alumni/${person._id}`} 
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
            </div>          ))}
        </div>
      )}
    </>
  );
};

export default DirectorySection;