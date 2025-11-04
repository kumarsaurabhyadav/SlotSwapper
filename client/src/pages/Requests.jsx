import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useToastContext } from "../context/ToastContext";
import {
  onSwapRequestReceived,
  onSwapRequestAccepted,
  onSwapRequestRejected,
  removeSocketListeners,
  getSocket,
} from "../services/socket";
import { formatDateTime, formatDateTimeShort } from "../utils/dateFormat";
import { RequestCardSkeleton } from "../components/LoadingSkeleton";

export default function Requests() {
  const toast = useToastContext();
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  // 🔹 Load all swap requests
  const loadRequests = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/swap-requests");
      setIncoming(data.incoming || []);
      setOutgoing(data.outgoing || []);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error loading requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();

    // Set up real-time notifications
    const socket = getSocket();
    if (socket) {
      onSwapRequestReceived((data) => {
        toast.info(data.message);
        loadRequests();
      });

      onSwapRequestAccepted((data) => {
        toast.success(data.message);
        loadRequests();
      });

      onSwapRequestRejected((data) => {
        toast.error(data.message);
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
      setProcessing(id);
      await API.post(`/swap-response/${id}`, { accept: accepted });
      toast.success(accepted ? "Swap accepted successfully!" : "Swap rejected");
      loadRequests(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error responding to request");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="container py-5 page-transition">
      <div className="text-center mb-5">
        <h2 className="fw-bold gradient-text mb-2" style={{ fontSize: "2.5rem" }}>
          🔔 Swap Requests
        </h2>
        <p className="text-muted">Manage incoming and outgoing swap requests</p>
      </div>

      {loading ? (
        <div className="row">
          <div className="col-md-6 mb-4">
            <RequestCardSkeleton />
            <RequestCardSkeleton />
          </div>
          <div className="col-md-6 mb-4">
            <RequestCardSkeleton />
            <RequestCardSkeleton />
          </div>
        </div>
      ) : (
        <div className="row">
          {/* Incoming Requests */}
          <div className="col-md-6 mb-4">
            <h4 className="text-success fw-semibold mb-3">
              Incoming Requests 📨
            </h4>
            {incoming.length === 0 ? (
              <div className="card border-0 shadow-sm fade-in">
                <div className="card-body text-center py-5">
                  <i className="bi bi-inbox" style={{ fontSize: "3rem", color: "#ccc" }}></i>
                  <p className="text-muted mt-3 mb-0">No incoming requests.</p>
                </div>
              </div>
            ) : (
              incoming.map((req, index) => (
                <div key={req.id} className="card mb-3 shadow-sm border-0 card-hover fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h6 className="fw-bold text-dark mb-0">
                        <i className="bi bi-person-circle me-2 text-success"></i>
                        {req.from_user_name} wants to swap
                      </h6>
                      <small className="text-muted">{formatDateTimeShort(req.created_at)}</small>
                    </div>
                    <div className="alert alert-light mb-2 p-3" style={{ borderRadius: "8px", border: "1px solid #e0e0e0" }}>
                      <small>
                        <strong className="text-primary">Your Slot:</strong> {req.my_slot_title}
                        <br />
                        <span className="text-muted">{formatDateTime(req.my_slot_start)} – {formatDateTime(req.my_slot_end)}</span>
                      </small>
                    </div>
                    <div className="alert alert-info mb-3 p-3" style={{ borderRadius: "8px" }}>
                      <small>
                        <strong>Their Slot:</strong> {req.their_slot_title}
                        <br />
                        <span className="text-muted">{formatDateTime(req.their_slot_start)} – {formatDateTime(req.their_slot_end)}</span>
                      </small>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => respondToRequest(req.id, true)}
                        className="btn btn-sm btn-success btn-smooth flex-fill"
                        disabled={processing === req.id}
                      >
                        {processing === req.id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>Accept
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => respondToRequest(req.id, false)}
                        className="btn btn-sm btn-danger btn-smooth flex-fill"
                        disabled={processing === req.id}
                      >
                        {processing === req.id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-x-circle me-2"></i>Reject
                          </>
                        )}
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
              <div className="card border-0 shadow-sm fade-in">
                <div className="card-body text-center py-5">
                  <i className="bi bi-send" style={{ fontSize: "3rem", color: "#ccc" }}></i>
                  <p className="text-muted mt-3 mb-0">No outgoing requests.</p>
                </div>
              </div>
            ) : (
              outgoing.map((req, index) => (
                <div key={req.id} className="card mb-3 shadow-sm border-0 card-hover fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h6 className="fw-bold text-dark mb-0">
                        <i className="bi bi-person-circle me-2 text-warning"></i>
                        Request to {req.to_user_name}
                      </h6>
                      <span className={`badge ${
                        req.status === 'PENDING' ? 'bg-warning' :
                        req.status === 'ACCEPTED' ? 'bg-success' :
                        'bg-danger'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="alert alert-light mb-2 p-3" style={{ borderRadius: "8px", border: "1px solid #e0e0e0" }}>
                      <small>
                        <strong className="text-primary">Your Slot:</strong> {req.my_slot_title}
                        <br />
                        <span className="text-muted">{formatDateTime(req.my_slot_start)} – {formatDateTime(req.my_slot_end)}</span>
                      </small>
                    </div>
                    <div className="alert alert-info mb-2 p-3" style={{ borderRadius: "8px" }}>
                      <small>
                        <strong>Their Slot:</strong> {req.their_slot_title}
                        <br />
                        <span className="text-muted">{formatDateTime(req.their_slot_start)} – {formatDateTime(req.their_slot_end)}</span>
                      </small>
                    </div>
                    <small className="text-muted">
                      <i className="bi bi-clock me-1"></i> {formatDateTimeShort(req.created_at)}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}