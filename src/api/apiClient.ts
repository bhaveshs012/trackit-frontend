import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://trackit-backend-bgve.onrender.com/api/v1",
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 error
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          "https://trackit-backend-bgve.onrender.com/api/v1/users/refresh-token",
          { withCredentials: true } // Ensure this sends the cookies
        );

        const newAccessToken = response.data.data.accessToken;

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
