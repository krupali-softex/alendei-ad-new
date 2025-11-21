import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_BASE_URL_PRODUCTION : import.meta.env.VITE_BASE_URL_DEVELOP,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {  // IMP if role based system this needs to be updated backend should not sent 403 on expiration of token
      console.error("Unauthorized or Forbidden request:", error);
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("logoutEvent")); // Trigger logout event
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
