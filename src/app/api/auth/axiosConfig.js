// axiosConfig.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_BACKEND,
});

// interceptor untuk menambahkan header authorize
axiosInstance.interceptors.request.use(
  async (config) => {
    // Import store secara dinamis
    const { default: store } = await import("../../../redux/store");

    const token = store?.getState().auth.token; // optional chaining
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
