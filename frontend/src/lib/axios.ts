import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // Prevent infinite retries.
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });

      return axiosInstance(originalRequest);
    } catch {
      try {
        await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
      } finally {
        window.location.assign("/");
      }

      return Promise.reject(error);
    }
  },
);

export default axiosInstance;
