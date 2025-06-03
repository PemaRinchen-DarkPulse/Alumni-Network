import React, { useState } from 'react';
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
 */
const DirectorySection = ({
  title,
  description,
  users = [],
  onUserContact,
  filterOptions = []
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
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {filterOptions.length > 0 && (
              <select
                className="rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="">Filter by tag</option>
                {filterOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        </ContentCard>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <UserProfileCard
              key={index}
              name={user.name}
              role={user.role}
              imageSrc={user.imageSrc}
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
    </>
  );
};

export default DirectorySection;
