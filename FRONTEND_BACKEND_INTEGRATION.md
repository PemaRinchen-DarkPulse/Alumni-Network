# Frontend-Backend Integration Guide

This document explains how the frontend (React) is connected to the backend (Spring Boot).

## Architecture Overview

### Backend (Spring Boot)
- **URL**: `http://localhost:8080`
- **API Base Path**: `/api`
- **Authentication**: JWT-based authentication
- **CORS**: Configured to accept requests from `http://localhost:5173` and `http://localhost:3000`

### Frontend (React + Vite)
- **URL**: `http://localhost:5173`
- **HTTP Client**: Axios
- **State Management**: React Context API for authentication

## Project Structure

```
client/
├── src/
│   ├── config/
│   │   └── api.ts              # Axios configuration with interceptors
│   ├── services/               # API service layer
│   │   ├── authService.ts      # Authentication APIs
│   │   ├── userService.ts      # User management APIs
│   │   ├── connectionService.ts # Connection APIs
│   │   ├── eventService.ts     # Event APIs
│   │   ├── mentorshipService.ts # Mentorship APIs
│   │   └── blogService.ts      # Blog APIs
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── hooks/
│   │   └── useDashboardData.ts # Custom hook for dashboard data
│   ├── components/
│   │   ├── Login.tsx           # Login component (connected)
│   │   ├── SignUp.tsx          # Sign up component (connected)
│   │   ├── Dashboard.tsx       # Dashboard component
│   │   └── ProtectedRoute.tsx  # Route guard
│   └── ...
├── .env                        # Environment variables
└── vite.config.ts             # Vite configuration with proxy
```

## API Configuration

### 1. Axios Instance ([api.ts](client/src/config/api.ts))

```typescript
- Base URL: From env variable or http://localhost:8080
- Auto-adds JWT token to requests
- Auto-redirects to login on 401 errors
- Global error handling
```

### 2. Environment Variables ([.env](client/.env))

```bash
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Vite Proxy Configuration ([vite.config.ts](client/vite.config.ts))

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  }
}
```

## Available Services

### Authentication Service
- `login(credentials)` - User login
- `register(data)` - User registration
- `verifyEmail(token)` - Email verification
- `resendVerification(email)` - Resend verification email
- `forgotPassword(email)` - Password reset request
- `logout()` - Clear auth state

### User Service
- `getAllUsers(filters)` - Get all users with optional filters
- `getUserById(id)` - Get user by ID

### Connection Service
- `sendConnectionRequest(senderId, receiverId)` - Send connection request
- `acceptConnectionRequest(connectionId, userId)` - Accept request
- `rejectConnectionRequest(connectionId, userId)` - Reject request
- `getUserConnections(userId, status)` - Get user connections
- `getPendingRequests(userId)` - Get pending requests
- `getConnectionStats(userId)` - Get connection statistics
- `removeConnection(connectionId, userId)` - Remove connection

### Event Service
- `getAllEvents(params)` - Get all events with filters
- `getEventById(id, userId)` - Get event details
- `createEvent(eventData)` - Create new event
- `updateEvent(id, eventData)` - Update event
- `deleteEvent(id)` - Delete event
- `rsvpToEvent(eventId)` - RSVP to event
- `cancelRsvp(eventId)` - Cancel RSVP
- `getUserRegisteredEvents(userId)` - Get user's registered events

### Mentorship Service
- `saveDraft(profileData)` - Save mentorship profile draft
- `publishProfile(profileData)` - Publish mentorship profile
- `getProfile(userId)` - Get mentorship profile
- `updateProfile(userId, profileData)` - Update profile
- `deleteProfile(userId)` - Delete profile
- `getAllMentors(filters)` - Get all mentors
- `sendMentorshipRequest(requestData)` - Send mentorship request
- `acceptRequest(requestId)` - Accept mentorship request
- `rejectRequest(requestId)` - Reject mentorship request
- `getUserRequests(userId, type)` - Get user's requests

### Blog Service
- `getAllPosts(params)` - Get all blog posts
- `getPostById(id)` - Get post details
- `createPost(postData)` - Create new post
- `updatePost(id, postData)` - Update post
- `deletePost(id)` - Delete post

## Authentication Flow

### 1. User Login
```typescript
// In Login.tsx
const response = await authService.login({ email, password })
if (response.success) {
  localStorage.setItem('token', response.token)
  localStorage.setItem('user', JSON.stringify(response.user))
  navigate('/dashboard')
}
```

### 2. Token Storage
- JWT token stored in `localStorage`
- User data stored in `localStorage`
- AuthContext provides global auth state

### 3. Protected Routes
```typescript
// Wrap protected routes with ProtectedRoute component
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
```

### 4. Auto-Token Injection
```typescript
// In api.ts - Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## Usage Examples

### Making API Calls in Components

```typescript
import { useState, useEffect } from 'react'
import { eventService } from '../services/eventService'

function EventsComponent() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getAllEvents()
        if (response.success) {
          setEvents(response.data)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  // Render events...
}
```

### Using Authentication Context

```typescript
import { useAuth } from '../context/AuthContext'

function ProfileComponent() {
  const { user, logout } = useAuth()

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Using Custom Hooks

```typescript
import { useDashboardData } from '../hooks/useDashboardData'

function Dashboard() {
  const { connections, events, stats, loading, error } = useDashboardData()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  // Render dashboard with real data...
}
```

## Running the Application

### 1. Start Backend
```bash
cd server
./mvnw spring-boot:run
```
Backend will run on `http://localhost:8080`

### 2. Start Frontend
```bash
cd client
npm install
npm run dev
```
Frontend will run on `http://localhost:5173`

### 3. Test the Connection
1. Open browser to `http://localhost:5173`
2. Go to Sign Up page
3. Register a new user
4. Check your email for verification
5. Login with your credentials
6. You should be redirected to the dashboard

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email` - Verify email
- `POST /api/auth/resend-verification` - Resend verification
- `POST /api/auth/forgot-password` - Password reset

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID

### Connections
- `POST /api/connections/send` - Send connection request
- `POST /api/connections/{id}/accept` - Accept request
- `POST /api/connections/{id}/reject` - Reject request
- `GET /api/connections/user/{userId}` - Get user connections
- `GET /api/connections/user/{userId}/pending` - Get pending requests
- `GET /api/connections/user/{userId}/stats` - Get connection stats
- `DELETE /api/connections/{id}` - Remove connection

### Events
- `GET /api/events` - Get all events
- `GET /api/events/{id}` - Get event by ID
- `POST /api/events` - Create event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event
- `POST /api/events/{id}/rsvp` - RSVP to event
- `DELETE /api/events/{id}/rsvp` - Cancel RSVP

### Mentorship
- `POST /api/mentorship/draft` - Save draft profile
- `POST /api/mentorship/publish` - Publish profile
- `GET /api/mentorship/profile/{userId}` - Get profile
- `PUT /api/mentorship/profile/{userId}` - Update profile
- `DELETE /api/mentorship/profile/{userId}` - Delete profile
- `GET /api/mentorship/mentors` - Get all mentors
- `POST /api/mentorship/request` - Send mentorship request
- `POST /api/mentorship/request/{id}/accept` - Accept request
- `POST /api/mentorship/request/{id}/reject` - Reject request

### Blog
- `GET /api/blog` - Get all posts
- `GET /api/blog/{id}` - Get post by ID
- `POST /api/blog` - Create post
- `PUT /api/blog/{id}` - Update post
- `DELETE /api/blog/{id}` - Delete post

## Error Handling

### Frontend Error Handling
```typescript
try {
  const response = await authService.login(credentials)
  if (response.success) {
    // Handle success
  } else {
    // Handle error response from backend
    setError(response.message)
  }
} catch (error) {
  // Handle network or other errors
  setError(error.response?.data?.message || 'An error occurred')
}
```

### Global Error Interceptor
```typescript
// In api.ts
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout on unauthorized
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## Security Best Practices

1. **JWT Token Storage**: Tokens stored in localStorage
2. **Token Expiration**: Backend validates token expiration
3. **CORS**: Backend configured to accept only specific origins
4. **Protected Routes**: Frontend enforces authentication for protected pages
5. **HTTPS**: Use HTTPS in production
6. **Environment Variables**: Sensitive data in .env files (never commit)

## Troubleshooting

### Connection Refused
- Ensure backend is running on port 8080
- Check CORS configuration in backend
- Verify API_BASE_URL in .env file

### 401 Unauthorized
- Token might be expired - try logging in again
- Check if token is being sent in request headers
- Verify JWT secret is same in backend .env

### CORS Errors
- Check backend SecurityConfig or CORS configuration
- Ensure frontend URL is in allowed origins list
- Restart both frontend and backend after config changes

### API Not Found (404)
- Verify endpoint URL matches backend @RequestMapping
- Check if backend controller is properly configured
- Ensure API base path is correct

## Next Steps

1. Implement more components to use the API services
2. Add loading states and better error handling
3. Implement real-time features with WebSocket
4. Add caching layer with React Query
5. Implement offline support with Service Workers
6. Add comprehensive error boundaries
7. Implement refresh token mechanism
