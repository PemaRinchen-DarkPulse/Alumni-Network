import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAvatar } from '../../ui/user-avatar';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { SectionLoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatDate } from '../../../lib/utils';
import { getImageUrl } from '../../../utils/imageUtils';
import { useAuth } from '../../../contexts/auth';
import SectionHero from '@/components/shared/layout/SectionHero';

// Stub blogService (backend removed)
const blogService = {
  getAllPosts: async () => ({ posts: [] }),
  createPostWithImage: async () => ({}),
};

const BlogCard = ({ post }) => {
  // Extract necessary data from post
  const { _id, title, content, category, featuredImage, author, createdAt } = post;
  
  // Truncate content to 3 lines max
  const truncateContent = (text) => {
    // Split by newlines or periods to get approximate "3 lines"
    const sentences = text.split(/[.\n]/g);
    let truncated = sentences.slice(0, 3).join('. ');
    
    // If content was truncated, add ellipsis
    if (text.length > truncated.length) {
      truncated += '...';
    }
    return truncated;
  };

  return (
    <Card className="overflow-hidden w-full flex flex-col p-0 py-0">
      {/* Featured image */}
      <div className="h-48 w-full overflow-hidden flex-shrink-0">
        <img 
          src={featuredImage ? getImageUrl(_id) : 'https://via.placeholder.com/400x250?text=No+Image'} 
          alt={title}
          className="w-full h-full object-cover" 
          onError={(e) => {
            console.error('Failed to load blog image for post ID:', _id);
            e.target.src = 'https://via.placeholder.com/400x250?text=No+Image';
          }}
          crossOrigin="anonymous" // Add this to handle CORS issues
        />
      </div>
      
      <div className="p-5 flex flex-col gap-3">
        {/* Category tag */}
        <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 text-xs font-medium rounded-full">
          {category}
        </span>
        
        {/* Title */}
        <h3 className="text-xl font-bold line-clamp-2">{title}</h3>
        
        {/* Content preview */}
        <p className="text-gray-600 line-clamp-3">
          {truncateContent(content)}
        </p>
        
        {/* Author section */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserAvatar user={author} size="sm" />
            <div>
              <p className="text-sm font-medium">{author.name}</p>
              <p className="text-xs text-gray-500">
                {formatDate(createdAt, { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
          
          {/* Read more button */}
          <Button variant="link" size="sm" asChild>
            <Link to={`/blogs/${_id}`}>Read more</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};

// Modal component for creating new blog posts
const CreateBlogModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    featuredImage: null,
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, featuredImage: file }));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData object to handle file upload
    const blogFormData = new FormData();
    blogFormData.append('title', formData.title);
    blogFormData.append('content', formData.content);
    blogFormData.append('category', formData.category);
    
    if (formData.featuredImage) {
      blogFormData.append('featuredImage', formData.featuredImage);
    }
    
    onSubmit(blogFormData);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">Create New Blog Post</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              required
              autoFocus
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium mb-1">Featured Image</label>
            <input
              type="file"
              id="featuredImage"
              name="featuredImage"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            {formData.featuredImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Selected image: {formData.featuredImage.name}</p>
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={8}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Publish Post</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BlogSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Check if user has permission to create/edit blogs
  const canCreateBlog = isAuthenticated && ['alumni', 'teacher'].includes(user?.role);
  
  // Fetch blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await blogService.getAllPosts();
        setPosts(response.posts || []);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // Handle blog post creation
  const handleCreatePost = async (formData) => {
    try {
      setLoading(true);
      // Using FormData for file upload
      const response = await blogService.createPostWithImage(formData);
      
      // Add the new post to the list
      setPosts(prevPosts => [response.post, ...prevPosts]);
      
      // Close the modal
      setIsModalOpen(false);
      
      // Show success message (optional)
      setError(null); // Clear any existing errors
      
      // No navigation - stay on the current page
    } catch (err) {
      console.error('Error creating blog post:', err);
      setError('Failed to create blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          {/* Show New Post button only for alumni and teachers */}
          {canCreateBlog && (
            <Button onClick={() => setIsModalOpen(true)}>
              Create New Post
            </Button>
          )}
        </div>
        
        {/* Error state */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {/* Loading state */}
        {loading ? (
          <SectionLoadingSpinner section="blog" />
        ) : (
          // Blog posts grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post._id} className="flex w-full">
                  <BlogCard post={post} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No blog posts found.</p>
                {canCreateBlog && (
                  <Button 
                    onClick={() => setIsModalOpen(true)}
                    variant="link" 
                    className="mt-2"
                  >
                    Create the first post
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Create blog modal */}
      <CreateBlogModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </section>
  );
};

export default BlogSection;