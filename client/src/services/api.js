import axios from "axios";

// Get API URL from environment or use default
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

const API = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default API;