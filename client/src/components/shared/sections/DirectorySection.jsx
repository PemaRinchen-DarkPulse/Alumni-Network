import React, { useState } from 'react';
import { Select } from '@/components/ui/select';
import { Icon } from '@/components/shared/icons/Icon';
import PageHeader from '../layout/PageHeader';
import ContentCard from '../cards/ContentCard';
import UserProfileCard from '../cards/UserProfileCard';

/**
 * Directory section component for alumni/teacher/student directories
 * @param {string} title - The section title
 * @param {string} description - The section description
 * @param {Array} users - Array of user objects to display
 * @param {Function} onUserContact - Handler for user contact button click
 * @param {Array} filterOptions - Options for filtering users
 * @param {number} currentPage - Current page number for pagination
 * @param {number} totalPages - Total number of pages
 * @param {Function} onPageChange - Handler for page change
 * @param {boolean} loading - Loading state
 */
const DirectorySection = ({
  title,
  description,
  users = [],
  onUserContact,
  filterOptions = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  
  // Filter users based on search term and selected filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.field && user.field.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesFilter = selectedFilter === '' || 
      (user.tags && user.tags.includes(selectedFilter));
      
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <PageHeader title={title} description={description} />
      
      <div className="mb-6">
        <ContentCard>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search by name or field..."
                className="w-full rounded-md border border-slate-300 px-4 py-2 pr-8 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />              <Icon name="search" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
              {filterOptions.length > 0 && (
              <Select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                options={[
                  { value: '', label: 'Filter by tag' },
                  ...filterOptions.map(option => ({ value: option, label: option }))
                ]}
              />
            )}
          </div>
        </ContentCard>
      </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-lg p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-12 w-12"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <UserProfileCard
              key={user._id || index}
              name={user.name}
              role={user.role}
              profilePicture={user.profilePicture}
              yearOrClass={user.yearOrClass}
              field={user.field}
              tags={user.tags}
              isMentor={user.isMentor}
              onContactClick={() => onUserContact(user)}
            />
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-slate-500">
            No users found matching your criteria.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-slate-500 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  page === currentPage
                    ? 'bg-primary text-white'
                    : 'text-slate-500 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-slate-500 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </>
  );
};

export default DirectorySection;
