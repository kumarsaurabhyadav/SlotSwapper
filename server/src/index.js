// server/src/index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

// ✅ Routes import
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const swapRoutes = require('./routes/swaps');

const app = express();
app.use(bodyParser.json());

// ✅ Use routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api', swapRoutes);

// Test route
app.get('/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));