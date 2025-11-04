// const pool = require("../db");

// async function createSwapRequest(requesterId, requestedEventId, targetEventId) {
//   const query = `
//     INSERT INTO swaps (requester_id, requested_event_id, target_event_id, status)
//     VALUES ($1, $2, $3, 'PENDING')
//     RETURNING *;
//   `;
//   const values = [requesterId, requestedEventId, targetEventId];
//   const result = await pool.query(query, values);
//   return result.rows[0];
// }

// async function getRequestsForUser(userId) {
//   const query = `
//     SELECT s.*, e1.title AS requester_event, e2.title AS target_event
//     FROM swaps s
//     JOIN events e1 ON s.requested_event_id = e1.id
//     JOIN events e2 ON s.target_event_id = e2.id
//     WHERE e2.user_id = $1;
//   `;
//   const result = await pool.query(query, [userId]);
//   return result.rows;
// }

// async function updateSwapStatus(swapId, status) {
//   const query = `
//     UPDATE swaps SET status = $1 WHERE id = $2 RETURNING *;
//   `;
//   const result = await pool.query(query, [status, swapId]);
//   return result.rows[0];
// }

// module.exports = {
//   createSwapRequest,
//   getRequestsForUser,
//   updateSwapStatus,
// };