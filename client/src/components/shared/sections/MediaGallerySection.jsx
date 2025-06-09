import React, { useState } from 'react';
import { Select } from '@/components/ui/select';
import PageHeader from '../layout/PageHeader';
import ContentCard from '../cards/ContentCard';
import { Icon } from '../icons/Icon';

/**
 * Media gallery section component for photos and videos
 * @param {string} title - Section title
 * @param {string} description - Section description
 * @param {Array} mediaItems - Array of media items (photos/videos)
 * @param {Function} onMediaClick - Function to handle clicking a media item
 * @param {boolean} showUpload - Whether to show the upload option
 * @param {Function} onUpload - Function to handle media upload
 * @param {Array} categories - Media categories for filtering
 */
const MediaGallerySection = ({
  title = "Photos & Videos",
  description = "Share and browse memories from your time at the institution.",
  mediaItems = [],
  onMediaClick,
  showUpload = false,
  onUpload,
  categories = ['All', 'Events', 'Campus', 'Classroom', 'Activities', 'Sports']
}) => {
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState('grid');
  
  // Filter media items by category
  const filteredMedia = filter === 'All' 
    ? mediaItems 
    : mediaItems.filter(item => item.category === filter);
  
  // Handle file selection
  const handleFileChange = (e) => {
    if (onUpload && e.target.files?.length > 0) {
      onUpload(e.target.files);
    }
  };
  
  return (
    <>
      <PageHeader 
        title={title} 
        description={description} 
      >
        {showUpload && (          <div className="mt-4">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
              <Icon name="upload" size={16} />
              Upload Media
              <input 
                type="file" 
                className="hidden" 
                accept="image/*,video/*" 
                multiple
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}
      </PageHeader>
      
      <div className="mb-6">
        <ContentCard>
          <div className="flex flex-col sm:flex-row gap-4 items-center">            <div className="flex space-x-2">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-md ${
                  view === 'grid' 
                    ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white' 
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
                aria-label="Grid view"
              >
                <Icon name="grid" size={18} />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-md ${
                  view === 'list' 
                    ? 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-white' 
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
                aria-label="List view"
              >
                <Icon name="list" size={18} />
              </button>
            </div>
              <div className="ml-auto">
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                options={categories.map(category => ({ value: category, label: category }))}
              />
            </div>
          </div>
        </ContentCard>
      </div>
      
      {filteredMedia.length > 0 ? (
        <div className={
          view === 'grid'
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            : "space-y-4"
        }>
          {filteredMedia.map((item, index) => (
            <div 
              key={index}
              className={
                view === 'grid'
                  ? "aspect-square cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                  : "cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
              }
              onClick={() => onMediaClick && onMediaClick(item)}
            >
              {view === 'grid' ? (
                <img 
                  src={item.thumbnail || item.url} 
                  alt={item.title || `Media ${index}`} 
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                    <img 
                      src={item.thumbnail || item.url} 
                      alt={item.title || `Media ${index}`} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {item.title || `Media ${index + 1}`}
                    </h3>
                    {item.date && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {item.date}
                      </p>
                    )}
                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <ContentCard>
          <div className="py-8 text-center text-slate-500">
            No media found matching your criteria.
          </div>
        </ContentCard>
      )}
    </>
  );
};

export default MediaGallerySection;
