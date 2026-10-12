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

    // Don't refresh repeatedly for the same request.
    if (originalRequest._retry || originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Refresh runs in the background without reloading the page.
      await axios.post(`${BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });

      // Retry the original request with the updated cookie.
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // Try to invalidate the session and clear cookies.
      await axios
        .post(
          `${BASE_URL}/auth/logout`,
          {},
          {
            withCredentials: true,
          },
        )
        .catch(() => {});

      // Notify the app that authentication has expired.
      window.dispatchEvent(new Event("auth:expired"));

      return Promise.reject(refreshError);
    }
  },
);

export default axiosInstance;
