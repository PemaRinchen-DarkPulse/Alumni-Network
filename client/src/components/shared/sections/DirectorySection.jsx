import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Icon from '@/components/shared/icons/Icon';
import { useAuth } from '@/contexts/auth';
import { getAllAlumni } from '@/services/directoryService';

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
    <Card className="w-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 p-0">
      <div className="relative">
        {/* Blue background banner */}
        <div className="w-full h-28 bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl"></div>
        
        {/* Profile picture overlapping the banner */}
        <div className="absolute left-1/2 transform -translate-x-1/2" style={{ top: "60%" }}>
          <Avatar className="size-30 ring-4 ring-white shadow-lg">
            <AvatarImage src={profilePicture} alt={name} />
            <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      {/* Content starts below the overlapping avatar */}
      <div className="flex flex-col items-center px-6 pt-20 pb-2">
        
        <h3 className="font-bold text-center text-lg text-gray-800">{name}</h3>
        <p className="text-indigo-600 text-sm font-medium text-center">Batch of {batch}</p>
        
        {/* Social Links */}
        <div className="flex justify-center gap-4 mt-4 mb-2">
          {/* Email is separate from socialLinks in the user model */}
          {email && (
            <a 
              href={`mailto:${email}`} 
              aria-label="Email"
              className="bg-gray-100 p-2 rounded-full hover:bg-indigo-100 transition-colors duration-200"
            >
              <Icon name="mail" className="text-gray-500 hover:text-indigo-600" />
            </a>
          )}
          
          {socialLinks?.linkedin && (
            <a 
              href={socialLinks.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn"
              className="bg-gray-100 p-2 rounded-full hover:bg-indigo-100 transition-colors duration-200"
            >
              <Icon name="linkedin" className="text-gray-500 hover:text-indigo-600" />
            </a>
          )}
          
          {socialLinks?.facebook && (
            <a 
              href={socialLinks.facebook} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Facebook"
              className="bg-gray-100 p-2 rounded-full hover:bg-indigo-100 transition-colors duration-200"
            >
              <Icon name="facebook" className="text-gray-500 hover:text-indigo-600" />
            </a>
          )}
        </div>
      </div>
      
      <CardFooter className="flex gap-3 p-4 pt-3 pb-6">
        <Button 
          variant="outline" 
          className="flex-1 border-gray-200 hover:bg-gray-50 font-medium"
          onClick={() => onViewDetails(alumni._id)}
        >
          View Details
        </Button>
        <Button 
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-md"
          onClick={() => onConnect(alumni._id)}
        >
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
};

const DirectorySection = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const auth = useAuth();
  const user = auth?.user;
  
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
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] bg-gradient-to-b from-white to-gray-50 rounded-xl p-8">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Loading alumni directory...</p>
      </div>
    );
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
    <div className="container mx-auto py-8 px-3">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold mb-3 text-gray-800 relative inline-block">
          Alumni Directory
          <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600 transform -translate-y-1"></span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">Connect with fellow alumni and expand your professional network</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-5">
        {alumni.map((alumnus, index) => (
          <div 
            key={alumnus._id} 
            className="transform transition-all duration-500"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
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
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default DirectorySection;