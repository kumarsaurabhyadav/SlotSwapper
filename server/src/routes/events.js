// server/src/routes/events.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth'); // JWT middleware

// ✅ CREATE event
router.post('/', auth, async (req, res) => {
  try {
    const { title, start_time, end_time } = req.body;
    if (!title || !start_time || !end_time)
      return res.status(400).json({ error: 'All fields required' });

    const { rows } = await db.query(
      `INSERT INTO events (user_id, title, start_time, end_time, status)
       VALUES ($1, $2, $3, $4, 'BUSY')
       RETURNING *`,
      [req.user.id, title, start_time, end_time]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Create Event Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ READ all events for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM events WHERE user_id = $1 ORDER BY start_time',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get Events Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ UPDATE event (title/time/status)
router.patch('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, start_time, end_time, status } = req.body;

    const existing = await db.query(
      'SELECT * FROM events WHERE id=$1 AND user_id=$2',
      [id, req.user.id]
    );
    if (existing.rows.length === 0)
      return res.status(404).json({ error: 'Event not found' });

    const { rows } = await db.query(
      `UPDATE events
       SET title = COALESCE($1, title),
           start_time = COALESCE($2, start_time),
           end_time = COALESCE($3, end_time),
           status = COALESCE($4, status)
       WHERE id=$5
       RETURNING *`,
      [title, start_time, end_time, status, id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error('Update Event Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ DELETE event
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM events WHERE id=$1 AND user_id=$2', [
      id,
      req.user.id
    ]);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Delete Event Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;