import React, { useState, useRef } from 'react';
import { Select } from '@/components/ui/select';
import { Icon } from '@/components/shared/icons/Icon';
import PageHeader from '../layout/PageHeader';
import ContentCard from '../cards/ContentCard';
import BlogPostCard from '../cards/BlogPostCard';
import { compressImageToBase64, validateImageFile } from '@/utils/imageUtils';

// Modal Dialog Component for Blog Post Creation
const BlogPostModal = ({ isOpen, onClose, onSubmit, categories }) => {
  const [postForm, setPostForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: [],
    image: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const fileInputRef = useRef(null);

  // Reset form to default values
  const resetForm = () => {
    setPostForm({
      title: '',
      excerpt: '',
      content: '',
      tags: [],
      image: ''
    });
    setImagePreview(null);
    setImageError('');
    setCustomCategory('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle modal close with form reset
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostForm(prev => ({
      ...prev,
      [name]: value
    }));
  };  const handleTagChange = (e) => {
    const selectedTag = e.target.value;
    
  // Special handling for "Other" category
    if (selectedTag === 'Other') {
      const includesOther = postForm.tags.includes('Other');
      setPostForm(prev => ({
        ...prev,
        tags: includesOther
          ? prev.tags.filter(tag => tag !== 'Other') 
          : [...prev.tags, 'Other']
      }));
      
      // Set focus to the input field after a short delay
      if (!includesOther) {
        setTimeout(() => {
          document.getElementById('custom-category-input')?.focus();
        }, 50);
      }
      return;
    }
    
    // For regular categories
    setPostForm(prev => ({
      ...prev,
      tags: prev.tags.includes(selectedTag) 
        ? prev.tags.filter(tag => tag !== selectedTag) 
        : [...prev.tags, selectedTag]
    }));
  };
  // Add custom category to tags
  const addCustomCategory = () => {
    const trimmedCategory = customCategory.trim();
    if (trimmedCategory && !postForm.tags.includes(trimmedCategory)) {
      setPostForm(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedCategory]
      }));
      setCustomCategory(''); // Clear the input field
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate the image file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setImageError(validation.error);
      return;
    }

    setIsUploading(true);
    setImageError('');

    try {
      // Compress and convert to base64
      const base64Image = await compressImageToBase64(file);
      
      // Update form state
      setPostForm(prev => ({
        ...prev,
        image: base64Image
      }));
      
      // Set preview
      setImagePreview(base64Image);
    } catch (error) {
      setImageError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPostForm(prev => ({
      ...prev,
      image: ''
    }));
    setImagePreview(null);
    setImageError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(postForm);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-2xl mx-4 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create New Blog Post
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Share your knowledge and experiences with the community
            </p>
          </div>          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Post Title *
            </label>
            <input
              id="title"
              name="title"
              value={postForm.title}
              onChange={handleChange}
              placeholder="Enter a compelling title for your post"
              required
              className="w-full rounded-md border border-slate-300 px-4 py-2 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
          </div>

          {/* Image Upload - Below the title as requested */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Featured Image
            </label>
            <div className="space-y-3">
              {imagePreview ? (
                <div className="relative aspect-video max-h-56 w-full overflow-hidden rounded-md border border-slate-300 dark:border-slate-600">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 transition"
                    aria-label="Remove image"
                  >
                    <Icon name="x" size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 dark:border-slate-600 py-6 px-4">
                  <Icon name="image" size={36} className="text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                    Drag & drop or click to upload an image
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-600 cursor-pointer"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Select Image'}
                  </button>
                </div>
              )}
              {imageError && (
                <p className="text-sm text-red-500">{imageError}</p>
              )}
            </div>
          </div>

          {/* Post Excerpt */}
          <div className="space-y-2">
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Short Excerpt *
            </label>
            <input
              id="excerpt"
              name="excerpt"
              value={postForm.excerpt}
              onChange={handleChange}
              placeholder="A brief summary of your post (will appear in cards)"
              required
              className="w-full rounded-md border border-slate-300 px-4 py-2 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
          </div>

          {/* Post Content */}
          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Post Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={postForm.content}
              onChange={handleChange}
              placeholder="Write your post content here..."
              rows={8}
              required
              className="w-full rounded-md border border-slate-300 px-4 py-2 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
          </div>

          {/* Categories/Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Categories *
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.slice(1).map((category, index) => (
                <label 
                  key={index}
                  className={`inline-flex cursor-pointer items-center rounded-full px-3 py-1 text-sm border ${
                    postForm.tags.includes(category) 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    value={category}
                    checked={postForm.tags.includes(category)}
                    onChange={handleTagChange}
                    className="sr-only"
                  />
                  {category}
                </label>
              ))}              {/* Other category with custom input */}
              <label 
                className={`inline-flex cursor-pointer items-center rounded-full px-3 py-1 text-sm border ${
                  postForm.tags.includes('Other') 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
                }`}
                htmlFor="custom-category"
              >
                <input
                  type="checkbox"
                  id="custom-category"
                  value="Other"
                  checked={postForm.tags.includes('Other')}
                  onChange={handleTagChange}
                  className="sr-only"
                />
                Other
              </label>
              
              {postForm.tags.includes('Other') && (
                <div className="flex w-full mt-3 gap-2">                  <input
                    id="custom-category-input"
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customCategory.trim()) {
                        e.preventDefault();
                        addCustomCategory();
                      }
                    }}
                    placeholder="Enter custom category"
                    className="flex-1 rounded-md border border-slate-300 px-4 py-2 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={addCustomCategory}
                    disabled={!customCategory.trim()}
                    className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>                </div>
              )}
              
              {/* Display added custom categories */}
              {postForm.tags.some(tag => tag !== 'Other' && !categories.includes(tag)) && (
                <div className="mt-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Added custom categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {postForm.tags
                      .filter(tag => tag !== 'Other' && !categories.includes(tag))
                      .map((tag, index) => (
                        <div 
                          key={index}
                          className="inline-flex items-center rounded-full bg-primary/20 text-primary px-3 py-1 text-sm border border-primary/30"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => {
                              setPostForm(prev => ({
                                ...prev,
                                tags: prev.tags.filter(t => t !== tag)
                              }));
                            }}
                            className="ml-1 text-primary hover:text-primary-dark"
                            aria-label={`Remove ${tag} tag`}
                          >
                            <Icon name="x" size={14} />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="submit"
              className="flex-1 inline-flex justify-center items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark cursor-pointer"
            >
              <Icon name="send" size={16} />
              Publish Post
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 inline-flex justify-center items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
  const [showPostModal, setShowPostModal] = useState(false);
  
  // Filter posts by category and search term
  const filteredPosts = posts.filter(post => {
    const matchesCategory = filter === 'All' || post.tags?.includes(filter);
    const matchesSearch = !searchTerm || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Handle create post
  const handleCreatePost = (postData) => {
    if (onAddPost) {
      onAddPost(postData);
    }
  };
  
  // Handle opening modal
  const handleOpenPostModal = () => {
    setShowPostModal(true);
  };
    return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <PageHeader 
          title={title} 
          description={description}
        />
        {showAddPost && (          <div className="md:mt-0 mt-2">
            <button
              onClick={handleOpenPostModal}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark cursor-pointer"
            >
              <Icon name="plus" size={16} />
              Create New Post
            </button>
          </div>
        )}
      </div>
      
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
              <Icon name="search" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
      )}      {/* Create Post Modal */}
      <BlogPostModal 
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSubmit={handleCreatePost}
        categories={categories}
      />
    </>
  );
};

export default BlogSection;
