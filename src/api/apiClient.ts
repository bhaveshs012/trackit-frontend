import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 error and retry only once
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            "http://localhost:8000/api/v1/users/refresh-token",
            { refreshToken: refreshToken },
            { withCredentials: true }
          );

          const newAccessToken = response.data.data.accessToken;
          const newRefreshToken = response.data.data.refreshToken;

          Cookies.set("accessToken", newAccessToken);
          Cookies.set("refreshToken", newRefreshToken);

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return apiClient(originalRequest);
        } else {
          window.location.href = "/login";
        }
      } catch (refreshError) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
