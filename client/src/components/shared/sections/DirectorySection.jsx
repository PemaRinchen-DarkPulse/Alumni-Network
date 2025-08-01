import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Icon from '@/components/shared/icons/Icon';
import { SectionLoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/auth';
import { getAllAlumni } from '@/services/directoryService';
import SectionHero from '@/components/shared/layout/SectionHero';

const AlumniCard = ({ alumni, onConnect, onViewDetails }) => {
  const { name, profilePicture, batch, email, socialLinks = {} } = alumni;
  
  // Get initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border-0 p-0 group relative backdrop-blur-sm">
      {/* Gradient overlay for premium feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Profile Image Section - Enhanced design */}
      <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {profilePicture ? (
          <img 
            src={profilePicture} 
            alt={name}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out filter group-hover:brightness-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Icon name="user" className="text-indigo-500" size={36} />
            </div>
          </div>
        )}
        
        {/* Subtle overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
        
        {/* Floating badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="text-xs font-semibold text-indigo-600">Alumni</span>
        </div>
      </div>
      
      {/* Content Section - Modern spacing and typography */}
      <div className="relative flex flex-col justify-between h-36 p-5 bg-gradient-to-b from-white to-gray-50/30">
        {/* User Info with enhanced styling */}
        <div className="text-center space-y-2">
          {/* Name with gradient hover effect */}
          <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {name}
          </h3>
          
          {/* Batch Information with decorative elements */}
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
            <p className="text-sm font-medium">
              Batch of {batch}
            </p>
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
          </div>
        </div>
        
        {/* Action Buttons - Premium design */}
        <div className="flex gap-3 mt-4 mb-6">
          <Button 
            className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-2.5 text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
            onClick={() => onViewDetails(alumni._id)}
          >
            View Details
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 border-2 border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-gray-50 hover:border-indigo-200 text-gray-700 hover:text-indigo-700 font-semibold py-2.5 text-sm rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            onClick={() => onConnect(alumni._id)}
          >
            Connect
          </Button>
        </div>
      </div>
    </Card>
  );
};

const DirectorySection = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const auth = useAuth();
  const user = auth?.user;
  
  // Calculate pagination
  const cardsPerRow = 4;
  const rowsPerPage = 2;
  const itemsPerPage = cardsPerRow * rowsPerPage; // 8 items per page
  
  const itemsToShow = currentPage * itemsPerPage;
  const displayedAlumni = alumni.slice(0, itemsToShow);
  const hasMoreItems = alumni.length > itemsToShow;
  
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        setLoading(true);
        
        // Get current user ID in several formats to ensure we can match it correctly
        let userId = null;
        
        if (auth && auth.user) {
          userId = auth.user._id || auth.user.id;
        }
        
        console.log('Current authenticated user:', auth?.user);
        
        // Fetch alumni with the exclude parameter (may not be implemented on server yet)
        const response = await getAllAlumni(userId);
        
        if (response.success) {
          // Get the alumni from the API response
          const alumniList = response.data.data.alumni || [];
          
          console.log('Alumni from API:', alumniList.length);
          
          // Apply client-side filtering to ensure current user is excluded
          let filteredAlumni = alumniList;
          
          if (userId) {
            // Convert ID to string for safer comparison
            const userIdStr = String(userId);
            
            // Exclude current user by ID
            filteredAlumni = alumniList.filter(alum => {
              const alumIdStr = String(alum._id);
              const isCurrentUser = alumIdStr === userIdStr;
              
              if (isCurrentUser) {
                console.log('Found and excluding current user:', alum.name);
              }
              
              return !isCurrentUser;
            });
            
            console.log('Alumni after filtering:', filteredAlumni.length);
          }
          
          setAlumni(filteredAlumni);
        } else {
          setError(response.error || 'Failed to fetch alumni directory');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlumni();
  }, [auth, auth?.user]);
  
  const handleConnect = (alumniId) => {
    // Implement connection request logic here
    console.log(`Connect with alumni ID: ${alumniId}`);
    // You would typically call an API endpoint to send a connection request
  };
  
  const handleViewDetails = (alumniId) => {
    // Implement view details logic (redirect or modal)
    console.log(`View details for alumni ID: ${alumniId}`);
    // You could navigate to a profile page or open a modal
    window.location.href = `/alumni/${alumniId}`;
  };
  
  if (loading) {
    return <SectionLoadingSpinner section="directory" />;
  }
  
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] bg-red-50 rounded-xl p-8 border border-red-100">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Icon name="alert-triangle" className="text-red-500" size={28} />
        </div>
        <p className="text-red-600 font-medium mb-2">Unable to load alumni directory</p>
        <p className="text-red-500 text-sm max-w-md text-center">{error}</p>
      </div>
    );
  }
  
  if (alumni.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] bg-gradient-to-b from-white to-gray-50 rounded-xl p-8">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
          <Icon name="users" className="text-indigo-500" size={28} />
        </div>
        <p className="text-gray-600 font-medium mb-2">No alumni found</p>
        <p className="text-gray-500 text-sm max-w-md text-center">The alumni directory is currently empty or no alumni match your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Enhanced Header Section */}
      <div className="mb-12">
        <SectionHero 
          title="Alumni Directory"
          description="Connect with fellow alumni and expand your professional network. Discover opportunities, share experiences, and build meaningful connections."
          icon="users"
          gradient="from-indigo-500 to-purple-600"
        />
      </div>
      
      {/* Enhanced Grid with staggered animations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedAlumni.map((alumnus, index) => (
          <div 
            key={alumnus._id} 
            className="transform transition-all duration-700"
            style={{ 
              animationDelay: `${index * 150}ms`,
              animation: 'slideInUp 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards'
            }}
          >
            <AlumniCard
              alumni={alumnus}
              onConnect={handleConnect}
              onViewDetails={handleViewDetails}
            />
          </div>
        ))}
      </div>
      
      {/* Enhanced Show More/Show Less Buttons */}
      {(hasMoreItems || currentPage > 1) && (
        <div className="flex justify-center mt-12">
          <div className="flex gap-4">
            {currentPage > 1 && (
              <Button 
                onClick={() => setCurrentPage(1)}
                variant="outline"
                className="border-2 border-indigo-200 bg-white/80 backdrop-blur-sm text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 font-semibold px-8 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Icon name="chevron-up" className="mr-2" size={16} />
                Show Less
              </Button>
            )}
            
            {hasMoreItems && (
              <Button 
                onClick={() => setCurrentPage(currentPage + 1)}
                className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:via-indigo-800 hover:to-purple-800 text-white font-semibold px-8 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-0"
              >
                Show More
                <Icon name="chevron-down" className="ml-2" size={16} />
              </Button>
            )}
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* Subtle background pattern */
        .container {
          background-image: 
            radial-gradient(circle at 25px 25px, rgba(99, 102, 241, 0.03) 2%, transparent 0%), 
            radial-gradient(circle at 75px 75px, rgba(168, 85, 247, 0.03) 2%, transparent 0%);
          background-size: 100px 100px;
        }
      `}</style>
    </div>
  );
};

export default DirectorySection;