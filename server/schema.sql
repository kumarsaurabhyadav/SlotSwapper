-- ============================
-- 📘 SlotSwapper Database Schema
-- ============================

-- 1️⃣ Enable UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2️⃣ Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  reset_token TEXT,  -- For password reset
  reset_token_expiry TIMESTAMP,  -- For password reset expiry
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for reset token
CREATE INDEX IF NOT EXISTS idx_reset_token ON users(reset_token);

-- 3️⃣ Events table
CREATE TYPE event_status AS ENUM ('BUSY', 'SWAPPABLE', 'SWAP_PENDING');

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status event_status DEFAULT 'BUSY',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4️⃣ Swap Requests table
CREATE TYPE swap_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

CREATE TABLE IF NOT EXISTS swap_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  responder_id UUID REFERENCES users(id) ON DELETE CASCADE,
  requester_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  responder_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  status swap_status DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_swap_status ON swap_requests(status);