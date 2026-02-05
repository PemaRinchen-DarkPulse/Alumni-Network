# Blog Feature - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Backend server running on port 8080
- Frontend dev server ready on port 5173
- Database configured (MySQL or H2)

### Step 1: Start the Backend
```bash
cd server
./mvnw spring-boot:run
```

The blog sample data will automatically populate on first run!

### Step 2: Start the Frontend
```bash
cd client
npm run dev
```

### Step 3: Access the Blog
Open your browser and navigate to:
```
http://localhost:5173/blog
```

## 📋 What You'll See

### Homepage
- New "Blog" link in the navigation menu

### Blog Page
- 6 sample blog posts in a beautiful grid layout
- Search bar to find posts
- Category dropdown filter
- "Write a Post" button (blue, top right)
- Three tabs: All Posts, My Posts, Drafts

### Sample Posts
1. **My Journey from College to Tech** - Career Advice by Sarah Johnson
2. **The Future of AI in Healthcare** - Technology by Dr. Michael Chen
3. **Building a Strong Professional Network** - Networking Tips by Emily Williams
4. **Mastering Remote Work** - Career Advice by James Rodriguez
5. **From Student to Startup Founder** - Entrepreneurship by Alex Kim
6. **Continuous Learning in Tech** - Education by Lisa Thompson

## 🎨 Features to Try

### 1. Browse Posts
- Scroll through the blog grid
- Hover over cards to see animations
- Click cards to view full posts (feature pending)

### 2. Search Posts
- Type keywords in the search bar
- Results filter in real-time

### 3. Filter by Category
- Select a category from dropdown
- See only posts in that category
- Try: Career Advice, Technology, Networking Tips, etc.

### 4. Create a Post (Requires Login)
- Click "Write a Post" button
- Fill in:
  - Title (required)
  - Category (dropdown)
  - Content (textarea)
  - Tags (comma-separated)
  - Status (Draft or Publish)
- Submit to create your post!

### 5. Switch Tabs
- **All Posts**: Browse all published posts
- **My Posts**: See your own posts (when logged in)
- **Drafts**: View unpublished drafts (when logged in)

## 🔑 Authentication Notes

Some features require authentication:
- Creating posts
- Viewing "My Posts"
- Viewing "Drafts"
- Editing posts
- Deleting posts

To test these features, log in first at `/login`

## 🎯 Test Checklist

- [ ] Blog page loads successfully
- [ ] 6 sample posts are visible
- [ ] Search functionality works
- [ ] Category filter works
- [ ] Cards have hover effects
- [ ] "Write a Post" button opens modal
- [ ] Modal form works properly
- [ ] Responsive on mobile devices
- [ ] Tabs are clickable
- [ ] Navigation links work

## 🐛 Troubleshooting

### No posts showing?
- Check backend console for "Blog data initialized successfully"
- Verify database connection
- Check browser console for errors

### 404 on /blog route?
- Ensure frontend is rebuilt (`npm run dev`)
- Check [App.tsx](client/src/App.tsx) for blog route

### Create post not working?
- Ensure you're logged in
- Check backend authentication
- Verify CORS settings

### Styling looks off?
- Clear browser cache
- Check if [Blog.css](client/src/styles/Blog.css) is loaded
- Verify Vite dev server is running

## 📊 API Endpoints

If you want to test the API directly:

### Get All Published Posts
```bash
curl http://localhost:8080/api/blog/published
```

### Create a Post (requires auth token)
```bash
curl -X POST http://localhost:8080/api/blog/publish \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Post",
    "content": "This is a test",
    "category": "CAREER ADVICE",
    "tags": ["test"]
  }'
```

## 🎉 Success!

If you can see and interact with the blog posts, congratulations! The blog feature is working correctly.

Enjoy sharing your stories with the alumni community! 🎓✨

---

**Need Help?**
- Check [BLOG_FEATURE.md](BLOG_FEATURE.md) for detailed documentation
- Review [BLOG_IMPLEMENTATION_SUMMARY.md](BLOG_IMPLEMENTATION_SUMMARY.md) for technical details
- Check backend logs for errors
- Inspect browser console for frontend issues
