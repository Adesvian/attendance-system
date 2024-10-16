// axiosConfig.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_BACKEND,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const { default: store } = await import("../../../redux/store");

    const token = store?.getState().auth.token;
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
