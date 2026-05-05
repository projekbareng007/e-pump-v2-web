import axios from "axios";
import { getAuthToken, useAuthStore } from "@/stores/auth-store";

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

api.interceptors.request.use((config) => {
  if (config.headers.Authorization) return config;

  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !isLoginRequest
    ) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
