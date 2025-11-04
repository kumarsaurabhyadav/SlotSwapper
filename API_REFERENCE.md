# 📚 API Reference - SlotSwapper

Complete API documentation for SlotSwapper backend.

## Base URL

```
Development: http://localhost:4000/api
Production: https://your-backend-domain.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication Endpoints

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Signup successful",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

**Status Codes:**
- `201` - Success
- `400` - Validation error (email format, password length, etc.)
- `500` - Server error

---

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

**Status Codes:**
- `200` - Success
- `400` - Missing fields
- `401` - Invalid credentials
- `500` - Server error

---

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response (Development):**
```json
{
  "message": "If email exists, reset link has been sent",
  "resetToken": "uuid_token",
  "resetLink": "http://localhost:3000/reset-password?token=uuid_token"
}
```

**Response (Production):**
```json
{
  "message": "If email exists, reset link has been sent to your email"
}
```

**Status Codes:**
- `200` - Success (always returns success for security)
- `400` - Invalid email format
- `500` - Server error

---

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "new_password_123"
}
```

**Response:**
```json
{
  "message": "Password reset successful"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid/expired token or password too short
- `500` - Server error

---

### Event Endpoints

#### Get All Events
```http
GET /api/events
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Team Meeting",
    "start_time": "2024-01-15T10:00:00Z",
    "end_time": "2024-01-15T11:00:00Z",
    "status": "BUSY",
    "created_at": "2024-01-15T09:00:00Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

---

#### Create Event
```http
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Team Meeting",
  "start_time": "2024-01-15T10:00:00Z",
  "end_time": "2024-01-15T11:00:00Z"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "Team Meeting",
  "start_time": "2024-01-15T10:00:00Z",
  "end_time": "2024-01-15T11:00:00Z",
  "status": "BUSY",
  "created_at": "2024-01-15T09:00:00Z"
}
```

**Status Codes:**
- `201` - Created
- `400` - Validation error (missing fields, end_time <= start_time)
- `401` - Unauthorized
- `500` - Server error

---

#### Update Event
```http
PATCH /api/events/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Meeting",
  "status": "SWAPPABLE"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "Updated Meeting",
  "start_time": "2024-01-15T10:00:00Z",
  "end_time": "2024-01-15T11:00:00Z",
  "status": "SWAPPABLE",
  "created_at": "2024-01-15T09:00:00Z"
}
```

**Valid Status Values:**
- `BUSY` - Event is busy
- `SWAPPABLE` - Event is available for swap
- `SWAP_PENDING` - Event is in a pending swap (cannot be changed)

**Status Codes:**
- `200` - Success
- `400` - Validation error or status is SWAP_PENDING
- `401` - Unauthorized
- `404` - Event not found
- `500` - Server error

---

#### Delete Event
```http
DELETE /api/events/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Event deleted successfully"
}
```

**Status Codes:**
- `200` - Success
- `400` - Cannot delete event in SWAP_PENDING status
- `401` - Unauthorized
- `404` - Event not found
- `500` - Server error

---

### Swap Endpoints

#### Get Swappable Slots
```http
GET /api/swappable-slots
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Focus Block",
    "start_time": "2024-01-16T14:00:00Z",
    "end_time": "2024-01-16T15:00:00Z",
    "status": "SWAPPABLE",
    "created_at": "2024-01-16T13:00:00Z",
    "user_name": "Jane Doe",
    "owner_email": "jane@example.com"
  }
]
```

**Note:** Returns only slots from other users (not your own).

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

---

#### Get Swap Requests
```http
GET /api/swap-requests
Authorization: Bearer <token>
```

**Response:**
```json
{
  "incoming": [
    {
      "id": "uuid",
      "status": "PENDING",
      "created_at": "2024-01-15T10:00:00Z",
      "from_user_name": "Jane Doe",
      "my_slot_title": "Team Meeting",
      "my_slot_start": "2024-01-15T10:00:00Z",
      "my_slot_end": "2024-01-15T11:00:00Z",
      "their_slot_title": "Focus Block",
      "their_slot_start": "2024-01-16T14:00:00Z",
      "their_slot_end": "2024-01-16T15:00:00Z"
    }
  ],
  "outgoing": [
    {
      "id": "uuid",
      "status": "PENDING",
      "created_at": "2024-01-15T10:00:00Z",
      "to_user_name": "Jane Doe",
      "my_slot_title": "Team Meeting",
      "my_slot_start": "2024-01-15T10:00:00Z",
      "my_slot_end": "2024-01-15T11:00:00Z",
      "their_slot_title": "Focus Block",
      "their_slot_start": "2024-01-16T14:00:00Z",
      "their_slot_end": "2024-01-16T15:00:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

---

#### Create Swap Request
```http
POST /api/swap-request
Authorization: Bearer <token>
Content-Type: application/json

{
  "mySlotId": "uuid-of-your-slot",
  "theirSlotId": "uuid-of-their-slot"
}
```

**Response:**
```json
{
  "id": "uuid",
  "requester_id": "uuid",
  "responder_id": "uuid",
  "requester_event_id": "uuid",
  "responder_event_id": "uuid",
  "status": "PENDING",
  "created_at": "2024-01-15T10:00:00Z"
}
```

**Status Codes:**
- `201` - Created
- `400` - Invalid slots, already exists, or same user
- `401` - Unauthorized
- `500` - Server error

---

#### Respond to Swap Request
```http
POST /api/swap-response/:requestId
Authorization: Bearer <token>
Content-Type: application/json

{
  "accept": true
}
```

**Response (Accept):**
```json
{
  "message": "Swap accepted successfully ✅"
}
```

**Response (Reject):**
```json
{
  "message": "Swap rejected ❌"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request or already processed
- `401` - Unauthorized
- `404` - Request not found
- `500` - Server error

---

### Health Check

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "ok": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "environment": "production"
}
```

**Status Codes:**
- `200` - Service is healthy

---

## WebSocket Events (Socket.io)

### Client Events

#### Join User Room
```javascript
socket.emit('join_user_room', userId);
```
Joins a user-specific room for targeted notifications.

### Server Events

#### Swap Request Received
```javascript
socket.on('swap_request_received', (data) => {
  // data: { message: string, requestId: string }
});
```
Emitted when a swap request is created for the current user.

#### Swap Request Accepted
```javascript
socket.on('swap_request_accepted', (data) => {
  // data: { message: string, requestId: string }
});
```
Emitted when a swap request you created is accepted.

#### Swap Request Rejected
```javascript
socket.on('swap_request_rejected', (data) => {
  // data: { message: string, requestId: string }
});
```
Emitted when a swap request you created is rejected.

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here"
}
```

### Common Error Status Codes

- `400` - Bad Request (validation errors, invalid input)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error (server-side errors)

---

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider implementing rate limiting for authentication endpoints.

---

## Data Types

### Event Status
- `BUSY` - Event is busy
- `SWAPPABLE` - Event is available for swap
- `SWAP_PENDING` - Event is in a pending swap

### Swap Status
- `PENDING` - Swap request is pending
- `ACCEPTED` - Swap request was accepted
- `REJECTED` - Swap request was rejected

### Timestamps
All timestamps are in ISO 8601 format (UTC):
```
2024-01-15T10:00:00Z
```

---

## Postman Collection

To test the API, you can use the following endpoints:

1. **Sign Up**: `POST /api/auth/signup`
2. **Login**: `POST /api/auth/login` (save token)
3. **Create Event**: `POST /api/events` (with token)
4. **Get Events**: `GET /api/events` (with token)
5. **Update Event**: `PATCH /api/events/:id` (with token)
6. **Get Swappable Slots**: `GET /api/swappable-slots` (with token)
7. **Create Swap Request**: `POST /api/swap-request` (with token)
8. **Get Swap Requests**: `GET /api/swap-requests` (with token)
9. **Respond to Swap**: `POST /api/swap-response/:requestId` (with token)

---

## Notes

- All protected endpoints require a valid JWT token
- Tokens expire after 7 days
- Password must be at least 6 characters
- Email must be valid format
- End time must be after start time for events
- Events in `SWAP_PENDING` status cannot be modified or deleted

