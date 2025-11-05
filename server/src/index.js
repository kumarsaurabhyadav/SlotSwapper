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

// ✅ Body parsers
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- ✅ CORS Configuration (Multiple Frontend Support) ---
const allowedOrigins = [
  'http://localhost:3000',
  'https://slot-swapper.vercel.app',              // your main frontend
  'https://slot-swapper-flax-seven.vercel.app',   // your friend's frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS Blocked Origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ✅ Security headers (Production only)
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

// ✅ Health Check Endpoint
app.get('/health', (req, res) =>
  res.json({ ok: true, environment: process.env.NODE_ENV || 'development' })
);

// ✅ Setup Socket.io
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 4000;

// ✅ Create HTTP + Socket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 🔹 Handle Socket.io connections
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

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

// ✅ Export io instance (for use in routes)
app.set("io", io);

// ✅ Start server
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
