# Frontend-Backend Connection Guide

## 🔗 Connection Status: ACTIVE

Your Alumni Network frontend is now fully connected to the Spring Boot backend!

## What's Connected:

### ✅ User Registration
- Frontend: `useRegistration.js` hook
- Backend: `POST /api/auth/register`
- Status: **Connected**

### ✅ User Login
- Frontend: `useLogin.js` hook
- Backend: `POST /api/auth/login`
- Status: **Connected**

### ✅ Email Verification
- Frontend: `VerifyEmail.jsx` component
- Backend: `GET /api/auth/verify-email`
- Status: **Connected**

### ✅ Auth Helpers
- Frontend: `useAuthHelpers.js` hook
- Backend: Ready for implementation
- Functions: Forgot Password, Reset Password, Resend Verification

## API Configuration

### Backend Base URL
```javascript
http://localhost:8080/api
```

### Frontend Configuration
Location: `client/src/utils/constants.js`

```javascript
export const API_BASE_URL = 'http://localhost:8080/api';
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VERIFY_EMAIL: '/auth/verify-email',
    ...
  }
};
```

## Quick Start

### 1. Start the Backend
```bash
cd server
./mvnw spring-boot:run
```
Server runs on: http://localhost:8080

### 2. Start the Frontend
```bash
cd client
npm run dev
```
Frontend runs on: http://localhost:5173

## How It Works

### Registration Flow:
1. User fills registration form → `Auth.jsx`
2. Form submits → `handleSignupSubmit()` → `register()` from `useAuth()`
3. `useRegistration.js` → Makes API call to backend
4. Backend validates → Creates user → Sends verification token
5. User receives success message → Redirected to verify email page

### Login Flow:
1. User fills login form → `Auth.jsx`
2. Form submits → `handleLoginSubmit()` → `login()` from `useAuth()`
3. `useLogin.js` → Makes API call to backend
4. Backend validates credentials → Checks email verification
5. Returns JWT token + user data
6. Token stored in localStorage
7. User redirected to dashboard

## Testing the Connection

### Test Registration:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "STUDENT",
    "batch": "2024"
  }'
```

### Test Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Authentication Features

### JWT Token
- Generated on successful login
- Stored in localStorage
- Valid for 24 hours
- Contains: userId, email, role

### Password Security
- Encrypted with BCrypt
- Minimum 8 characters required
- Validated on both frontend and backend

### Email Verification
- Required before login
- Token valid for 24 hours
- Token logged to console in development

## CORS Configuration

Backend allows requests from:
- http://localhost:5173 (Vite default)
- http://localhost:3000 (Alternative port)

## Data Flow

```
Frontend (React)
    ↓
hooks/useRegistration.js, useLogin.js
    ↓
services/api.js (optional wrapper)
    ↓
utils/constants.js (API URLs)
    ↓
fetch() → http://localhost:8080/api/auth/*
    ↓
Backend (Spring Boot)
    ↓
AuthController.java
    ↓
AuthService.java
    ↓
UserRepository.java
    ↓
MySQL Database
```

## Environment Variables (Future Enhancement)

Consider moving API URL to environment variable:

**.env**
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

**constants.js**
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

## Troubleshooting

### Backend not responding?
1. Check if MySQL is running
2. Verify backend is running on port 8080
3. Check console for errors

### CORS errors?
1. Verify backend CORS configuration includes your frontend URL
2. Check SecurityConfig.java

### Login not working?
1. Ensure email is verified first
2. Check password is at least 8 characters
3. Verify user exists in database

## Next Steps

- [ ] Add token refresh mechanism
- [ ] Implement logout endpoint
- [ ] Add user profile update
- [ ] Implement password reset flow
- [ ] Add email service integration
- [ ] Add rate limiting
- [ ] Add request/response interceptors

## Security Notes

⚠️ **Development Mode:**
- JWT secret is generated in-memory (will reset on server restart)
- Verification tokens printed to console
- CSRF protection disabled

🔒 **For Production:**
- Move JWT secret to environment variable
- Enable CSRF protection
- Use proper email service
- Add HTTPS
- Add rate limiting
- Enable security headers

## Support

If you encounter any issues:
1. Check both backend and frontend console logs
2. Verify MySQL connection
3. Ensure all dependencies are installed
4. Check API endpoints match between frontend and backend

---

**Status**: ✅ Fully Connected and Ready to Use!
