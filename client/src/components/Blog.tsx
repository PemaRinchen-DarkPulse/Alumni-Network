import { useState, useEffect } from 'react'
import { blogService } from '../services/blogService'
import type { BlogPost } from '../services/blogService'
import BlogCard from './BlogCard'
import CreatePost from './CreatePost'
import '../styles/Blog.css'

const Blog = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'my-posts' | 'drafts'>('all')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [showCreatePost, setShowCreatePost] = useState(false)

  const categories = [
    'All Categories',
    'CAREER ADVICE',
    'TECHNOLOGY',
    'NETWORKING TIPS',
    'ALUMNI STORIES',
    'ENTREPRENEURSHIP',
    'EDUCATION'
  ]

  useEffect(() => {
    fetchPosts()
  }, [activeTab, selectedCategory, searchQuery])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params: any = {}
      
      if (selectedCategory !== 'All Categories') {
        params.category = selectedCategory
      }
      
      if (searchQuery) {
        params.search = searchQuery
      }

      const data = await blogService.getAllPosts(params)
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value)
  }

  const handlePostCreated = () => {
    fetchPosts()
  }

  return (
    <div id="blog" className="blog-container">
      {!showCreatePost && (
        <>
          <div className="blog-header">
            <div className="blog-title-section">
              <h1 className="blog-title">Alumni Blog</h1>
              <p className="blog-subtitle">
                Share your stories, insights, and experiences with the community.
              </p>
            </div>

            <div className="blog-tabs">
              <button
                className={`blog-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Posts
              </button>
              <button
                className={`blog-tab ${activeTab === 'my-posts' ? 'active' : ''}`}
                onClick={() => setActiveTab('my-posts')}
              >
                My Posts
              </button>
              <button
                className={`blog-tab ${activeTab === 'drafts' ? 'active' : ''}`}
                onClick={() => setActiveTab('drafts')}
              >
                Drafts
              </button>
            </div>
          </div>

          <div className="blog-controls">
            <div className="search-bar">
              <svg
                className="search-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="category-select"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button className="write-post-btn" onClick={() => setShowCreatePost(true)}>
              <svg
                className="plus-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Write a Post
            </button>
          </div>
        </>
      )}

      <div className="blog-content">
        {showCreatePost ? (
          <CreatePost
            onClose={() => setShowCreatePost(false)}
            onPostCreated={handlePostCreated}
          />
        ) : loading ? (
          <div className="loading-state">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts found. Be the first to write a post!</p>
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
