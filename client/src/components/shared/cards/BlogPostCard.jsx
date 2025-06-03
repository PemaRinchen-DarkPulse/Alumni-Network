import React from 'react';
import { formatDate } from '@/lib/utils';

/**
 * Blog post card component for displaying article previews
 * @param {string} title - Blog post title
 * @param {string} excerpt - Brief excerpt from the post
 * @param {string | Date} date - Publication date
 * @param {Object} author - Author object with name and image
 * @param {Array} tags - Array of topic tags
 * @param {string} imageSrc - URL to blog post featured image
 * @param {Function} onClick - Function to call when clicking on the post
 */
const BlogPostCard = ({
  title,
  excerpt,
  date,
  author,
  tags = [],
  imageSrc,
  onClick
}) => {
  // Format the date if it's a Date object
  const formattedDate = date instanceof Date ? formatDate(date) : date;
  
  return (
    <div 
      className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
      onClick={onClick}
    >
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
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white line-clamp-2">{title}</h3>
        
        {excerpt && (
          <p className="mt-2 text-slate-600 dark:text-slate-300 line-clamp-3">{excerpt}</p>
        )}
        
        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700">
          {author && (
            <div className="flex items-center gap-2">
              {author.image && (
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <img 
                    src={author.image} 
                    alt={author.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {author.name}
              </span>
            </div>
          )}
          
          {formattedDate && (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {formattedDate}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
