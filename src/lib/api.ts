import axios from "axios";

// Use the Next.js proxy route in the browser so requests go through
// the same origin — avoids CORS and keeps the backend URL server-side only.
// In SSR/Node context fall back to the direct backend URL.
const baseURL =
  typeof window !== "undefined"
    ? "/api/proxy"
    : process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("auth-storage");
    if (stored) {
      const { state } = JSON.parse(stored);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    }
  }
  return config;
});

// Handle 401 → auto-logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth-storage");
      document.cookie = "auth-token=; path=/; max-age=0; SameSite=Lax";
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default api;
