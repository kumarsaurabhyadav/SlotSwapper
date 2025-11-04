import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (socket) {
    socket.disconnect();
  }
  
  socket = io("http://localhost:4000", {
    transports: ["websocket"],
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

