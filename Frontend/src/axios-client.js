import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:4000/",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    try {
      const { response } = error;
      if (response?.status === 401) {
        const refreshToken = localStorage.getItem("REFRESH_TOKEN");

        if (refreshToken) {
          try {
            const refreshResponse = await axios.post(
              "http://localhost:4000/api/auth/refresh-token",
              { refreshToken }
            );

            const newAccessToken = refreshResponse.data.access_token;
            localStorage.setItem("ACCESS_TOKEN", newAccessToken);

            // Retry the original request with the new access token
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            const retryOriginalRequest = await axios(error.config);
            return retryOriginalRequest;
          } catch (refreshError) {
            if (refreshError.response?.status === 401) {
              // Refresh token is expired, clear both tokens
              localStorage.removeItem("ACCESS_TOKEN");
              localStorage.removeItem("REFRESH_TOKEN");
              // Handle this scenario, e.g., redirect to login page
              console.error(
                "Both access and refresh tokens expired. User needs to re-authenticate."
              );
            } else {
              throw refreshError;
            }
          }
        } else {
          console.error("No refresh token found in local storage.");
        }
      }
    } catch (e) {
      console.error("Unexpected error:", e);
      throw e;
    }

    // If no refresh token or unsuccessful refresh, throw the original error
    throw error;
  }
);

export default axiosClient;
