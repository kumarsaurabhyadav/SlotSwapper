import { io } from "socket.io-client";

let socket = null;

// Get Socket URL from environment or use default
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_API_URL?.replace('/api', '') || "http://localhost:4000";

export const connectSocket = (userId) => {
  if (socket) {
    socket.disconnect();
  }
  
  socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("✅ Connected to server");
    if (userId) {
      socket.emit("join_user_room", userId);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected from server");
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const onSwapRequestReceived = (callback) => {
  if (socket) {
    socket.on("swap_request_received", callback);
  }
};

export const onSwapRequestAccepted = (callback) => {
  if (socket) {
    socket.on("swap_request_accepted", callback);
  }
};

export const onSwapRequestRejected = (callback) => {
  if (socket) {
    socket.on("swap_request_rejected", callback);
  }
};

export const removeSocketListeners = () => {
  if (socket) {
    socket.removeAllListeners("swap_request_received");
    socket.removeAllListeners("swap_request_accepted");
    socket.removeAllListeners("swap_request_rejected");
  }
};

