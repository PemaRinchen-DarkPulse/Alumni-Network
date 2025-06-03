import React from 'react';
import { formatDate } from '@/lib/utils';

/**
 * Event card component for displaying event information
 * @param {string} title - Event title
 * @param {string | Date} date - Event date
 * @param {string} time - Event time
 * @param {string} location - Event location
 * @param {string} description - Event description
 * @param {string} imageSrc - URL to event image
 * @param {Function} onRegister - Function to call when register button is clicked
 * @param {boolean} isPast - Whether this is a past event
 */
const EventCard = ({
  title,
  date,
  time,
  location,
  description,
  imageSrc,
  onRegister,
  isPast = false
}) => {
  // Format the date if it's a Date object
  const formattedDate = date instanceof Date ? formatDate(date) : date;
  
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      {imageSrc && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={imageSrc} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
          {formattedDate && (
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span>{formattedDate}</span>
            </div>
          )}
          
          {time && (
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{time}</span>
            </div>
          )}
          
          {location && (
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{location}</span>
            </div>
          )}
        </div>
        
        {description && (
          <p className="mt-3 text-slate-600 dark:text-slate-300">{description}</p>
        )}
        
        {onRegister && (
          <div className="mt-4 flex justify-end">
            <button 
              onClick={onRegister}
              className={`rounded px-4 py-2 text-sm font-medium ${
                isPast 
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              {isPast ? 'View Details' : 'Register'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
