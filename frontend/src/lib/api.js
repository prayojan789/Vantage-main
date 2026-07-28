import axios from "axios";

/**
 * VANTAGE API CLIENT
 * ───────────────────
 * Central Axios instance for all backend communication.
 * Uses environment variable for the base URL.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach JWT access token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("vantage-access-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Simplify response and handle 401s
api.interceptors.response.use(
  (response) => {
    const data = response.data;
    // Unwrap standardized APIResponse { success, message, data }
    if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
      return data.data;
    }
    return data;
  },
  (error) => {
    // Extract a useful error message without exposing sensitive data
    let message = "Request failed";
    let status = 0;

    if (error.response) {
      status = error.response.status;
      // FastAPI HTTPException returns { detail: "..." }
      // APIResponse errors return { success: false, message: "..." }
      const detail = error.response.data?.detail;
      const apiMessage = error.response.data?.message;
      message = detail || apiMessage || error.message || "Request failed";
    } else if (error.request) {
      message = "Network error — please check your connection and try again.";
    } else {
      message = error.message || "Request failed";
    }

    // On 401, clear auth state and notify the app via a custom event.
    // The AuthProvider listens for "auth:logout" and clears the user
    // session; AuthGuard then redirects to /sign-in on the next render.
    if (status === 401) {
      localStorage.removeItem("vantage-access-token");
      localStorage.removeItem("vantage-auth-user");
      window.dispatchEvent(new Event("auth:logout"));
    }

    const err = new Error(message);
    err.status = status;
    err.original = error;
    return Promise.reject(err);
  }
);

export default api;
