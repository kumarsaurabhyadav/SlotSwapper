# 🚀 SlotSwapper Backend Setup Guide

Welcome to **SlotSwapper** — a peer-to-peer time-slot swapping platform where users can trade their calendar events.

This document will help you **set up and run the backend locally** from scratch 🧠  

---

## 🧩 Prerequisites

Before starting, make sure you have these installed on your system:

| Tool | Version | Purpose |
|------|----------|----------|
| **Node.js** | v16+ | Run backend server |
| **npm / yarn** | latest | Install dependencies |
| **Docker** | latest | Run PostgreSQL easily |
| **Git** | latest | Clone and manage repo |

---

## ⚙️ 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd slotswap-backend/server
```

---

## 📦 2. Install Dependencies

```bash
npm install
```

This will install all required Node.js packages like Express, JWT, bcrypt, and PostgreSQL client.

---

## 🧾 3. Setup Environment Variables

Create a new file named `.env` inside the `server` folder (same level as `package.json`).

Copy the contents of `.env.example` and update it with your local values 👇

```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/slotswap
JWT_SECRET=my_jwt_secret_key
PORT=4000
```

> ⚠️ Never commit `.env` file to GitHub (it’s already ignored in `.gitignore`).

---

## 🐘 4. Setup PostgreSQL using Docker

Run PostgreSQL in a container (no need to install manually):

```bash
docker-compose up -d
```

✅ It will:
- Start a PostgreSQL container named `slotswapper_db`
- Expose it on port **5432**
- Auto-create the `slotswap` database

Check if it’s running:
```bash
docker ps
```

---

## 🧱 5. Apply Database Schema

Once PostgreSQL is running, create the required tables:

```bash
cat schema.sql | docker exec -i slotswapper_db psql -U postgres -d slotswap
```

✅ This command will:
- Create tables: `users`, `events`, `swap_requests`
- Setup relationships between them

---

## 🖥️ 6. Run the Development Server

Start your backend using Nodemon:

```bash
npm run dev
```

You should see:
```
✅ Connected to PostgreSQL database
✅ Server running on port 4000
```

---

## 🧪 7. Test APIs in Postman

All routes are prefixed with `/api`.

| Feature | Method | Endpoint | Auth Required |
|----------|--------|-----------|----------------|
| Signup | POST | `/api/auth/signup` | ❌ |
| Login | POST | `/api/auth/login` | ❌ |
| Get Events | GET | `/api/events` | ✅ |
| Create Event | POST | `/api/events` | ✅ |
| Update Event | PATCH | `/api/events/:id` | ✅ |
| Delete Event | DELETE | `/api/events/:id` | ✅ |
| Swappable Slots | GET | `/api/swappable-slots` | ✅ |
| Swap Request | POST | `/api/swap-request` | ✅ |
| Swap Response | POST | `/api/swap-response/:requestId` | ✅ |

Use **Authorization Header** with your JWT token for protected routes:
```
Authorization: Bearer <your_token_here>
```

---

## 🧠 8. Folder Structure Overview

```
server/
 ┣ src/
 ┃ ┣ routes/          → Express route handlers
 ┃ ┣ middleware/      → Auth verification
 ┃ ┣ services/        → Business logic (swap service)
 ┃ ┣ db.js            → Database connection
 ┃ ┗ index.js         → Entry point
 ┣ .env.example
 ┣ docker-compose.yml
 ┣ schema.sql
 ┣ package.json
 ┗ SETUP.md
```

---

## 🧰 9. Common Commands

| Command | Description |
|----------|-------------|
| `npm run dev` | Start server in development mode |
| `docker-compose up -d` | Start PostgreSQL container |
| `docker ps` | Check running Docker containers |
| `cat schema.sql ...` | Apply schema to DB |
| `git add . && git commit -m "msg"` | Push changes to repo |

---

## 💡 10. Troubleshooting

| Problem | Solution |
|----------|-----------|
| `Cannot connect to DB` | Ensure Docker is running and `.env` has correct `DATABASE_URL`. |
| `No token provided` | Add `Authorization: Bearer <token>` in Postman headers. |
| `Cannot POST /api/...` | Check if the route path is correct and method is right (`POST`, `PATCH`, etc). |

---

## 🏁 You're Done!

🎉 Congratulations — your **SlotSwapper backend** is now ready to use!  
Next step → build the frontend (React app) and connect it with these APIs.

---

### 👨‍💻 Author
**Kumar Saurabh**  
Backend Developer • MERN Stack Learner 🚀  
