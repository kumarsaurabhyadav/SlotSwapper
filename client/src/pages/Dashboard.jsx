import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useToastContext } from "../context/ToastContext";
import { formatDateTime, getStatusBadgeClass, getStatusBadgeText } from "../utils/dateFormat";
import { EventCardSkeleton } from "../components/LoadingSkeleton";

export default function Dashboard() {
  const toast = useToastContext();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // 🔹 Load user's events
  const loadEvents = async () => {
    try {
      setLoadingEvents(true);
      const { data } = await API.get("/events");
      setEvents(data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error loading events");
    } finally {
      setLoadingEvents(false);
    }
  };

  // 🔹 Create new event
  const createEvent = async (e) => {
    e.preventDefault();
    if (!form.title || !form.start_time || !form.end_time) {
      return toast.warning("Please fill all fields!");
    }

    // Validate that end time is after start time
    if (new Date(form.end_time) <= new Date(form.start_time)) {
      return toast.error("End time must be after start time!");
    }

    try {
      setLoading(true);
      await API.post("/events", form);
      toast.success("Event created successfully!");
      setForm({ title: "", start_time: "", end_time: "" });
      loadEvents();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error creating event");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update slot status (BUSY <-> SWAPPABLE)
  const toggleStatus = async (id, currentStatus) => {
    // Don't allow changing status if it's in a pending swap
    if (currentStatus === "SWAP_PENDING") {
      return toast.warning("This slot is in a pending swap and cannot be changed");
    }
    const newStatus = currentStatus === "SWAPPABLE" ? "BUSY" : "SWAPPABLE";
    try {
      await API.patch(`/events/${id}`, { status: newStatus });
      toast.success(`Status updated to ${getStatusBadgeText(newStatus)}`);
      loadEvents();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error updating slot status");
    }
  };

  // 🔹 Delete an event
  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      await API.delete(`/events/${id}`);
      toast.success("Event deleted successfully");
      loadEvents();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error deleting slot");
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="container py-5 page-transition">
      <div className="text-center mb-5">
        <h2 className="fw-bold gradient-text mb-2" style={{ fontSize: "2.5rem" }}>
          📅 My Calendar Slots
        </h2>
        <p className="text-muted">Manage your events and make them swappable</p>
      </div>

      {/* Create Event Form */}
      <div className="card shadow-sm mb-4 p-4 card-hover" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
        <h5 className="fw-bold mb-3">
          <i className="bi bi-plus-circle"></i> Create New Event
        </h5>
        <form onSubmit={createEvent} className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Event Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={{ border: "2px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "white" }}
            />
          </div>
          <div className="col-md-3">
            <input
              type="datetime-local"
              className="form-control"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              style={{ border: "2px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "white" }}
            />
          </div>
          <div className="col-md-3">
            <input
              type="datetime-local"
              className="form-control"
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              style={{ border: "2px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)", color: "white" }}
            />
          </div>
          <div className="col-md-2">
            <button
              type="submit"
              className="btn btn-light w-100 btn-smooth fw-bold"
              disabled={loading}
              style={{ background: "white", color: "#667eea" }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Adding...
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle me-2"></i>Add Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Events List */}
      <div className="row">
        {loadingEvents ? (
          <>
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </>
        ) : events.length === 0 ? (
          <div className="col-12">
            <div className="card border-0 shadow-sm text-center py-5 fade-in">
              <div className="card-body">
                <i className="bi bi-calendar-x" style={{ fontSize: "4rem", color: "#ccc" }}></i>
                <h4 className="text-muted mt-3 mb-2">No events found</h4>
                <p className="text-muted">Create your first event above to get started! 📅</p>
              </div>
            </div>
          </div>
        ) : (
          events.map((event, index) => (
            <div key={event.id} className="col-md-6 mb-4 fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="card shadow-sm border-0 h-100 card-hover">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="fw-bold mb-0" style={{ color: "#333" }}>{event.title}</h5>
                    <span className={`badge ${getStatusBadgeClass(event.status)}`}>
                      {getStatusBadgeText(event.status)}
                    </span>
                  </div>
                  <div className="mb-3 p-2" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
                    <p className="text-muted small mb-0">
                      <i className="bi bi-clock me-2"></i>
                      <strong>Start:</strong> {formatDateTime(event.start_time)}
                    </p>
                    <p className="text-muted small mb-0 mt-1">
                      <i className="bi bi-clock-fill me-2"></i>
                      <strong>End:</strong> {formatDateTime(event.end_time)}
                    </p>
                  </div>

                  <div className="d-flex gap-2 mt-auto">
                    <button
                      className="btn btn-outline-primary btn-sm btn-smooth flex-fill"
                      onClick={() => toggleStatus(event.id, event.status)}
                      disabled={event.status === "SWAP_PENDING"}
                    >
                      {event.status === "SWAPPABLE"
                        ? "✖️ Mark Busy"
                        : event.status === "SWAP_PENDING"
                        ? "⏳ Pending Swap"
                        : "✓ Make Swappable"}
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm btn-smooth"
                      onClick={() => deleteEvent(event.id)}
                      disabled={event.status === "SWAP_PENDING"}
                      style={{ minWidth: "80px" }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}