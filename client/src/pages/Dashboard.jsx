import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    start_time: "",
    end_time: "",
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Load user's events
  const loadEvents = async () => {
    try {
      const { data } = await API.get("/events");
      setEvents(data);
    } catch (err) {
      console.error(err);
      alert("Error loading events");
    }
  };

  // 🔹 Create new event
  const createEvent = async (e) => {
    e.preventDefault();
    if (!form.title || !form.start_time || !form.end_time)
      return alert("Please fill all fields!");

    try {
      setLoading(true);
      await API.post("/events", form);
      alert("Event created successfully ✅");
      setForm({ title: "", start_time: "", end_time: "" });
      loadEvents();
    } catch (err) {
      console.error(err);
      alert("Error creating event");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update slot status (BUSY <-> SWAPPABLE)
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "SWAPPABLE" ? "BUSY" : "SWAPPABLE";
    try {
      await API.patch(`/events/${id}`, { status: newStatus });
      loadEvents();
    } catch (err) {
      console.error(err);
      alert("Error updating slot status");
    }
  };

  // 🔹 Delete an event
  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      await API.delete(`/events/${id}`);
      loadEvents();
    } catch (err) {
      console.error(err);
      alert("Error deleting slot");
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="fw-bold text-center text-primary mb-4">
        📅 My Calendar Slots
      </h2>

      {/* Create Event Form */}
      <div className="card shadow-sm mb-4 p-4">
        <h5 className="fw-semibold mb-3">Create New Event</h5>
        <form onSubmit={createEvent} className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Event Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              type="datetime-local"
              className="form-control"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              type="datetime-local"
              className="form-control"
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Event"}
            </button>
          </div>
        </form>
      </div>

      {/* Events List */}
      <div className="row">
        {events.length === 0 ? (
          <p className="text-muted text-center">No events found. Add one!</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="col-md-6 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h5 className="fw-bold">{event.title}</h5>
                  <p className="text-muted small">
                    {new Date(event.start_time).toLocaleString()} –{" "}
                    {new Date(event.end_time).toLocaleString()}
                  </p>
                  <p className="badge bg-secondary">
                    Status: {event.status || "BUSY"}
                  </p>

                  <div className="d-flex gap-2 mt-3">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => toggleStatus(event.id, event.status)}
                    >
                      {event.status === "SWAPPABLE"
                        ? "Mark Busy"
                        : "Make Swappable"}
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteEvent(event.id)}
                    >
                      Delete
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