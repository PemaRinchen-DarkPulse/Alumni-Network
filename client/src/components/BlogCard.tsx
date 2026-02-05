import type { BlogPost } from '../services/blogService'
import '../styles/Blog.css'

interface BlogCardProps {
  post: BlogPost
}

const BlogCard = ({ post }: BlogCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getExcerpt = (content: string, maxLength: number = 120) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  // Generate a random view count for demo purposes
  const viewCount = Math.floor(Math.random() * 500) + 100

  return (
    <div className="blog-card">
      <div className="blog-card-image">
        <img
          src={post.featuredImageUrl || post.imageUrl || `https://source.unsplash.com/800x500/?${post.category.toLowerCase()}`}
          alt={post.title}
        />
      </div>

      <div className="blog-card-content">
        <div className="blog-card-header">
          <span className="blog-card-category">{post.category}</span>
          <span className="blog-card-date">
            <svg
              className="calendar-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {formatDate(post.createdAt)}
          </span>
        </div>

        <h3 className="blog-card-title">{post.title}</h3>
        <p className="blog-card-excerpt">{getExcerpt(post.content)}</p>

        <div className="blog-card-footer">
          <div className="blog-card-author">
            <div className="author-avatar">
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <span className="author-name">{post.authorName}</span>
          </div>

          <div className="blog-card-stats">
            <svg
              className="view-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="view-count">{viewCount}</span>
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="blog-card-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="blog-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogCard
