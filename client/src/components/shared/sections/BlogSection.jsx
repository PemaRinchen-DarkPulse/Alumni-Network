import React, { useState } from 'react';
import PageHeader from '../layout/PageHeader';
import ContentCard from '../cards/ContentCard';
import BlogPostCard from '../cards/BlogPostCard';

/**
 * Blog section component for displaying blog posts
 * @param {string} title - Section title
 * @param {string} description - Section description
 * @param {Array} posts - Array of blog post objects
 * @param {Function} onPostClick - Function to call when a post is clicked
 * @param {Boolean} showAddPost - Whether to show the add post button
 * @param {Function} onAddPost - Function to call when add post button is clicked
 * @param {Array} categories - Blog post categories for filtering
 */
const BlogSection = ({
  title,
  description,
  posts = [],
  onPostClick,
  showAddPost = false,
  onAddPost,
  categories = ['All', 'Career', 'Education', 'Technology', 'Events', 'Lifestyle']
}) => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter posts by category and search term
  const filteredPosts = posts.filter(post => {
    const matchesCategory = filter === 'All' || post.tags?.includes(filter);
    const matchesSearch = !searchTerm || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <>
      <PageHeader 
        title={title} 
        description={description}
      >
        {showAddPost && (
          <div className="mt-4">
            <button
              onClick={onAddPost}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Create New Post
            </button>
          </div>
        )}
      </PageHeader>
      
      <div className="mb-6">
        <ContentCard>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search posts..."
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
      
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <BlogPostCard
              key={index}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              author={post.author}
              tags={post.tags}
              imageSrc={post.image}
              onClick={() => onPostClick(post)}
            />
          ))}
        </div>
      ) : (
        <ContentCard>
          <div className="py-8 text-center text-slate-500">
            No posts found matching your criteria.
          </div>
        </ContentCard>
      )}
    </>
  );
};

export default BlogSection;
