// server/src/routes/swaps.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// ✅ 1. Get all swappable slots (excluding self)
router.get('/swappable-slots', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT e.*, u.name AS user_name, u.email AS owner_email
       FROM events e
       JOIN users u ON e.user_id = u.id
       WHERE e.status = 'SWAPPABLE' AND e.user_id != $1
       ORDER BY e.start_time ASC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get Swappable Slots Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 2. Get swap requests (incoming and outgoing)
router.get('/swap-requests', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Incoming requests (where current user is responder)
    const incomingQuery = await db.query(
      `SELECT 
        sr.id,
        sr.status,
        sr.created_at,
        sr.updated_at,
        u.name AS from_user_name,
        e1.title AS my_slot_title,
        e1.start_time AS my_slot_start,
        e1.end_time AS my_slot_end,
        e2.title AS their_slot_title,
        e2.start_time AS their_slot_start,
        e2.end_time AS their_slot_end
       FROM swap_requests sr
       JOIN users u ON sr.requester_id = u.id
       JOIN events e1 ON sr.responder_event_id = e1.id
       JOIN events e2 ON sr.requester_event_id = e2.id
       WHERE sr.responder_id = $1 AND sr.status = 'PENDING'
       ORDER BY sr.created_at DESC`,
      [userId]
    );

    // Outgoing requests (where current user is requester)
    const outgoingQuery = await db.query(
      `SELECT 
        sr.id,
        sr.status,
        sr.created_at,
        sr.updated_at,
        u.name AS to_user_name,
        e1.title AS my_slot_title,
        e1.start_time AS my_slot_start,
        e1.end_time AS my_slot_end,
        e2.title AS their_slot_title,
        e2.start_time AS their_slot_start,
        e2.end_time AS their_slot_end
       FROM swap_requests sr
       JOIN users u ON sr.responder_id = u.id
       JOIN events e1 ON sr.requester_event_id = e1.id
       JOIN events e2 ON sr.responder_event_id = e2.id
       WHERE sr.requester_id = $1
       ORDER BY sr.created_at DESC`,
      [userId]
    );

    res.json({
      incoming: incomingQuery.rows,
      outgoing: outgoingQuery.rows
    });
  } catch (err) {
    console.error('Get Swap Requests Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ 3. Create a swap request
router.post('/swap-request', auth, async (req, res) => {
  const client = await db.getClient();
  try {
    const { mySlotId, theirSlotId } = req.body;
    if (!mySlotId || !theirSlotId)
      return res.status(400).json({ error: 'Both slot IDs required' });

    await client.query('BEGIN');

    // Verify both slots exist and are swappable
    const myEvent = await client.query(
      'SELECT * FROM events WHERE id=$1 AND user_id=$2 AND status=$3',
      [mySlotId, req.user.id, 'SWAPPABLE']
    );
    const theirEvent = await client.query(
      'SELECT * FROM events WHERE id=$1 AND status=$2',
      [theirSlotId, 'SWAPPABLE']
    );

    if (myEvent.rows.length === 0 || theirEvent.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid or non-swappable slots' });
    }

    // Check if same user
    if (theirEvent.rows[0].user_id === req.user.id) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot swap with your own slot' });
    }

    const requesterId = req.user.id;
    const responderId = theirEvent.rows[0].user_id;

    // Check if swap request already exists
    const existing = await client.query(
      `SELECT * FROM swap_requests 
       WHERE requester_event_id=$1 AND responder_event_id=$2 AND status='PENDING'`,
      [mySlotId, theirSlotId]
    );

    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Swap request already exists' });
    }

    // Create swap request
    const { rows } = await client.query(
      `INSERT INTO swap_requests 
         (requester_id, responder_id, requester_event_id, responder_event_id, status)
       VALUES ($1, $2, $3, $4, 'PENDING') RETURNING *`,
      [requesterId, responderId, mySlotId, theirSlotId]
    );

    // Update events to SWAP_PENDING
    await client.query(
      `UPDATE events SET status='SWAP_PENDING' WHERE id IN ($1, $2)`,
      [mySlotId, theirSlotId]
    );

    await client.query('COMMIT');

    // Send real-time notification
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${responderId}`).emit('swap_request_received', {
        message: 'You have a new swap request!',
        requestId: rows[0].id
      });
    }

    res.status(201).json(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Swap Request Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

// ✅ 4. Respond to a swap request (accept/reject)
router.post('/swap-response/:requestId', auth, async (req, res) => {
  const client = await db.getClient();
  try {
    const { requestId } = req.params;
    const { accept } = req.body;

    if (typeof accept !== 'boolean') {
      return res.status(400).json({ error: 'accept must be a boolean' });
    }

    await client.query('BEGIN');

    // Get swap request
    const request = await client.query(
      'SELECT * FROM swap_requests WHERE id=$1 AND responder_id=$2',
      [requestId, req.user.id]
    );

    if (request.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Swap request not found' });
    }

    const swap = request.rows[0];

    if (swap.status !== 'PENDING') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Swap request already processed' });
    }

    if (accept) {
      // ACCEPT: Swap owners of the two events
      await client.query(
        `UPDATE events SET user_id=$1, status='BUSY' WHERE id=$2`,
        [swap.requester_id, swap.responder_event_id]
      );
      await client.query(
        `UPDATE events SET user_id=$1, status='BUSY' WHERE id=$2`,
        [swap.responder_id, swap.requester_event_id]
      );
      await client.query(
        `UPDATE swap_requests SET status='ACCEPTED', updated_at=NOW() WHERE id=$1`,
        [requestId]
      );

      // Reject any other pending requests for these events
      await client.query(
        `UPDATE swap_requests SET status='REJECTED', updated_at=NOW() 
         WHERE (requester_event_id IN ($1, $2) OR responder_event_id IN ($1, $2)) 
         AND id != $3 AND status = 'PENDING'`,
        [swap.requester_event_id, swap.responder_event_id, requestId]
      );

      // Set other events back to SWAPPABLE if they were pending
      await client.query(
        `UPDATE events SET status='SWAPPABLE' 
         WHERE id IN (
           SELECT requester_event_id FROM swap_requests 
           WHERE id IN (SELECT id FROM swap_requests 
             WHERE (requester_event_id IN ($1, $2) OR responder_event_id IN ($1, $2)) 
             AND id != $3 AND status = 'REJECTED')
           UNION
           SELECT responder_event_id FROM swap_requests 
           WHERE id IN (SELECT id FROM swap_requests 
             WHERE (requester_event_id IN ($1, $2) OR responder_event_id IN ($1, $2)) 
             AND id != $3 AND status = 'REJECTED')
         )
         AND status = 'SWAP_PENDING'`,
        [swap.requester_event_id, swap.responder_event_id, requestId]
      );

      await client.query('COMMIT');

      // Send real-time notification
      const io = req.app.get('io');
      if (io) {
        io.to(`user_${swap.requester_id}`).emit('swap_request_accepted', {
          message: 'Your swap request was accepted!',
          requestId: requestId
        });
      }

      return res.json({ message: 'Swap accepted successfully ✅' });
    } else {
      // REJECT: Set both slots back to SWAPPABLE
      await client.query(
        `UPDATE events SET status='SWAPPABLE' WHERE id IN ($1, $2)`,
        [swap.requester_event_id, swap.responder_event_id]
      );
      await client.query(
        `UPDATE swap_requests SET status='REJECTED', updated_at=NOW() WHERE id=$1`,
        [requestId]
      );

      await client.query('COMMIT');

      // Send real-time notification
      const io = req.app.get('io');
      if (io) {
        io.to(`user_${swap.requester_id}`).emit('swap_request_rejected', {
          message: 'Your swap request was rejected',
          requestId: requestId
        });
      }

      return res.json({ message: 'Swap rejected ❌' });
    }
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Swap Response Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
});

module.exports = router;