# Frontend-Backend Connection Checklist

## ✅ Setup Verification

### Backend Setup
- [ ] Backend server is running on `http://localhost:8080`
- [ ] MySQL database is configured and running
- [ ] Environment variables are set in `server/.env`
- [ ] CORS is configured to allow `http://localhost:5173`
- [ ] JWT secret is configured

### Frontend Setup
- [ ] Node modules installed (`npm install`)
- [ ] `.env` file created with `VITE_API_BASE_URL=http://localhost:8080`
- [ ] Axios is installed
- [ ] Frontend server runs on `http://localhost:5173`

## ✅ Files Created

### Configuration
- [x] `client/src/config/api.ts` - Axios configuration
- [x] `client/.env` - Environment variables
- [x] `client/vite.config.ts` - Vite proxy configuration

### Services (API Layer)
- [x] `client/src/services/authService.ts` - Authentication APIs
- [x] `client/src/services/userService.ts` - User management
- [x] `client/src/services/connectionService.ts` - Connections
- [x] `client/src/services/eventService.ts` - Events
- [x] `client/src/services/mentorshipService.ts` - Mentorship
- [x] `client/src/services/blogService.ts` - Blog posts

### Context & Hooks
- [x] `client/src/context/AuthContext.tsx` - Authentication state
- [x] `client/src/hooks/useDashboardData.ts` - Dashboard data hook
- [x] `client/src/components/ProtectedRoute.tsx` - Route guard

### Updated Components
- [x] `client/src/components/Login.tsx` - Connected to backend
- [x] `client/src/components/SignUp.tsx` - Connected to backend
- [x] `client/src/App.tsx` - AuthProvider and ProtectedRoute

### Documentation
- [x] `FRONTEND_BACKEND_INTEGRATION.md` - Complete integration guide
- [x] `client/SETUP.md` - Frontend setup guide
- [x] `client/src/examples/DashboardWithAPI.tsx` - Example implementation

## ✅ Testing the Connection

### 1. Test Backend Availability
```bash
# Open new terminal
curl http://localhost:8080/api/auth/register
# Should return: 400 Bad Request (expected - no data sent)
```

### 2. Test Frontend Build
```bash
cd client
npm run dev
# Should start without errors on http://localhost:5173
```

### 3. Test User Registration
- [ ] Navigate to `http://localhost:5173/signup`
- [ ] Fill out the registration form
- [ ] Submit the form
- [ ] Check browser console for API call
- [ ] Check browser Network tab for request/response
- [ ] Verify alert shows "Registration successful"

### 4. Test User Login
- [ ] Navigate to `http://localhost:5173/login`
- [ ] Enter registered credentials
- [ ] Submit the form
- [ ] Check if redirected to `/dashboard`
- [ ] Check localStorage for `token` and `user`
- [ ] Check browser console for no errors

### 5. Test Protected Route
- [ ] Clear localStorage
- [ ] Try to access `http://localhost:5173/dashboard`
- [ ] Should redirect to `/login`
- [ ] Login again
- [ ] Should successfully access dashboard

### 6. Test Logout
- [ ] Click logout button in dashboard
- [ ] Verify redirected to login page
- [ ] Check localStorage is cleared
- [ ] Try accessing dashboard again (should redirect to login)

## ✅ Browser Console Checks

### No Errors
- [ ] No CORS errors
- [ ] No 404 errors for API endpoints
- [ ] No authentication errors (unless testing logout)

### Network Tab
- [ ] POST requests to `/api/auth/login` return 200
- [ ] POST requests to `/api/auth/register` return 201
- [ ] Authorization header is present in authenticated requests
- [ ] Responses contain expected data structure

### Application Tab (DevTools)
- [ ] localStorage contains `token` after login
- [ ] localStorage contains `user` object after login
- [ ] Token is JWT format (three parts separated by dots)

## ✅ API Integration Verification

### Authentication Endpoints
```bash
# Test registration (should work)
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","password":"password123"}'

# Test login (use actual registered email)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Protected Endpoints (need token)
```bash
# Get all users (replace YOUR_TOKEN with actual token)
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get connections
curl -X GET http://localhost:8080/api/connections/user/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Solution:**
- Check backend `SecurityConfig.java` or `application.properties`
- Ensure `http://localhost:5173` is in allowed origins
- Restart backend server

### Issue: 401 Unauthorized
**Solution:**
- Check if token is being sent in request headers
- Verify token hasn't expired
- Check JWT secret matches in backend
- Try logging in again

### Issue: Connection Refused
**Solution:**
- Ensure backend is running on port 8080
- Check if port is already in use
- Verify `VITE_API_BASE_URL` in `.env` is correct

### Issue: 404 Not Found
**Solution:**
- Verify API endpoint exists in backend
- Check controller `@RequestMapping` paths
- Ensure correct HTTP method (GET, POST, etc.)

### Issue: Cannot read property of undefined
**Solution:**
- Check if user is logged in
- Verify response data structure matches interface
- Add null checks in components

## 📝 Next Steps

After verifying the connection works:

1. **Implement Dashboard with Real Data**
   - Use `useDashboardData` hook
   - Display actual connections, events, stats
   - Replace mock data with API calls

2. **Add More Features**
   - Implement Network page
   - Implement Events page
   - Implement Mentorship page
   - Add search and filtering

3. **Improve Error Handling**
   - Add error boundaries
   - Show user-friendly error messages
   - Implement retry logic

4. **Add Loading States**
   - Show spinners during API calls
   - Implement skeleton screens
   - Add progress indicators

5. **Optimize Performance**
   - Implement caching with React Query
   - Add pagination for lists
   - Lazy load components

## 🎯 Success Criteria

Your frontend-backend connection is successful when:

- ✅ User can register and receive verification email
- ✅ User can login and receive JWT token
- ✅ Token is automatically added to all API requests
- ✅ Protected routes redirect to login when not authenticated
- ✅ Dashboard displays user information
- ✅ Logout clears authentication and redirects to login
- ✅ No CORS or network errors in browser console
- ✅ API calls show correct request/response in Network tab

## 📚 Resources

- [Axios Documentation](https://axios-http.com/docs/intro)
- [React Router Documentation](https://reactrouter.com/)
- [JWT.io](https://jwt.io/) - Debug JWT tokens
- [FRONTEND_BACKEND_INTEGRATION.md](FRONTEND_BACKEND_INTEGRATION.md) - Detailed integration guide
