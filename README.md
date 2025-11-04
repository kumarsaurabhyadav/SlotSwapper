# 🎯 SlotSwapper - Peer-to-Peer Time Slot Scheduling Application

SlotSwapper is a full-stack web application that allows users to swap their calendar time slots with other users. Built with React frontend and Node.js/Express backend, featuring real-time notifications via Socket.io.

## 📦 Repository & Deployment

- **GitHub Repository**: [Your Repository Link](https://github.com/yourusername/slotswap-backend)
- **Live Application**: [Deployed Application Link](https://your-app-url.com) _(Add your deployment URL here)_

> **Note**: Replace the repository and deployment links above with your actual URLs.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Design Choices](#design-choices)
- [Challenges & Solutions](#challenges--solutions)
- [Future Improvements](#future-improvements)

## 🎯 Overview

SlotSwapper is a peer-to-peer time slot scheduling application that enables users to exchange their calendar time slots with other users. The application provides a seamless experience for finding available slots, requesting swaps, and managing swap requests in real-time.

### Key Capabilities

SlotSwapper enables users to:
- **Create and manage calendar events** - Add events with title, start time, and end time
- **Mark events as swappable** - Convert busy slots into swappable opportunities
- **Browse available swappable slots** - Discover slots from other users in the marketplace
- **Request swaps** - Offer your swappable slot in exchange for another user's slot
- **Accept or reject swap requests** - Manage incoming swap requests
- **Receive real-time notifications** - Get instant updates via WebSocket when swap actions occur

### Example Flow:
1. User A marks their "Team Meeting" (Tuesday 10-11 AM) as swappable
2. User B marks their "Focus Block" (Wednesday 2-3 PM) as swappable
3. User A sees User B's slot and requests a swap, offering their Tuesday slot
4. User B receives a real-time notification
5. User B accepts the swap
6. Both calendars are automatically updated - User A now has Wednesday slot, User B has Tuesday slot

## ✨ Features

### Core Features
- ✅ User Authentication (Sign Up / Log In with JWT)
- ✅ Password Reset (Forgot Password functionality)
- ✅ Calendar Management (Create, Read, Update, Delete events)
- ✅ Swappable Slots Marketplace
- ✅ Swap Request System (Request, Accept, Reject)
- ✅ Real-time Notifications (Socket.io)
- ✅ Protected Routes (Frontend & Backend)

### Bonus Features
- ✅ Real-time Notifications via WebSocket
- ✅ Password Reset Flow
- ✅ Transaction-safe swap handling
- ✅ Input validation and error handling
- ✅ Responsive UI with Bootstrap
- ✅ Modern UI with animations and transitions

## 🛠 Technology Stack

### Frontend
- **React 19** - UI framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Bootstrap 5** - UI styling

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **PostgreSQL** - Database
- **Socket.io** - WebSocket server
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Development Tools
- **Docker** - PostgreSQL containerization
- **Nodemon** - Development server auto-reload

## 📁 Project Structure

```
slotswap-backend/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components (Navbar)
│   │   ├── pages/          # Page components (Login, Dashboard, etc.)
│   │   ├── services/       # API & Socket services
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main app component
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/    # Auth middleware
│   │   ├── services/       # Business logic
│   │   ├── db.js           # Database connection
│   │   └── index.js        # Server entry point
│   ├── schema.sql          # Database schema
│   ├── docker-compose.yml  # PostgreSQL setup
│   └── package.json
│
└── README.md               # This file
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker Desktop (for PostgreSQL)
- Git

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd slotswap-backend
```

### Step 2: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/slotswap
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=4000
EOF

# Start PostgreSQL using Docker
docker-compose up -d

# Wait a few seconds for PostgreSQL to start, then apply schema
cat schema.sql | docker exec -i slotswapper_db psql -U postgres -d slotswap

# Start the backend server
npm run dev
```

The backend should now be running on `http://localhost:4000`

### Step 3: Frontend Setup

```bash
# Open a new terminal, navigate to client directory
cd client

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend should now be running on `http://localhost:3000`

### Step 4: Verify Setup

1. Open `http://localhost:3000` in your browser
2. Create a new account (Sign Up)
3. You should see the Dashboard page
4. Create a test event
5. Mark it as "Swappable"
6. Check the Marketplace page to see your slot

## 📚 API Documentation

For complete API documentation with request/response examples, see [API_REFERENCE.md](./API_REFERENCE.md).

### Quick Reference

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Create new user account | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |

**Signup Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { "id": "...", "name": "John Doe", "email": "..." },
  "token": "jwt_token_here"
}
```

**Forgot Password Request:**
```json
{
  "email": "user@example.com"
}
```

**Reset Password Request:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "new_password_here"
}
```

#### Events

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/events` | Get all events for logged-in user | Yes |
| POST | `/events` | Create new event | Yes |
| PATCH | `/events/:id` | Update event | Yes |
| DELETE | `/events/:id` | Delete event | Yes |

**Create Event Request:**
```json
{
  "title": "Team Meeting",
  "start_time": "2024-01-15T10:00:00Z",
  "end_time": "2024-01-15T11:00:00Z"
}
```

**Update Event Request:**
```json
{
  "status": "SWAPPABLE"
}
```

#### Swaps

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/swappable-slots` | Get all swappable slots from other users | Yes |
| GET | `/swap-requests` | Get incoming and outgoing swap requests | Yes |
| POST | `/swap-request` | Create swap request | Yes |
| POST | `/swap-response/:requestId` | Accept/reject swap request | Yes |

**Create Swap Request:**
```json
{
  "mySlotId": "uuid-of-your-slot",
  "theirSlotId": "uuid-of-their-slot"
}
```

**Respond to Swap Request:**
```json
{
  "accept": true
}
```

### WebSocket Events

The application uses Socket.io for real-time notifications:

**Client Events:**
- `join_user_room` - Join user-specific room (emitted with userId)

**Server Events:**
- `swap_request_received` - New swap request received
- `swap_request_accepted` - Swap request was accepted
- `swap_request_rejected` - Swap request was rejected

> **Note**: For detailed API documentation with request/response examples, error codes, and WebSocket usage, see [API_REFERENCE.md](./API_REFERENCE.md).

## 🎨 Design Choices

This section outlines the key design decisions made during the development of SlotSwapper.

### Database Schema
- **UUIDs for Primary Keys**: Using UUIDs instead of sequential IDs provides better scalability for distributed systems and prevents ID enumeration attacks
- **ENUM Types for Status**: Using PostgreSQL ENUMs (`event_status`, `swap_status`) ensures data integrity and makes status values explicit
- **Foreign Keys with CASCADE**: Foreign key relationships with CASCADE delete ensure referential integrity and automatic cleanup
- **Indexes on Status Fields**: Indexes on frequently queried columns (e.g., `event_status`, `swap_status`) improve query performance

### Authentication & Security
- **JWT Tokens**: Stateless authentication with 7-day expiration provides scalability and user convenience
- **bcrypt Password Hashing**: 10 rounds of bcrypt hashing provide strong password security
- **Bearer Token Authentication**: Standard REST API authentication pattern for protected routes
- **Password Reset Tokens**: Time-limited UUID tokens (1-hour expiry) for secure password reset

### State Management
- **React Hooks**: Using `useState` and `useEffect` for local component state management keeps the architecture simple
- **API-Driven Updates**: Data refresh after mutations ensures UI consistency
- **Real-time Updates**: Socket.io provides instant notifications without polling

### Error Handling
- **Comprehensive Try-Catch**: All async operations wrapped in try-catch blocks
- **User-Friendly Messages**: Clear, actionable error messages in API responses
- **Transaction Rollback**: Database transactions ensure atomicity - rollback on any error
- **Input Validation**: Validation on both client (UX) and server (security) sides

### Transaction Safety
- **Atomic Swap Operations**: Database transactions ensure swap operations are atomic
- **Proper Rollback**: Errors trigger automatic rollback to maintain data consistency
- **Duplicate Prevention**: Unique constraints prevent duplicate swap requests
- **Concurrent Request Handling**: Transaction isolation handles concurrent requests safely

## 🐛 Challenges & Solutions

This section documents the key challenges encountered during development and their solutions.

### Challenge 1: Transaction Handling
**Problem:** Initial implementation used `db.query('BEGIN')` which doesn't work with connection pooling. PostgreSQL connection pools require a dedicated client for transactions.

**Solution:** Implemented `db.getClient()` to acquire a dedicated client from the pool for each transaction. This ensures proper BEGIN/COMMIT/ROLLBACK lifecycle and prevents connection leaks.

### Challenge 2: Real-time Notifications
**Problem:** Users needed instant notifications when swap requests were created/accepted/rejected, but polling would be inefficient and create unnecessary load.

**Solution:** Implemented Socket.io with user-specific rooms. Each user joins a room (`user_{userId}`) on connection. When a swap action occurs, the server emits to the specific user's room, providing instant, targeted notifications.

### Challenge 3: Route Path Conflicts
**Problem:** Routes in `swaps.js` had `/api` prefix, but the router was already mounted on `/api` in `index.js`, causing 404 errors.

**Solution:** Removed duplicate `/api` prefix from route definitions. Routes are now relative to their mount point.

### Challenge 4: Field Name Mismatches
**Problem:** Frontend expected `user_name` but backend SQL queries returned `owner_name`, causing undefined field errors in the UI.

**Solution:** Standardized field names across backend queries and frontend components. Updated SQL aliases to use `user_name` consistently.

### Challenge 5: Data Refresh After Actions
**Problem:** UI didn't update automatically after swap actions, requiring manual page refresh to see changes.

**Solution:** Added explicit data refresh calls (`loadRequests()`, `loadSwappableSlots()`) after mutations, plus Socket.io listeners that automatically refresh data when notifications are received.

### Challenge 6: Swap Request Race Conditions
**Problem:** Multiple users could request swaps for the same slot simultaneously, potentially creating duplicate or conflicting requests.

**Solution:** Implemented database transactions with proper locking and validation checks. The system verifies slot availability and status before creating swap requests, preventing duplicates.

### Challenge 7: Password Reset Security
**Problem:** Password reset tokens needed to be secure and time-limited, but also easily accessible for testing.

**Solution:** Implemented UUID-based tokens with 1-hour expiry. In development mode, tokens are returned in the response for testing. In production mode, tokens should be sent via email (email service integration pending).

## 🔮 Future Improvements

1. **Calendar View**: Add a visual calendar grid instead of just list view
2. **Email Notifications**: Send email notifications for password reset (currently returns token in response)
3. **Search & Filters**: Filter swappable slots by date, time, or user
4. **Swap History**: Show past successful swaps
5. **User Profiles**: Add user profiles with ratings/reviews
6. **Conflict Detection**: Warn users about overlapping events
7. **Recurring Events**: Support for recurring calendar events
8. **Unit Tests**: Add comprehensive test coverage
9. **Deployment**: Deploy to production (Vercel/Netlify for frontend, Render/Heroku for backend)
10. **Docker Compose**: Include backend in docker-compose for easier deployment

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/slotswap
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=4000
FRONTEND_URL=http://localhost:3000
```

### Frontend Configuration
Update `client/src/services/api.js` and `client/src/services/socket.js` if backend URL changes.

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy Options:**

1. **Render (Free Tier)** - Backend + Database
2. **Vercel (Free Tier)** - Frontend
3. **Railway** - Full-stack deployment
4. **Heroku** - Backend
5. **Docker Compose** - Self-hosted

**Environment Variables for Production:**

Backend:
```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
JWT_SECRET=strong_secret_min_32_chars
FRONTEND_URL=https://your-frontend-domain.com
```

Frontend:
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_SOCKET_URL=https://your-backend-domain.com
```

## 🧪 Testing

### Manual Testing Flow

1. **Create Two Users:**
   - Sign up as User A
   - Sign up as User B (use incognito/private window)

2. **Create Events:**
   - User A: Create event "Team Meeting" (Tuesday 10-11 AM)
   - User B: Create event "Focus Block" (Wednesday 2-3 PM)

3. **Make Events Swappable:**
   - Both users: Mark their events as "Swappable"

4. **Request Swap:**
   - User A: Go to Marketplace, see User B's slot
   - User A: Click "Request Swap", select their slot
   - User B: Should receive real-time notification

5. **Accept Swap:**
   - User B: Go to Requests page
   - User B: Accept the swap request
   - User A: Should receive notification
   - Both users: Check Dashboard - events should be swapped

## 📄 License


**Note:** This is a demonstration project. For production use, consider:
- Using environment-specific secrets
- Implementing rate limiting
- Adding comprehensive error logging
- Setting up CI/CD pipelines
- Adding database backups
- Implementing proper security headers

