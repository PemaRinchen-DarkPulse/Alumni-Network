import React, { useState } from 'react';
import PageHeader from '../layout/PageHeader';
import ContentCard from '../cards/ContentCard';
import EventCard from '../cards/EventCard';

/**
 * Events section component for displaying upcoming and past events
 * @param {string} title - Section title
 * @param {string} description - Section description
 * @param {Array} events - Array of event objects
 * @param {Function} onRegister - Function to call when register button is clicked
 * @param {boolean} showFilters - Whether to show filtering options
 * @param {Array} categories - Event categories for filtering
 */
const EventsSection = ({
  title,
  description,
  events = [],
  onRegister,
  showFilters = true,
  categories = ['All', 'Networking', 'Workshop', 'Reunion', 'Webinar', 'Other']
}) => {
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState('upcoming');
  
  // Split events into upcoming and past
  const currentDate = new Date();
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= currentDate;
  });
  
  const pastEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate < currentDate;
  });
  
  // Filter by category if not 'All'
  const filteredEvents = (view === 'upcoming' ? upcomingEvents : pastEvents)
    .filter(event => filter === 'All' || event.category === filter);
  
  return (
    <>
      <PageHeader title={title} description={description} />
      
      {showFilters && (
        <div className="mb-6">
          <ContentCard>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex space-x-2">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    view === 'upcoming' 
                      ? 'bg-primary text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                  onClick={() => setView('upcoming')}
                >
                  Upcoming
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    view === 'past' 
                      ? 'bg-primary text-white' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                  }`}
                  onClick={() => setView('past')}
                >
                  Past
                </button>
              </div>
              
              <div className="ml-auto">
                <select
                  className="rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </ContentCard>
        </div>
      )}
      
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event, index) => (
            <EventCard
              key={index}
              title={event.title}
              date={event.date}
              time={event.time}
              location={event.location}
              description={event.description}
              imageSrc={event.image}
              onRegister={() => onRegister(event)}
              isPast={view === 'past'}
            />
          ))}
        </div>
      ) : (
        <ContentCard>
          <div className="py-8 text-center text-slate-500">
            {view === 'upcoming' 
              ? 'No upcoming events found.' 
              : 'No past events to display.'
            }
          </div>
        </ContentCard>
      )}
    </>
  );
};

export default EventsSection;
