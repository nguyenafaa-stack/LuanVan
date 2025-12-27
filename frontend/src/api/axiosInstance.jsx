import axios from "axios";

export const BASE_URL = "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
