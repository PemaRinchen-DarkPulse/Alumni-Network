import React from 'react';
import { formatDate } from '@/lib/utils';
import { Icon } from '@/components/shared/icons/Icon';

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
        
        <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">          {formattedDate && (
            <div className="flex items-center gap-1">
              <Icon name="calendar" size={16} />
              <span>{formattedDate}</span>
            </div>
          )}
            {time && (
            <div className="flex items-center gap-1">
              <Icon name="clock" size={16} />
              <span>{time}</span>
            </div>
          )}
            {location && (
            <div className="flex items-center gap-1">
              <Icon name="map-pin" size={16} />
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
