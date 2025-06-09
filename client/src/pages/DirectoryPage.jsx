import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import DirectorySection from '@/components/shared/sections/DirectorySection';
import { getUsersDirectory } from '@/services/settingsService';
import { Icon } from '@/components/shared/icons/Icon';

const DirectoryPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const userRole = user?.role || 'teacher';
  
  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        limit: 12, // Show 12 users per page
      };
      
      // Filter by role if needed - show all roles for now
      // You can add role filtering logic here if needed
      
      const response = await getUsersDirectory(params);
      
      if (response.success) {
        setUsers(response.data.users || []);
        setCurrentPage(response.data.currentPage || 1);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setError(response.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to fetch users: ' + err.message);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleUserContact = (contactUser) => {
    console.log('Contact user:', contactUser);
    // TODO: Implement contact functionality
    // This could open a modal, navigate to a messaging page, etc.
  };
  
  const handlePageChange = (page) => {
    fetchUsers(page);
  };
  
  // Generate filter options based on available fields
  const getFilterOptions = () => {
    const fields = [...new Set(users.map(user => user.field).filter(Boolean))];
    return fields.map(field => ({ value: field, label: field }));
  };
  
  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading directory...</p>
        </div>
      </div>
    );
  }
  
  if (error && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Icon name="alert-circle" size={48} className="mx-auto" />
          </div>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => fetchUsers()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <DirectorySection 
      title={`${userRole === 'teacher' ? 'Alumni' : userRole === 'student' ? 'Alumni' : 'Alumni'} Directory`}
      description={userRole === 'teacher' 
        ? "View and manage alumni information." 
        : userRole === 'student' 
          ? "Connect with graduates from your institution."
          : "Connect with fellow alumni from your institution."
      }
      users={users}
      onUserContact={handleUserContact}
      filterOptions={getFilterOptions()}
      // Add pagination props if DirectorySection supports it
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      loading={loading}
    />
  );
};

export default DirectoryPage;
