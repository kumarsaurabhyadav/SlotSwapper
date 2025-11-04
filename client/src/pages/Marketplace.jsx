import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Marketplace() {
  const [slots, setSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [targetSlot, setTargetSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 🔹 Load available swappable slots (other users)
  const loadSwappableSlots = async () => {
    try {
      const { data } = await API.get("/swappable-slots");
      setSlots(data);
    } catch (err) {
      console.error(err);
      alert("Error loading marketplace slots");
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
    if (!selectedSlot) return alert("Please select one of your slots to offer.");
    try {
      await API.post("/swap-request", {
        mySlotId: selectedSlot,
        theirSlotId: targetSlot.id,
      });
      alert("Swap request sent successfully ✅");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error sending request");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center text-primary mb-4">
        🧩 Marketplace — Swappable Slots
      </h2>

      {slots.length === 0 ? (
        <p className="text-center text-muted">No swappable slots available right now 😴</p>
      ) : (
        <div className="row">
          {slots.map((slot) => (
            <div className="col-md-6 col-lg-4 mb-4" key={slot.id}>
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{slot.title}</h5>
                  <p className="card-text text-muted small mb-2">
                    {new Date(slot.start_time).toLocaleString()} –{" "}
                    {new Date(slot.end_time).toLocaleString()}
                  </p>
                  <p className="small text-secondary mb-3">
                    Posted by: <strong>{slot.user_name || "Anonymous"}</strong>
                  </p>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      setTargetSlot(slot);
                      setShowModal(true);
                    }}
                  >
                    Request Swap
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
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1000 }}
        >
          <div
            className="card shadow p-4"
            style={{ width: "400px", borderRadius: "10px" }}
          >
            <h5 className="text-center mb-3">
              Offer one of your slots to swap 🔄
            </h5>

            {mySlots.length === 0 ? (
              <p className="text-muted text-center mb-3">
                You have no swappable slots.
              </p>
            ) : (
              <select
                className="form-select mb-3"
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
              >
                <option value="">Select your slot</option>
                {mySlots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({new Date(s.start_time).toLocaleDateString()})
                  </option>
                ))}
              </select>
            )}

            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={sendSwapRequest}
                disabled={!selectedSlot}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}