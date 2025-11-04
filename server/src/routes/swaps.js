// server/src/routes/swaps.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// ✅ 1. Get all swappable slots (excluding self)
router.get('/api/swappable-slots', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT e.*, u.name AS owner_name, u.email AS owner_email
       FROM events e
       JOIN users u ON e.user_id = u.id
       WHERE e.status = 'SWAPPABLE' AND e.user_id != $1`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get Swappable Slots Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 2. Create a swap request
router.post('/api/swap-request', auth, async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;
    if (!mySlotId || !theirSlotId)
      return res.status(400).json({ error: 'Both slot IDs required' });

    const myEvent = await db.query(
      'SELECT * FROM events WHERE id=$1 AND user_id=$2 AND status=$3',
      [mySlotId, req.user.id, 'SWAPPABLE']
    );
    const theirEvent = await db.query(
      'SELECT * FROM events WHERE id=$1 AND status=$2',
      [theirSlotId, 'SWAPPABLE']
    );

    if (myEvent.rows.length === 0 || theirEvent.rows.length === 0)
      return res.status(400).json({ error: 'Invalid or non-swappable slots' });

    const requesterId = req.user.id;
    const responderId = theirEvent.rows[0].user_id;

    const { rows } = await db.query(
      `INSERT INTO swap_requests 
         (requester_id, responder_id, requester_event_id, responder_event_id, status)
       VALUES ($1, $2, $3, $4, 'PENDING') RETURNING *`,
      [requesterId, responderId, mySlotId, theirSlotId]
    );

    // Update events to SWAP_PENDING
    await db.query(`UPDATE events SET status='SWAP_PENDING' WHERE id IN ($1, $2)`, [
      mySlotId,
      theirSlotId,
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Swap Request Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 3. Respond to a swap request (accept/reject)
router.post('/api/swap-response/:requestId', auth, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { accept } = req.body;

    const request = await db.query(
      'SELECT * FROM swap_requests WHERE id=$1 AND responder_id=$2',
      [requestId, req.user.id]
    );

    if (request.rows.length === 0)
      return res.status(404).json({ error: 'Swap request not found' });

    const swap = request.rows[0];

    if (accept) {
      // Swap owners of the two events
      await db.query('BEGIN');
      await db.query(
        `UPDATE events SET user_id=$1, status='BUSY' WHERE id=$2`,
        [swap.requester_id, swap.responder_event_id]
      );
      await db.query(
        `UPDATE events SET user_id=$1, status='BUSY' WHERE id=$2`,
        [swap.responder_id, swap.requester_event_id]
      );
      await db.query(
        `UPDATE swap_requests SET status='ACCEPTED', updated_at=NOW() WHERE id=$1`,
        [requestId]
      );
      await db.query('COMMIT');
      return res.json({ message: 'Swap accepted successfully ✅' });
    } else {
      // Reject swap
      await db.query(
        `UPDATE swap_requests SET status='REJECTED', updated_at=NOW() WHERE id=$1`,
        [requestId]
      );
      await db.query(
        `UPDATE events SET status='SWAPPABLE' WHERE id IN ($1, $2)`,
        [swap.requester_event_id, swap.responder_event_id]
      );
      return res.json({ message: 'Swap rejected ❌' });
    }
  } catch (err) {
    console.error('Swap Response Error:', err.message);
    await db.query('ROLLBACK');
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;