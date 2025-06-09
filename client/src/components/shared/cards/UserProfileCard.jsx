import React from 'react';
import { UserAvatar } from '@/components/ui/user-avatar';

/**
 * User profile card component for alumni/teacher/student directories
 * @param {string} name - User's name
 * @param {string} role - User's role (alumni, teacher, student) * @param {string} profilePicture - URL to user's profile picture from database
 * @param {string} yearOrClass - Graduation year or class information
 * @param {string} field - Field of study or expertise
 * @param {Array} tags - Array of relevant tags for filtering
 * @param {boolean} isMentor - Whether the user is a mentor
 * @param {Function} onContactClick - Handler for contact button click
 */
const UserProfileCard = ({
  name,
  role,
  profilePicture,
  yearOrClass,
  field,
  tags = [],
  isMentor = false,
  onContactClick
}) => {
  // Create user object for UserAvatar component
  const user = {
    name,
    profilePicture
  };
  return (    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center space-x-4">        <UserAvatar 
          user={user} 
          size="lg"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-slate-900 dark:text-white">{name}</h3>
            {isMentor && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Mentor
              </span>
            )}
          </div>
          
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {role} {yearOrClass && `• ${yearOrClass}`}
          </p>
          
          {field && (
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
              {field}
            </p>
          )}
          
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {onContactClick && (
        <div className="mt-3 border-t border-slate-200 dark:border-slate-700 pt-3">
          <button 
            onClick={onContactClick}
            className="w-full rounded border border-primary bg-transparent py-1 text-center text-sm font-medium text-primary hover:bg-primary/5 dark:border-primary dark:hover:bg-primary/10"
          >
            Contact
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileCard;
