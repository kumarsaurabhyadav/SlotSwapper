# 🎯 SlotSwapper - Peer-to-Peer Time Slot Scheduling Application

SlotSwapper is a full-stack web application that allows users to swap their calendar time slots with other users. Built with React frontend and Node.js/Express backend, featuring real-time notifications via Socket.io.

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

SlotSwapper enables users to:
- Create and manage calendar events
- Mark events as "swappable" for potential swaps
- Browse available swappable slots from other users
- Request swaps with other users
- Accept or reject incoming swap requests
- Receive real-time notifications for swap activities

### Example Flow:
1. User A marks their "Team Meeting" (Tuesday 10-11 AM) as swappable
2. User B marks their "Focus Block" (Wednesday 2-3 PM) as swappable
3. User A sees User B's slot and requests a swap, offering their Tuesday slot
4. User B receives a real-time notification
5. User B accepts the swap
6. Both calendars are automatically updated

## ✨ Features

### Core Features
- ✅ User Authentication (Sign Up / Log In with JWT)
- ✅ Calendar Management (Create, Read, Update, Delete events)
- ✅ Swappable Slots Marketplace
- ✅ Swap Request System (Request, Accept, Reject)
- ✅ Real-time Notifications (Socket.io)
- ✅ Protected Routes (Frontend & Backend)

### Bonus Features
- ✅ Real-time Notifications via WebSocket
- ✅ Transaction-safe swap handling
- ✅ Input validation and error handling
- ✅ Responsive UI with Bootstrap

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

### Base URL
```
http://localhost:4000/api
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Create new user account | No |
| POST | `/auth/login` | Login user | No |

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

## 🎨 Design Choices

### Database Schema
- **UUIDs** for all primary keys (better than sequential IDs for distributed systems)
- **ENUM types** for status fields (BUSY, SWAPPABLE, SWAP_PENDING)
- **Foreign keys** with CASCADE delete for data integrity
- **Indexes** on frequently queried columns (status fields)

### Authentication
- **JWT tokens** with 7-day expiration
- **bcrypt** for password hashing (10 rounds)
- **Bearer token** authentication for protected routes

### State Management
- **React Hooks** (useState, useEffect) for local state
- **API calls** refresh data after mutations
- **Real-time updates** via Socket.io for notifications

### Error Handling
- **Try-catch blocks** in all async operations
- **User-friendly error messages** in responses
- **Transaction rollback** on errors
- **Input validation** on both client and server

### Transaction Safety
- **Database transactions** for swap operations
- **Proper rollback** on errors
- **Prevent duplicate swaps** for same events
- **Handle concurrent requests** safely

## 🐛 Challenges & Solutions

### Challenge 1: Transaction Handling
**Problem:** Initial implementation used `db.query('BEGIN')` which doesn't work with connection pooling.

**Solution:** Use `db.getClient()` to get a dedicated client for transactions, ensuring proper BEGIN/COMMIT/ROLLBACK.

### Challenge 2: Real-time Notifications
**Problem:** Users needed instant notifications when swap requests were created/accepted/rejected.

**Solution:** Implemented Socket.io with user-specific rooms. When a swap action occurs, the server emits to the specific user's room.

### Challenge 3: Route Path Conflicts
**Problem:** Routes in `swaps.js` had `/api` prefix, but router was already mounted on `/api`.

**Solution:** Removed duplicate `/api` prefix from route definitions.

### Challenge 4: Field Name Mismatches
**Problem:** Frontend expected `user_name` but backend returned `owner_name`.

**Solution:** Standardized field names across backend queries and frontend components.

### Challenge 5: Data Refresh After Actions
**Problem:** UI didn't update automatically after swap actions.

**Solution:** Added explicit `loadRequests()` and `loadSwappableSlots()` calls after mutations, plus Socket.io listeners for automatic refresh.

## 🔮 Future Improvements

1. **Calendar View**: Add a visual calendar grid instead of just list view
2. **Email Notifications**: Send email notifications in addition to WebSocket
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
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/slotswap
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=4000
```

### Frontend
Update `client/src/services/api.js` and `client/src/services/socket.js` if backend URL changes.

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

