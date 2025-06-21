import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAlumniById } from '@/services/directoryService';

const AlumniDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alumnus, setAlumnus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlumniDetails = async () => {
      try {
        setLoading(true);
        const response = await getAlumniById(id);
        
        if (response.success) {
          setAlumnus(response.data.data.alumnus);
        } else {
          setError(response.error || 'Failed to fetch alumni details');
        }
      } catch (err) {
        setError('Failed to fetch alumni details');
        console.error('Error fetching alumni details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumniDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !alumnus) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-2xl font-bold mb-4">Alumni Not Found</h2>
        <p className="text-gray-600 mb-8">{error || "We couldn't find the alumni you're looking for."}</p>
        <button
          onClick={() => navigate('/dashboard/directory')}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard/directory')}
        className="flex items-center text-gray-600 hover:text-primary mb-6"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Directory
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col md:flex-row">
          {/* Profile Picture and Basic Info */}
          <div className="md:w-1/3 mb-6 md:mb-0 md:pr-8">
            <div className="w-32 h-32 mx-auto md:mx-0 md:w-48 md:h-48 rounded-full overflow-hidden mb-4">
              {alumnus.profilePicture ? (
                <img 
                  src={alumnus.profilePicture} 
                  alt={alumnus.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
                  {alumnus.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold mb-1">{alumnus.name}</h1>
              <p className="text-gray-600">{alumnus.currentOccupation || 'Alumni'}</p>
              <p className="text-gray-600 mb-4">Batch: {alumnus.batch || 'N/A'}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                {alumnus.socialLinks?.linkedin && (
                  <a 
                    href={alumnus.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    LinkedIn
                  </a>
                )}
                
                {alumnus.socialLinks?.github && (
                  <a 
                    href={alumnus.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-900"
                  >
                    GitHub
                  </a>
                )}
                
                <a 
                  href={`mailto:${alumnus.email}`}
                  className="inline-flex items-center px-3 py-1 bg-primary text-white rounded hover:bg-primary/90"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
          
          {/* Details */}
          <div className="md:w-2/3 border-t pt-6 md:pt-0 md:border-t-0 md:border-l md:pl-8">
            {alumnus.bio && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Bio</h2>
                <p className="text-gray-700">{alumnus.bio}</p>
              </div>
            )}
            
            {/* Contact Info */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 font-medium">Email</p>
                  <p>{alumnus.email}</p>
                </div>
                {alumnus.phone && (
                  <div>
                    <p className="text-gray-600 font-medium">Phone</p>
                    <p>{alumnus.phone}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Mentorship Availability */}
            {alumnus.networkingPreferences && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Networking Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                  <div className={`flex items-center ${alumnus.networkingPreferences.openToMentoring ? 'text-green-600' : 'text-gray-400'}`}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={alumnus.networkingPreferences.openToMentoring ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path>
                    </svg>
                    <span>Open to Mentoring</span>
                  </div>
                  
                  <div className={`flex items-center ${alumnus.networkingPreferences.providingInternships ? 'text-green-600' : 'text-gray-400'}`}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={alumnus.networkingPreferences.providingInternships ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path>
                    </svg>
                    <span>Providing Internships</span>
                  </div>
                  
                  <div className={`flex items-center ${alumnus.networkingPreferences.attendingSchoolTalks ? 'text-green-600' : 'text-gray-400'}`}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={alumnus.networkingPreferences.attendingSchoolTalks ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path>
                    </svg>
                    <span>Available for School Talks</span>
                  </div>
                  
                  <div className={`flex items-center ${alumnus.networkingPreferences.availableForCareerAdvice ? 'text-green-600' : 'text-gray-400'}`}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={alumnus.networkingPreferences.availableForCareerAdvice ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path>
                    </svg>
                    <span>Available for Career Advice</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniDetailPage;
