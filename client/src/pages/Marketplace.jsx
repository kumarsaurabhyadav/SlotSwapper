import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useToastContext } from "../context/ToastContext";
import { formatDateTime, formatDate } from "../utils/dateFormat";
import { SlotCardSkeleton } from "../components/LoadingSkeleton";

export default function Marketplace() {
  const toast = useToastContext();
  const [slots, setSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [targetSlot, setTargetSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingRequest, setSendingRequest] = useState(false);

  // 🔹 Load available swappable slots (other users)
  const loadSwappableSlots = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/swappable-slots");
      setSlots(data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error loading marketplace slots");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Load my own swappable slots
  const loadMySlots = async () => {
    try {
      const { data } = await API.get("/events");
      const swappables = data.filter((s) => s.status === "SWAPPABLE");
      setMySlots(swappables);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSwappableSlots();
    loadMySlots();
  }, []);

  // 🔹 Send swap request
  const sendSwapRequest = async () => {
    if (!selectedSlot) {
      return toast.warning("Please select one of your slots to offer.");
    }
    try {
      setSendingRequest(true);
      await API.post("/swap-request", {
        mySlotId: selectedSlot,
        theirSlotId: targetSlot.id,
      });
      toast.success("Swap request sent successfully!");
      setShowModal(false);
      setSelectedSlot("");
      setTargetSlot(null);
      // Refresh data
      loadSwappableSlots();
      loadMySlots();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error sending request");
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <div className="container py-5 page-transition">
      <div className="text-center mb-5">
        <h2 className="fw-bold gradient-text mb-2" style={{ fontSize: "2.5rem" }}>
          🧩 Marketplace — Swappable Slots
        </h2>
        <p className="text-muted">Discover and swap time slots with other users</p>
      </div>

      {loading ? (
        <div className="row">
          <SlotCardSkeleton />
          <SlotCardSkeleton />
          <SlotCardSkeleton />
          <SlotCardSkeleton />
          <SlotCardSkeleton />
          <SlotCardSkeleton />
        </div>
      ) : slots.length === 0 ? (
        <div className="col-12">
          <div className="card border-0 shadow-sm text-center py-5 fade-in">
            <div className="card-body">
              <i className="bi bi-inbox" style={{ fontSize: "4rem", color: "#ccc" }}></i>
              <h4 className="text-muted mt-3 mb-2">No swappable slots available</h4>
              <p className="text-muted">Check back later or create your own swappable slot!</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          {slots.map((slot, index) => (
            <div className="col-md-6 col-lg-4 mb-4 fade-in" key={slot.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="card shadow-sm border-0 h-100 card-hover">
                <div className="card-body d-flex flex-column">
                  <div className="mb-2">
                    <h5 className="card-title fw-bold mb-2" style={{ color: "#333" }}>{slot.title}</h5>
                    <div className="p-2 mb-2" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
                      <p className="card-text text-muted small mb-1">
                        <i className="bi bi-clock me-2"></i>
                        <strong>Start:</strong> {formatDateTime(slot.start_time)}
                      </p>
                      <p className="card-text text-muted small mb-0">
                        <i className="bi bi-clock-fill me-2"></i>
                        <strong>End:</strong> {formatDateTime(slot.end_time)}
                      </p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="small text-secondary mb-0">
                      <i className="bi bi-person-circle me-2"></i>
                      Posted by: <strong>{slot.user_name || "Anonymous"}</strong>
                    </p>
                  </div>
                  <button
                    className="btn btn-primary btn-sm mt-auto btn-smooth"
                    onClick={() => {
                      setTargetSlot(slot);
                      setShowModal(true);
                    }}
                    disabled={mySlots.length === 0}
                    style={{ fontWeight: "600" }}
                  >
                    {mySlots.length === 0 ? (
                      <>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        No Swappable Slots
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-repeat me-2"></i>
                        Request Swap
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Swap Modal */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center fade-in"
          style={{ zIndex: 1000, backdropFilter: "blur(5px)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div
            className="card shadow-lg p-4 slide-in"
            style={{ 
              width: "450px", 
              borderRadius: "16px", 
              maxWidth: "90vw",
              border: "none",
              background: "white"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Offer one of your slots to swap 🔄</h5>
              <button
                className="btn-close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              ></button>
            </div>

            {targetSlot && (
              <div className="alert alert-info mb-3">
                <strong>Swapping with:</strong> {targetSlot.title}
                <br />
                <small>{formatDateTime(targetSlot.start_time)} – {formatDateTime(targetSlot.end_time)}</small>
              </div>
            )}

            {mySlots.length === 0 ? (
              <div className="alert alert-warning mb-3">
                <p className="mb-0">You have no swappable slots.</p>
                <small>Go to Dashboard and mark some events as "Swappable" first.</small>
              </div>
            ) : (
              <select
                className="form-select mb-3"
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
              >
                <option value="">Select your slot to offer</option>
                {mySlots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({formatDate(s.start_time)})
                  </option>
                ))}
              </select>
            )}

            <div className="d-flex justify-content-between gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowModal(false);
                  setSelectedSlot("");
                }}
                disabled={sendingRequest}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={sendSwapRequest}
                disabled={!selectedSlot || sendingRequest}
              >
                {sendingRequest ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Sending...
                  </>
                ) : (
                  "Send Request"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}