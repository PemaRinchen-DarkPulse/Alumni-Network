import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserAvatar } from '../components/ui/user-avatar';
import { Button } from '../components/ui/button';
import { formatDate } from '../lib/utils';
import { getImageUrl } from '../utils/imageUtils';
import { useAuth } from '../contexts/auth';
import blogService from '../services/blogService';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const { user, isAuthenticated } = useAuth();

  // Check if user can edit/delete this post
  const canEditPost = isAuthenticated && 
    post && 
    user && 
    (user._id === post.author._id || ['alumni', 'teacher'].includes(user.role));

  // Get blog post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await blogService.getPostById(id);
        setPost(response.post);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. It may have been deleted or you may not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await blogService.addComment(id, comment);
      setPost(response.post);
      setComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    }
  };

  // Handle post deletion
  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await blogService.deletePost(id);
      window.location.href = '/blogs';
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post. Please try again.');
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
  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error || 'Blog post not found'}
        </div>
        <Link to="/blogs" className="text-blue-600 hover:underline">
          &larr; Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Back button */}
      <Link to="/blogs" className="inline-flex items-center text-blue-600 hover:underline mb-6">
        &larr; Back to Blogs
      </Link>

      {/* Post header */}
      <div className="mb-8">
        {/* Category tag */}
        <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 text-sm font-medium rounded-full mb-4">
          {post.category}
        </span>
        
        <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
        
        {/* Author and date info */}
        <div className="flex items-center gap-4 mb-6">
          <UserAvatar user={post.author} size="md" />
          <div>
            <h3 className="font-semibold">{post.author.name}</h3>
            <p className="text-sm text-gray-500">
              {formatDate(post.createdAt, { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>
        </div>
        
        {/* Action buttons for authors */}
        {canEditPost && (
          <div className="flex gap-3 mb-6">
            <Button variant="outline" asChild>
              <Link to={`/blogs/edit/${post._id}`}>Edit Post</Link>
            </Button>
            <Button variant="destructive" onClick={handleDeletePost}>
              Delete Post
            </Button>
          </div>
        )}
      </div>
      
      {/* Featured image */}
      {post.featuredImage && (
        <div className="mb-8 overflow-hidden rounded-lg shadow-md">
          <img 
            src={getImageUrl(post._id)} 
            alt={post.title}
            className="w-full h-auto max-h-[500px] object-cover" 
            onError={(e) => {
              console.error('Failed to load featured image for post ID:', post._id);
              e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
            }}
            crossOrigin="anonymous" // Add this to handle CORS issues
          />
        </div>
      )}
      
      {/* Post content */}
      <div className="prose lg:prose-xl max-w-none mb-12">
        {post.content.split('\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      
      {/* Comments section */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Comments ({post.comments?.length || 0})</h2>
        
        {/* Comment form */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="flex items-start gap-4">
              <UserAvatar user={user} size="sm" />
              <div className="flex-1">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 min-h-[100px]"
                  required
                ></textarea>
                <div className="flex justify-end mt-2">
                  <Button type="submit">Post Comment</Button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-blue-50 text-blue-700 p-4 rounded-md mb-6">
            Please <Link to="/auth" className="font-medium underline">sign in</Link> to comment on this post.
          </div>
        )}
        
        {/* Comments list */}
        <div className="space-y-6">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment._id} className="flex gap-4 border-b pb-6">
                <UserAvatar user={comment.author} size="sm" />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{comment.author.name}</h4>
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.createdAt, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-6">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
