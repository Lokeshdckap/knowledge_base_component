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

            // console.log("Refresh response:", refreshResponse);

            const newAccessToken = refreshResponse.data.access_token;
            // console.log(newAccessToken);
            // console.log("New Access Token:", newAccessToken);

            // Remove the old access token and store the new on
            localStorage.setItem("ACCESS_TOKEN", newAccessToken);

            // Retry the original request with the new access token
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            const retryOriginalRequest = await axios(error.config);

            console.log("Retry original request:", retryOriginalRequest);

            return retryOriginalRequest;
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            throw refreshError;
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
