import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
  onSwapRequestReceived,
  onSwapRequestAccepted,
  onSwapRequestRejected,
  removeSocketListeners,
  getSocket,
} from "../services/socket";

export default function Requests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  // 🔹 Load all swap requests
  const loadRequests = async () => {
    try {
      const { data } = await API.get("/swap-requests");
      setIncoming(data.incoming || []);
      setOutgoing(data.outgoing || []);
    } catch (err) {
      console.error(err);
      alert("Error loading requests");
    }
  };

  useEffect(() => {
    loadRequests();

    // Set up real-time notifications
    const socket = getSocket();
    if (socket) {
      onSwapRequestReceived((data) => {
        alert(`🔔 ${data.message}`);
        loadRequests();
      });

      onSwapRequestAccepted((data) => {
        alert(`✅ ${data.message}`);
        loadRequests();
      });

      onSwapRequestRejected((data) => {
        alert(`❌ ${data.message}`);
        loadRequests();
      });
    }

    // Cleanup listeners on unmount
    return () => {
      removeSocketListeners();
    };
  }, []);

  // 🔹 Handle response (accept / reject)
  const respondToRequest = async (id, accepted) => {
    try {
      await API.post(`/swap-response/${id}`, { accept: accepted });
      alert(accepted ? "Swap accepted ✅" : "Swap rejected ❌");
      loadRequests(); // Refresh list
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error responding to request");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center text-primary mb-5">
        🔔 Swap Requests
      </h2>

      <div className="row">
        {/* Incoming Requests */}
        <div className="col-md-6 mb-4">
          <h4 className="text-success fw-semibold mb-3">
            Incoming Requests 📨
          </h4>
          {incoming.length === 0 ? (
            <p className="text-muted">No incoming requests.</p>
          ) : (
            incoming.map((req) => (
              <div key={req.id} className="card mb-3 shadow-sm border-0">
                <div className="card-body">
                  <h6 className="fw-bold text-dark mb-2">
                    {req.from_user_name} wants to swap:
                  </h6>
                  <p className="small mb-1">
                    <strong>Your Slot:</strong> {req.my_slot_title}
                  </p>
                  <p className="small mb-2">
                    <strong>Their Slot:</strong> {req.their_slot_title}
                  </p>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => respondToRequest(req.id, true)}
                      className="btn btn-sm btn-success"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => respondToRequest(req.id, false)}
                      className="btn btn-sm btn-danger"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Outgoing Requests */}
        <div className="col-md-6 mb-4">
          <h4 className="text-warning fw-semibold mb-3">
            Outgoing Requests 📤
          </h4>
          {outgoing.length === 0 ? (
            <p className="text-muted">No outgoing requests.</p>
          ) : (
            outgoing.map((req) => (
              <div key={req.id} className="card mb-3 shadow-sm border-0">
                <div className="card-body">
                  <h6 className="fw-bold text-dark mb-2">
                    You requested a swap with {req.to_user_name}
                  </h6>
                  <p className="small mb-1">
                    <strong>Your Slot:</strong> {req.my_slot_title}
                  </p>
                  <p className="small mb-2">
                    <strong>Their Slot:</strong> {req.their_slot_title}
                  </p>
                  <p className="badge bg-secondary">
                    Status: {req.status.toUpperCase()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}