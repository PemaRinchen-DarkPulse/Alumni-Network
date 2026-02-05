# Alumni Network - Frontend

React + TypeScript + Vite application for the Alumni Network platform.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running on http://localhost:8080

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file in the root directory:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Development

```bash
npm run dev
```

The application will run on http://localhost:5173

## Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── config/          # Configuration files (API setup)
├── services/        # API services for backend communication
├── context/         # React Context (Authentication)
├── hooks/           # Custom React hooks
├── components/      # React components
├── styles/          # CSS files
└── assets/          # Images and static files
```

## Features Implemented

✅ **Authentication**
- Login with JWT
- User registration
- Email verification
- Protected routes

✅ **API Integration**
- Axios HTTP client
- Auto token injection
- Error handling
- Request/Response interceptors

✅ **Services**
- Auth Service (login, register, verify)
- User Service (get users)
- Connection Service (send/accept requests)
- Event Service (RSVP, manage events)
- Mentorship Service (profiles, requests)
- Blog Service (posts management)

## Usage

### 1. Start the backend server
```bash
cd ../server
./mvnw spring-boot:run
```

### 2. Start the frontend
```bash
npm run dev
```

### 3. Access the application
Open http://localhost:5173 in your browser

### 4. Test the connection
- Register a new account
- Check email for verification
- Login with your credentials
- Access the dashboard

## API Services

All API services are located in `src/services/`. They use axios and automatically include authentication tokens.

Example usage:
```typescript
import { eventService } from '../services/eventService'

// Get all events
const response = await eventService.getAllEvents()
if (response.success) {
  setEvents(response.data)
}
```

## Authentication

The app uses JWT authentication with the following flow:

1. User logs in via Login.tsx
2. Token is stored in localStorage
3. Token is automatically added to all API requests
4. Protected routes check for valid token
5. User is redirected to login if unauthorized

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons

## Integration with Backend

See [FRONTEND_BACKEND_INTEGRATION.md](../FRONTEND_BACKEND_INTEGRATION.md) for detailed information about:
- API endpoints
- Authentication flow
- Service usage
- Error handling
- Troubleshooting
