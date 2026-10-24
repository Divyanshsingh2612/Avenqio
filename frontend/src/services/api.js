
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("avenqio-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      localStorage.getItem("avenqio-token")
    ) {
      localStorage.removeItem("avenqio-token");
      localStorage.removeItem("avenqio-user");

      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
