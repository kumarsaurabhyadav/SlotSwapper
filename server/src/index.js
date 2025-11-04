// server/src/index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const path = require('path');

// ✅ Routes import
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const swapRoutes = require('./routes/swaps');

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(process.env.NODE_ENV === 'production' ? corsOptions : { origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
  }
  next();
});


// ✅ Use routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api', swapRoutes);

// Test route
app.get('/health', (req, res) => res.json({ ok: true }));
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 4000;

// ✅ Create HTTP + Socket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 🔹 On connection
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Join user-specific room when authenticated
  socket.on("join_user_room", (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`✅ User ${userId} joined their room`);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ✅ Export io instance (so we can use it in routes)
app.set("io", io);

// ✅ Start server
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));