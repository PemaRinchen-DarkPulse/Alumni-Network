import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/auth';
import blogService from '../services/blogService';
import { getImageUrl } from '../utils/imageUtils';

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    featuredImage: null,
    currentImageUrl: ''
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Check if user can edit this post
  useEffect(() => {
    const checkPermission = async () => {
      try {
        setLoading(true);
        const response = await blogService.getPostById(id);
        const post = response.post;
        
        console.log('Blog post data:', post);
        console.log('Featured image path:', post.featuredImage);
        
        // Check if the user is allowed to edit this post
        if (!isAuthenticated || 
           !['alumni', 'teacher'].includes(user?.role) || 
           (user?._id !== post.author._id)) {
          setError('You do not have permission to edit this post.');
          return;
        }
        
        // Set form data from the post
        setFormData({
          title: post.title,
          content: post.content,
          category: post.category || '', // Ensure we have a default value
          featuredImage: null,
          // Store if there's an image (true/false) rather than the URL
          currentImageUrl: post.featuredImage ? true : false
        });
        
        // Set image preview if there's a featured image
        if (post.featuredImage) {
          console.log('Setting image preview for post:', post._id);
          // For imagePreview, we need the full URL using the post ID
          const fullImageUrl = getImageUrl(post._id);
          setImagePreview(fullImageUrl);
          console.log('Full image URL:', fullImageUrl);
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. It may have been deleted.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      checkPermission();
    }
  }, [id, user, isAuthenticated]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle image file changes
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, featuredImage: file }));
      
      // Create preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (formData.featuredImage) {
        // Create FormData object for file upload
        const blogFormData = new FormData();
        blogFormData.append('title', formData.title);
        blogFormData.append('content', formData.content);
        blogFormData.append('category', formData.category);
        blogFormData.append('featuredImage', formData.featuredImage);
        
        await blogService.updatePostWithImage(id, blogFormData);
      } else {
        // Regular update without changing the image, or to remove existing image
        const { featuredImage, currentImageUrl, ...postData } = formData;
        
        const blogFormData = new FormData();
        blogFormData.append('title', formData.title);
        blogFormData.append('content', formData.content);
        blogFormData.append('category', formData.category);
        
        // Tell server whether to keep existing image or remove it
        if (currentImageUrl) {
          // Keep the existing image
          blogFormData.append('keepExistingImage', 'true');
        } else {
          // Remove the existing image
          blogFormData.append('featuredImage', '');
        }
        
        // Use the with-image endpoint for consistency
        await blogService.updatePostWithImage(id, blogFormData);
      }
      
      navigate(`/blogs/${id}`);
    } catch (err) {
      console.error('Error updating blog post:', err);
      alert('Failed to update blog post. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
        <Link to="/blogs" className="text-blue-600 hover:underline">
          &larr; Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Link to={`/blogs/${id}`} className="inline-flex items-center text-blue-600 hover:underline mb-6">
        &larr; Back to Post
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
        
        <div className="space-y-2">
          <label htmlFor="featuredImage" className="block text-sm font-medium mb-1">Featured Image</label>
          {formData.currentImageUrl && !formData.featuredImage && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-shrink-0">
                <img 
                  src={getImageUrl(postId)} 
                  alt="Current" 
                  className="h-16 w-16 object-cover rounded"
                  onError={(e) => {
                    console.error('Image failed to load for post ID:', postId);
                    e.target.src = 'https://via.placeholder.com/64?text=Image';
                  }}
                  crossOrigin="anonymous" // Add this to handle CORS issues
                />
              </div>
              <div className="flex-grow">
                <p className="text-sm">Current image</p>
              </div>
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                onClick={() => setFormData(prev => ({ ...prev, currentImageUrl: '', featuredImage: null }))}
              >
                Remove
              </Button>
            </div>
          )}
          <input
            type="file"
            id="featuredImage"
            name="featuredImage"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
          {formData.featuredImage && (
            <p className="text-sm text-gray-500">New image selected: {formData.featuredImage.name}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={12}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(`/blogs/${id}`)}
          >
            Cancel
          </Button>
          <Button type="submit">Update Post</Button>
        </div>
      </form>
    </div>
  );
};

export default EditBlogPage;