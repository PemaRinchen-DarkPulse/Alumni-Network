# Alumni Network — Codebase Overview

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Backend (Spring Boot)](#backend-spring-boot)
   - [Models](#models)
   - [Controllers & Endpoints](#controllers--endpoints)
   - [Services](#services)
   - [DTOs](#dtos)
   - [Repositories](#repositories)
   - [Config & Security](#config--security)
5. [Frontend (React + TypeScript)](#frontend-react--typescript)
   - [Routing](#routing)
   - [Landing Page](#landing-page)
   - [Auth Flow](#auth-flow)
   - [Dashboard](#dashboard)
   - [Feature Modules](#feature-modules)
   - [Services (Client)](#services-client)
   - [Context & Hooks](#context--hooks)
6. [Environment Variables](#environment-variables)
7. [Running the Project](#running-the-project)

---

## Project Overview

**Alumni Network** is a full-stack web platform that connects students, alumni, and teachers of an institution. It supports networking, mentorship, event management, blogging, community Q&A, and tributes to teachers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite (rolldown), React Router v7, Axios, lucide-react |
| Backend | Spring Boot 4.0.1, Java 21, Spring Security, Spring Data JPA |
| Database | MySQL |
| Auth | JWT (jjwt 0.12.3), BCrypt |
| Email | Brevo (Sendinblue) REST API |
| Build Tool | Maven |
| Dev tools | Lombok, spring-dotenv, Spring DevTools |

---

## Project Structure

```
Alumni-Network/
├── client/                   # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx           # Root component with routes
│   │   ├── components/       # All page and UI components
│   │   │   └── dashboard/    # Dashboard sub-components
│   │   ├── config/api.ts     # Axios instance with interceptors
│   │   ├── context/          # React context (AuthContext)
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # API service wrappers
│   │   └── styles/           # Component-level CSS files
│   └── package.json
└── server/                   # Spring Boot backend
    └── src/main/java/com/server/server/
        ├── config/           # Security, JWT, CORS, async config
        ├── controller/       # REST controllers
        ├── dto/              # Request/Response data transfer objects
        ├── model/            # JPA entities
        ├── repository/       # Spring Data JPA repositories
        └── service/          # Business logic services
```

---

## Backend (Spring Boot)

### Models

| Entity | Table | Key Fields |
|---|---|---|
| `User` | `users` | `id`, `name`, `email` (unique), `password`, `role` (STUDENT / ALUMNI / TEACHER), `batch`, `emailVerified`, `verificationToken`, `tokenExpiry`, `resetToken`, `resetTokenExpiry` |
| `BlogPost` | `blog_posts` | `id`, `title`, `content`, `category`, `tags` (element collection), `featuredImage` (BLOB), `authorId`, `authorName`, `status` (DRAFT / PUBLISHED / ARCHIVED), `viewCount`, `likeCount`, `commentCount`, `publishedAt` |
| `Connection` | `connections` | `id`, `sender` (→ User), `receiver` (→ User), `status` (PENDING / ACCEPTED / REJECTED) |
| `Event` | `events` | `id`, `title`, `description`, `startDateTime`, `endDateTime`, `location`, `meetingLink`, `capacity`, `attendeeCount`, `attendees` (ManyToMany → User), `isVirtual`, `isFeatured`, `visibility` (PUBLIC), `maxAttendees`, `bannerImage` (BLOB), `createdBy` |
| `MentorshipProfile` | `mentorship_profiles` | `id`, `userId` (unique), `professionalHeadline`, `bio`, `expertise` (list), `selectedTopics` (list), `otherTopics` (list), `openForBookings`, `maxHoursPerMonth`, `timezone`, `status` (DRAFT / PUBLISHED) |
| `MentorshipRequest` | *(separate table)* | Mentorship request between two users |
| `Question` | `questions` | `id`, `title`, `description`, `category`, `tags` (list), `authorId`, `authorName`, `isAnonymous`, `status` (DRAFT / PUBLISHED), `viewCount`, `answerCount`, `upvoteCount` |
| `Tribute` | `tributes` | `id`, `teacherName`, `department`, `subject`, `yearsFrom`, `yearsTo`, `message`, `authorId`, `authorName`, `likeCount`, `status` (PENDING / PUBLISHED / ARCHIVED), `publishedAt` |
| `UserSettings` | *(settings table)* | User-specific platform settings |

---

### Controllers & Endpoints

#### `AuthController` — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user (sends verification email) |
| POST | `/login` | Authenticate user, returns JWT |
| GET | `/verify-email?token=` | Verify email address |
| POST | `/resend-verification` | Resend email verification link |
| POST | `/forgot-password` | Send password reset email |
| POST | `/reset-password` | Reset password with token |
| GET | `/validate-reset-token?token=` | Validate password reset token |

#### `UserController` — `/api/users`
User profile management, user lookup.

#### `ConnectionController` — `/api/connections`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/send` | Send connection request |
| POST | `/{connectionId}/accept` | Accept a connection request |
| POST | `/{connectionId}/reject` | Reject a connection request |
| GET | `/user/{userId}` | Get a user's connections |
| GET | `/stats/{userId}` | Connection statistics |

#### `EventController` — `/api/events`
Create, list, update, delete events; RSVP management.

#### `BlogPostController` — `/api/blog`
Create, publish, list, view, like/unlike blog posts.

#### `MentorshipController` — `/api/mentorship`
Mentor profile creation and discovery, sending/managing mentorship requests.

#### `QuestionController` — `/api/questions`
Post and browse community questions; upvoting.

#### `TributeController` — `/api/tributes`
Submit, publish, and view tributes to teachers.

#### `UserSettingsController` — `/api/settings`
Read and update user settings.

---

### Services

| Service | Responsibility |
|---|---|
| `AuthService` | Registration, login, JWT generation & validation, email verification, password reset |
| `EmailService` | Sends transactional emails via Brevo REST API (verification, password reset) |
| `ConnectionService` | Connection request lifecycle (send, accept, reject, query) |
| `EventService` | Event CRUD, RSVP tracking, attendee management |
| `BlogPostService` | Blog creation, publishing, view/like tracking |
| `MentorshipProfileService` | Mentor profile creation and management |
| `MentorshipRequestService` | Mentorship request lifecycle |
| `QuestionService` | Community Q&A CRUD and upvoting |
| `TributeService` | Tribute submission, moderation, publishing |
| `UserService` | User profile lookup and management |
| `UserSettingsService` | User preferences persistence |
| `UserCleanupService` | Cleanup of unverified / stale user accounts |

---

### DTOs

| DTO | Purpose |
|---|---|
| `LoginRequest` / `LoginResponse` | Auth login payload and response |
| `RegistrationRequest` / `RegistrationResponse` | Registration payload and response |
| `BlogPostDTO` / `BlogPostRequest` | Blog read and write payloads |
| `ConnectionDTO` / `ConnectionRequestDTO` | Connection read and write payloads |
| `EventDTO` / `EventRequest` | Event read and write payloads |
| `MentorDTO` | Mentor listing data |
| `MentorshipProfileDTO` / `MentorshipProfileRequest` | Mentor profile read/write |
| `MentorshipRequestDTO` / `MentorshipRequestRequest` | Mentorship request read/write |
| `QuestionDTO` / `QuestionRequest` | Community question read/write |
| `TributeDTO` / `TributeRequest` | Tribute read/write |
| `UserDTO` | Public user profile data |
| `UserSettingsDTO` | User settings data |
| `ErrorResponse` | Standardised error envelope |

---

### Repositories

All repositories extend `JpaRepository`:

- `UserRepository`
- `BlogPostRepository`
- `ConnectionRepository`
- `EventRepository`
- `MentorshipProfileRepository`
- `MentorshipRequestRepository`
- `QuestionRepository`
- `TributeRepository`
- `UserSettingsRepository`

---

### Config & Security

| Class | Role |
|---|---|
| `SecurityConfig` | Defines the security filter chain — stateless JWT sessions, CORS, public/protected routes via `requestMatchers`, BCrypt password encoder |
| `JwtAuthenticationFilter` | Intercepts requests, validates the Bearer JWT from `Authorization` header, sets `SecurityContextHolder` |
| `WebConfig` | Additional web MVC configuration |
| `AsyncConfig` | Enables `@Async` for non-blocking operations (e.g., sending emails) |
| `DotenvConfig` | Loads `.env` variables into Spring environment via `spring-dotenv` |

**Security notes:**
- All `/api/auth/**` routes are public.
- JWT is stateless — no server-side session.
- Passwords hashed with BCrypt.
- CORS allows `http://localhost:5173` and `http://localhost:3000`.

---

## Frontend (React + TypeScript)

### Routing

| Path | Component | Auth Required |
|---|---|---|
| `/` | Landing page (Navbar + sections + Footer) | No |
| `/login` | `Login` | No |
| `/signup` | `SignUp` | No |
| `/verify-email` | `VerifyEmail` | No |
| `/forgot-password` | `ForgotPassword` | No |
| `/reset-password` | `ResetPassword` | No |
| `/dashboard` | `Dashboard` | **Yes** (ProtectedRoute) |

---

### Landing Page

Composed of the following sections rendered in order on `/`:

1. `Navbar` — navigation bar
2. `Hero` — hero / banner section
3. `ProblemSolution` — problem/solution pitch
4. `Stats` — platform statistics
5. `HowItWorks` — step-by-step platform guide
6. `AboutUs` — about the platform
7. `CTA` — call to action
8. `Contact` — contact section
9. `Footer` — site footer

---

### Auth Flow

| Component | Functionality |
|---|---|
| `SignUp` | Registration form (name, email, password, role, batch) → sends verification email |
| `Login` | Email + password → JWT stored in `localStorage` |
| `VerifyEmail` | Reads `?token=` from URL, calls verify-email endpoint |
| `ForgotPassword` | Submits email, triggers password reset email |
| `ResetPassword` | Token + new password form |
| `ProtectedRoute` | Redirects unauthenticated users to `/login` |

**AuthContext** (`context/AuthContext.tsx`) manages:
- `user` — current user object (id, email, name, role, batch)
- `token` — JWT string
- `login(token, user)` / `logout()` — persisted to `localStorage`
- `isAuthenticated` — boolean derived from token presence
- `isLoading` — initial hydration flag (prevents flash redirect)

---

### Dashboard

`Dashboard.tsx` is the main authenticated shell. It renders a **Sidebar** navigating between sections. Menu items are **role-aware**:

| Role | Main Menu | Feature Menu |
|---|---|---|
| STUDENT / ALUMNI | Dashboard, Networking, Community Mentorship, Events | Nexus, Blogs, Tribute |
| TEACHER | Dashboard, Networking, Events | Nexus, Blogs, Tribute, Feedback |

**Settings menu** (all roles): Profile, Settings, Log out

#### Dashboard Home Sub-components (`components/dashboard/`)

| Component | Purpose |
|---|---|
| `DashboardHeader` | Greeting, user name, date |
| `StatsRow` | Key user stats (total connections, mentees, mentors) |
| `QuickActionsCard` | Shortcuts to create post/event/tributes |
| `NetworkActivityChart` | Chart of network growth activity |
| `GoalsCard` | User-set goals progress |
| `RecentConnectionsTable` | Table of latest connections |
| `UpcomingEventsCard` | Next events the user has RSVP'd to |

---

### Feature Modules

| Section | Component | Description |
|---|---|---|
| Networking | `Networking.tsx` | Browse all users, send/manage connection requests |
| Community Mentorship | `Mentorship.tsx` | Browse mentors, send mentorship requests, manage own mentor profile |
| Events | `Events.tsx` | Browse, create, RSVP to events |
| Blogs | `Blog.tsx` | Browse/create/view blog posts |
| Nexus | `Nexus.tsx` | Community Q&A (Ask Community) |
| Tribute | `Tributes.tsx` | Post and read tributes to teachers |
| Settings | `Settings.tsx` | Update profile and platform preferences |

Supporting components: `CreateEvent.tsx`, `CreatePost.tsx`, `CreateTribute.tsx`, `AskCommunity.tsx`, `BlogCard.tsx`

---

### Services (Client)

All services use the shared `apiClient` (Axios instance from `config/api.ts`):

| Service | File | Key Operations |
|---|---|---|
| `authService` | `authService.ts` | login, register, verifyEmail, resendVerification, forgotPassword, resetPassword, validateResetToken, logout |
| `connectionService` | `connectionService.ts` | send request, accept/reject, getUserConnections, getConnectionStats |
| `eventService` | `eventService.ts` | getAllEvents, createEvent, rsvp, cancel RSVP |
| `blogService` | `blogService.ts` | create, publish, list, view, like posts |
| `mentorshipService` | `mentorshipService.ts` | get mentors, create/update profile, send/manage requests |
| `questionService` | `questionService.ts` | list, create, upvote questions |
| `tributeService` | `tributeService.ts` | list, create tributes |
| `userService` | `userService.ts` | get/update user profile |
| `settingsService` | `settingsService.ts` | get/update user settings |

**`config/api.ts`** features:
- Base URL from `VITE_API_BASE_URL` env (fallback: `http://localhost:8080`)
- **Request interceptor** — automatically attaches `Authorization: Bearer <token>` from `localStorage`
- **Response interceptor** — handles `401` by clearing auth state and redirecting to `/login` (skips redirect if already on auth pages)

---

### Context & Hooks

| File | Purpose |
|---|---|
| `context/AuthContext.tsx` | Global auth state (user, token, login, logout, isAuthenticated, isLoading) |
| `hooks/useDashboardData.ts` | Fetches connections, connection stats, and upcoming events for the dashboard home |

---

## Environment Variables

### Server (`.env` file at `server/` root)

| Variable | Description |
|---|---|
| `DB_URL` | MySQL JDBC URL |
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | Secret key for JWT signing (Base64) |
| `JWT_EXPIRATION` | JWT TTL in milliseconds (default: 86400000 = 24h) |
| `BREVO_API_KEY` | Brevo (email service) API key |
| `FRONTEND_URL` | Frontend URL for email links |
| `MAIL_FROM_EMAIL` | Sender email address |
| `MAIL_FROM_NAME` | Sender display name |

### Client (`.env` file at `client/` root)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend base URL (default: `http://localhost:8080`) |

---

## Running the Project

### Backend
```bash
cd server
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### Frontend
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

> Make sure MySQL is running and the `.env` files are configured before starting.
