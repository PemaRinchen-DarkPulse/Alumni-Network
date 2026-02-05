# Blog Feature Documentation

## Overview
The Alumni Network Blog is a comprehensive blogging platform that allows alumni to share their stories, insights, and experiences with the community.

## Features

### 1. **Blog Post Listing**
- View all published blog posts in a responsive grid layout
- Three-tab navigation:
  - **All Posts**: View all published posts from the community
  - **My Posts**: View your own published posts
  - **Drafts**: View your unpublished drafts

### 2. **Search and Filter**
- **Search Bar**: Search blog posts by title or content
- **Category Filter**: Filter posts by category:
  - Career Advice
  - Technology
  - Networking Tips
  - Alumni Stories
  - Entrepreneurship
  - Education

### 3. **Blog Post Cards**
Each blog post card displays:
- Featured image (with fallback to category-based stock images)
- Category badge
- Publication date
- Post title
- Content excerpt
- Author information with avatar
- View count
- Tags

### 4. **Create New Posts**
Click the "Write a Post" button to create a new blog post with:
- Title (required, max 200 characters)
- Category selection (required)
- Content (required)
- Tags (comma-separated, optional)
- Status selection:
  - **Save as Draft**: Save without publishing
  - **Publish Now**: Publish immediately

### 5. **Responsive Design**
- Fully responsive layout that works on desktop, tablet, and mobile devices
- Mobile-optimized navigation and forms

## Technical Implementation

### Frontend Components

#### Blog.tsx
Main blog page component that handles:
- Tab navigation
- Search and filter functionality
- Blog post listing
- Create post modal trigger

#### BlogCard.tsx
Individual blog post card component displaying:
- Post metadata (category, date, author)
- Post preview (title, excerpt)
- Engagement metrics (views)
- Tags

#### CreatePost.tsx
Modal form for creating new blog posts with:
- Form validation
- Error handling
- Draft/Publish options
- Real-time updates after submission

### Backend API Endpoints

#### Public Endpoints
- `GET /api/blog/published` - Get all published posts
- `GET /api/blog/{id}` - Get specific post by ID
- `GET /api/blog/author/{authorId}` - Get posts by author
- `GET /api/blog/category/{category}` - Get posts by category

#### Protected Endpoints (Requires Authentication)
- `POST /api/blog/draft` - Save post as draft
- `POST /api/blog/publish` - Publish new post
- `PUT /api/blog/{id}` - Update existing post
- `POST /api/blog/{id}/publish` - Publish a draft
- `DELETE /api/blog/{id}` - Delete a post

### Database Schema

**blog_posts table:**
- `id` (Long) - Primary key
- `title` (String, max 200) - Post title
- `content` (TEXT) - Post content
- `category` (String) - Post category
- `author_id` (Long) - Author user ID
- `author_name` (String) - Author display name
- `status` (Enum) - DRAFT, PUBLISHED, ARCHIVED
- `view_count` (Integer) - Number of views
- `like_count` (Integer) - Number of likes
- `comment_count` (Integer) - Number of comments
- `created_at` (Timestamp) - Creation timestamp
- `updated_at` (Timestamp) - Last update timestamp
- `published_at` (Timestamp) - Publication timestamp

**blog_post_tags table:**
- `blog_post_id` (Long) - Foreign key to blog_posts
- `tag` (String) - Tag name

## Sample Data
The system includes 6 sample blog posts covering various categories:
1. "My Journey from College to Tech: Lessons Learned" (Career Advice)
2. "The Future of AI in Healthcare" (Technology)
3. "Building a Strong Professional Network" (Networking Tips)
4. "Mastering Remote Work: Tips for Success" (Career Advice)
5. "From Student to Startup Founder: My Story" (Entrepreneurship)
6. "The Importance of Continuous Learning in Tech" (Education)

## Accessing the Blog
1. Navigate to the Alumni Network homepage
2. Click "Blog" in the navigation menu
3. Browse, search, or filter posts
4. Click "Write a Post" to create your own content (requires login)

## Future Enhancements
- [ ] Post comments and replies
- [ ] Like/reaction system
- [ ] Rich text editor for post creation
- [ ] Image upload for featured images
- [ ] Post sharing on social media
- [ ] Related posts suggestions
- [ ] Author profiles
- [ ] Bookmark/save posts
- [ ] Email notifications for new posts
- [ ] Advanced search with multiple filters

## File Structure
```
client/src/
  ├── components/
  │   ├── Blog.tsx
  │   ├── BlogCard.tsx
  │   └── CreatePost.tsx
  ├── services/
  │   └── blogService.ts
  └── styles/
      ├── Blog.css
      └── CreatePost.css

server/src/main/java/com/server/server/
  ├── controller/
  │   └── BlogPostController.java
  ├── model/
  │   └── BlogPost.java
  ├── repository/
  │   └── BlogPostRepository.java
  ├── service/
  │   └── BlogPostService.java
  └── config/
      └── BlogDataInitializer.java
```

## Contributing
When adding new features to the blog:
1. Follow the existing code style and patterns
2. Update this documentation
3. Test on multiple devices and browsers
4. Ensure proper error handling
5. Add appropriate security measures for protected endpoints
