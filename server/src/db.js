// server/src/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch(err => console.error('❌ DB connection error:', err.message));

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect()
};